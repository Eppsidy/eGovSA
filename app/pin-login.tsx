import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'

export default function PinLoginScreen() {
  const [pin, setPin] = useState(['', '', '', ''])
  const inputs = useRef<(TextInput | null)[]>([])
  const { verifyPin } = useAuth()
  const router = useRouter()
  const { email } = useLocalSearchParams<{ email?: string }>()
  const handleChange = (val:string, idx:number) => { const arr=[...pin]; arr[idx]=val.replace(/\D/g,'').slice(-1); setPin(arr); if(arr[idx] && idx<3) inputs.current[idx+1]?.focus() }
  const submit = async () => { const entered = pin.join(''); if(entered.length!==4) return; const ok = await verifyPin(entered); if (ok) { router.replace('/home') } else { Alert.alert('Incorrect PIN','Please try again'); setPin(['','','','']); inputs.current[0]?.focus() } }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>
      <Text style={styles.subtitle}>Unlock your account</Text>
      <View style={styles.pinRow}>{pin.map((d,i)=>(<TextInput key={i} ref={el=>{inputs.current[i]=el}} style={styles.pinInput} keyboardType='number-pad' secureTextEntry maxLength={1} value={d} onChangeText={v=>handleChange(v,i)} onSubmitEditing={submit} />))}</View>
      <TouchableOpacity style={[styles.button, pin.join('').length!==4 && styles.buttonDisabled]} disabled={pin.join('').length!==4} onPress={submit}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => email ? router.push({ pathname: '/pin-recover', params: { email: String(email) } }) : router.push('/pin-recover')}>
        <Text style={styles.helpText}>Forgot PIN?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/get-started')}>
        <Text style={[styles.helpText, { marginTop: 12 }]}>Create new account</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:24, paddingTop:100, backgroundColor:'#FFF' },
  title:{ fontSize:30, fontWeight:'700', marginBottom:8, color:'#222' },
  subtitle:{ fontSize:16, color:'#666', marginBottom:40 },
  pinRow:{ flexDirection:'row', justifyContent:'space-between', marginBottom:32 },
  pinInput:{ width:60, height:70, borderWidth:1, borderColor:'#E0E0E0', borderRadius:14, textAlign:'center', fontSize:30, backgroundColor:'#FAFAFA' },
  button:{ backgroundColor:'#de6c0fff', paddingVertical:16, borderRadius:12, alignItems:'center', shadowColor:'#de6c0fff', shadowOffset:{ width:0, height:4 }, shadowOpacity:0.3, shadowRadius:8, elevation:6 },
  buttonDisabled:{ backgroundColor:'#fba158ff' },
  buttonText:{ color:'#FFF', fontSize:18, fontWeight:'600' },
  helpText:{ textAlign:'center', marginTop:24, color:'#999', fontSize:12 },
})