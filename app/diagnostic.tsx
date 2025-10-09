import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { supabase } from '../src/lib/supabase'

export default function DiagnosticScreen() {
  const { user, session, loading } = useAuth()
  const [storedEmail, setStoredEmail] = useState<string | null>(null)
  const [storedPin, setStoredPin] = useState<boolean>(false)
  const [rpcTest, setRpcTest] = useState<any>(null)

  useEffect(() => {
    const runDiagnostics = async () => {
      // Check stored email
      const email = await SecureStore.getItemAsync('userEmail')
      setStoredEmail(email)

      // Check if PIN exists
      const pin = await SecureStore.getItemAsync('userPin')
      setStoredPin(!!pin)

      // Test RPC if we have an email
      if (email) {
        const { data, error } = await supabase
          .rpc('get_profile_by_email', { p_email: email })
        setRpcTest({ data, error: error?.message })
      }
    }

    runDiagnostics()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 Authentication Diagnostics</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auth Context State:</Text>
        <Text style={styles.info}>Loading: {loading ? 'YES' : 'NO'}</Text>
        <Text style={styles.info}>Has Session: {session ? 'YES' : 'NO'}</Text>
        <Text style={styles.info}>Has User: {user ? 'YES' : 'NO'}</Text>
        {user && (
          <>
            <Text style={styles.info}>User ID: {user.id}</Text>
            <Text style={styles.info}>Email: {user.email}</Text>
            <Text style={styles.info}>Name: {user.first_name} {user.last_name}</Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SecureStore:</Text>
        <Text style={styles.info}>Stored Email: {storedEmail || 'NONE'}</Text>
        <Text style={styles.info}>Has PIN: {storedPin ? 'YES' : 'NO'}</Text>
      </View>

      {storedEmail && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RPC Test Result:</Text>
          {rpcTest ? (
            <>
              <Text style={styles.info}>Has Data: {rpcTest.data ? 'YES' : 'NO'}</Text>
              <Text style={styles.info}>Error: {rpcTest.error || 'NONE'}</Text>
              {rpcTest.data && (
                <>
                  <Text style={styles.info}>Fetched ID: {rpcTest.data.id}</Text>
                  <Text style={styles.info}>Fetched Email: {rpcTest.data.email}</Text>
                </>
              )}
            </>
          ) : (
            <Text style={styles.info}>Running test...</Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await SecureStore.deleteItemAsync('userEmail')
          await SecureStore.deleteItemAsync('userPin')
          setStoredEmail(null)
          setStoredPin(false)
          alert('Cleared SecureStore')
        }}
      >
        <Text style={styles.buttonText}>Clear SecureStore</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1A2B4A',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2B4A',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
