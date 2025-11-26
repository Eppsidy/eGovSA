import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '../../src/hooks/useThemeColor'
import { supabase } from '../../src/lib/supabase'

export default function EmailOTPScreen() {
  const router = useRouter()
  const colors = useThemeColor()
  const { email, firstName, lastName } = useLocalSearchParams<{ email: string; firstName: string; lastName: string }>()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const inputs = useRef<(TextInput | null)[]>([])

  useEffect(() => { sendOTP() }, [])

  const sendOTP = async () => {
    if (!email) return
    try { setSending(true); const { error } = await supabase.auth.signInWithOtp({ email, options:{ shouldCreateUser:true } }); if (error) throw error; Alert.alert('OTP Sent', `A 6-digit code was sent to ${email}`) } catch(e:any){ Alert.alert('Error', e.message) } finally { setSending(false) }
  }
  const handleChange = (value:string, index:number) => { const newCode=[...code]; newCode[index]=value.replace(/\D/g,'').slice(-1); setCode(newCode); if(newCode[index] && index<5){ inputs.current[index+1]?.focus() } }
  const verifyCode = async () => { const token = code.join(''); if(token.length!==6){ Alert.alert('Incomplete','Please enter the full 6-digit code'); return } try { setVerifying(true); const { data, error } = await supabase.auth.verifyOtp({ email: email!, token, type:'email' }); if (error) throw error; if (data.session) { router.replace({ pathname:'/login/pin-setup', params:{ email, firstName, lastName } }) } else { Alert.alert('Verification Failed','Please try again') } } catch(e:any){ Alert.alert('Error', e.message) } finally { setVerifying(false) } }

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'? 'padding': undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Email Verification</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter the 6-digit code sent to</Text>
        <Text style={[styles.email, { color: colors.primary }]}>{email}</Text>
        <View style={styles.codeRow}>{code.map((d,idx)=>(<TextInput key={idx} ref={el=>{inputs.current[idx]=el}} style={[styles.codeInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} keyboardType='number-pad' value={d} onChangeText={v=>handleChange(v,idx)} maxLength={1} autoFocus={idx===0} />))}</View>
        <TouchableOpacity style={[styles.button, verifying&&styles.buttonDisabled]} disabled={verifying} onPress={verifyCode}><Text style={styles.buttonText}>{verifying? 'Verifying...' : 'Verify Code'}</Text></TouchableOpacity>
        <TouchableOpacity disabled={sending} onPress={sendOTP} style={styles.resendContainer}><Text style={[styles.resendText, { color: colors.primary }]}>{sending? 'Sending...' : 'Resend Code'}</Text></TouchableOpacity>
  <Text style={[styles.progressText, { color: colors.textMuted }]}>Step 2 of 4</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:24, paddingTop:80 },
  title:{ fontSize:28,fontWeight:'700',marginBottom:8 },
  subtitle:{ fontSize:16 },
  email:{ fontSize:16,marginBottom:32,marginTop:4 },
  codeRow:{ flexDirection:'row', justifyContent:'space-between', marginBottom:32 },
  codeInput:{ width:50,height:60,borderWidth:1,borderRadius:10,textAlign:'center',fontSize:24 },
  button:{ backgroundColor:'#0066CC', paddingVertical:16, borderRadius:12, alignItems:'center', shadowColor:'#0066CC', shadowOffset:{ width:0,height:4 }, shadowOpacity:0.3, shadowRadius:8, elevation:6 },
  buttonDisabled:{ backgroundColor:'#A0C8E8' },
  buttonText:{ color:'#FFF', fontSize:18, fontWeight:'600' },
  resendContainer:{ marginTop:20, alignItems:'center' },
  resendText:{ fontSize:14, fontWeight:'500' },
  progressText:{ textAlign:'center', marginTop:32, fontSize:12 },
})