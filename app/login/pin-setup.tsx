import * as Crypto from 'expo-crypto'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'

export default function PinSetupScreen() {
  const router = useRouter()
  const { email, firstName, lastName } = useLocalSearchParams<{ email:string; firstName:string; lastName:string }>()
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [step, setStep] = useState<1|2>(1)
  const inputs = useRef<(TextInput | null)[]>([])
  const confirmInputs = useRef<(TextInput | null)[]>([])
  const { savePin, updateUserProfile } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleChange = (value:string, index:number, confirm=false) => { const setter = confirm? setConfirmPin : setPin; const arr = confirm? [...confirmPin] : [...pin]; arr[index] = value.replace(/\D/g,'').slice(-1); setter(arr); const refs = confirm? confirmInputs.current : inputs.current; if (arr[index] && index<3) refs[index+1]?.focus() }
  const pinsToString = (arr:string[]) => arr.join('')
  const handleNext = () => { if (pinsToString(pin).length !== 4) { Alert.alert('Incomplete','Enter 4 digits'); return } setStep(2); confirmInputs.current[0]?.focus() }
  const hashPin = async (plain:string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, plain)
  const saveAll = async () => { 
    const p1 = pinsToString(pin); 
    const p2 = pinsToString(confirmPin); 
    
    if (p2.length!==4){ 
      Alert.alert('Incomplete','Enter confirmation PIN'); 
      return 
    } 
    
    if (p1!==p2){ 
      Alert.alert('Mismatch','PINs do not match'); 
      return 
    } 
    
    try { 
      setSaving(true); 
      await savePin(p1); 
      
      const hashed = await hashPin(p1); 
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('Failed to get user information');
      }
      
      if (!userData.user?.id) {
        throw new Error('User ID not found');
      }
      
      console.log('Attempting to save user profile for user ID:', userData.user.id);
      console.log('Profile data:', { id: userData.user.id, first_name: firstName, last_name: lastName, email });
      
      const { data: upsertData, error } = await supabase
        .from('profiles')
        .upsert({ id: userData.user.id, first_name: firstName, last_name: lastName, full_name: `${firstName ?? ''} ${lastName ?? ''}`.trim(), email, pin: hashed })
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Database error:', {
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
          code: (error as any).code,
        });
        throw new Error(error.message);
      }
      console.log('Profile upsert success:', upsertData);
      
      // Store email for future PIN-based login
      await SecureStore.setItemAsync('userEmail', email);
      console.log('User email stored for PIN-based login:', email);
      
      updateUserProfile({ first_name: firstName, last_name: lastName, email }); 
      router.replace('/home') 
    } catch(e:any){ 
      console.error('Full error details:', e);
      Alert.alert('Database error saving new user', e.message || 'Unknown error occurred') 
    } finally { 
      setSaving(false) 
    } 
  }
  const renderPinInputs = (confirm=false) => { const arr = confirm? confirmPin : pin; return (<View style={styles.pinRow}>{arr.map((d,i)=>(<TextInput key={i} ref={el=>{ if(confirm){ confirmInputs.current[i]=el } else { inputs.current[i]=el } }} style={styles.pinInput} keyboardType='number-pad' secureTextEntry maxLength={1} value={d} onChangeText={v=>handleChange(v,i,confirm)} />))}</View>) }
  return (
    <View style={styles.container}>
  {step===1 && (<><Text style={styles.title}>Create App PIN</Text><Text style={styles.subtitle}>Set a 4-digit PIN to secure quick access</Text>{renderPinInputs(false)}<TouchableOpacity style={[styles.button, pinsToString(pin).length!==4 && styles.buttonDisabled]} disabled={pinsToString(pin).length!==4} onPress={handleNext}><Text style={styles.buttonText}>Continue</Text></TouchableOpacity><Text style={styles.progressText}>Step 3 of 4</Text></>) }
  {step===2 && (<><Text style={styles.title}>Confirm PIN</Text><Text style={styles.subtitle}>Re-enter your PIN</Text>{renderPinInputs(true)}<TouchableOpacity style={[styles.button, (pinsToString(confirmPin).length!==4||saving)&&styles.buttonDisabled]} disabled={pinsToString(confirmPin).length!==4||saving} onPress={saveAll}><Text style={styles.buttonText}>{saving? 'Saving...' : 'Finish'}</Text></TouchableOpacity><Text style={styles.progressText}>Step 4 of 4</Text></>) }
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:24, paddingTop:80, backgroundColor:'#FFF' },
  title:{ fontSize:28, fontWeight:'700', marginBottom:8, color:'#222' },
  subtitle:{ fontSize:16, color:'#666', marginBottom:32 },
  pinRow:{ flexDirection:'row', justifyContent:'space-between', marginBottom:32 },
  pinInput:{ width:60, height:70, borderWidth:1, borderColor:'#E0E0E0', borderRadius:14, textAlign:'center', fontSize:30, backgroundColor:'#FAFAFA' },
  button:{ backgroundColor:'#de6c0fff', paddingVertical:16, borderRadius:12, alignItems:'center', shadowColor:'#de6c0fff', shadowOffset:{ width:0, height:4 }, shadowOpacity:0.3, shadowRadius:8, elevation:6 },
  buttonDisabled:{ backgroundColor:'#fba158ff' },
  buttonText:{ color:'#FFF', fontSize:18, fontWeight:'600' },
  progressText:{ textAlign:'center', marginTop:32, color:'#999', fontSize:12 },
})