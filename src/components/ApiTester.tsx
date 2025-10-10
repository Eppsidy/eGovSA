import axios from 'axios'
import React, { useState } from 'react'
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../contexts/AuthContext'

/**
 * API Tester Component
 * 
 * Add this to your app temporarily to test the backend connection.
 * 
 * Usage in home.tsx (add at the top of the screen):
 * import ApiTester from '../../src/components/ApiTester'
 * 
 * Then add <ApiTester /> in your JSX
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

export default function ApiTester() {
  const { user } = useAuth()
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResult('Testing...')
    
    try {
      console.log('🧪 Testing connection to:', API_URL)
      
      // Simple connectivity test
      const response = await axios.get(`${API_URL}/api/home/welcome/550e8400-e29b-41d4-a716-446655440000`, {
        timeout: 5000
      })
      
      setTestResult(`✅ SUCCESS!\n\nStatus: ${response.status}\n\nResponse:\n${JSON.stringify(response.data, null, 2)}`)
      console.log('✅ Test passed:', response.data)
    } catch (error: any) {
      let errorMsg = '❌ FAILED\n\n'
      
      if (error.code === 'ECONNABORTED') {
        errorMsg += 'Connection timeout - Backend not reachable'
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        errorMsg += 'Network Error - Check:\n'
        errorMsg += '1. Backend is running\n'
        errorMsg += '2. Correct URL in .env\n'
        errorMsg += '3. Firewall settings\n'
        errorMsg += `\nURL: ${API_URL}`
      } else if (error.response) {
        errorMsg += `Status: ${error.response.status}\n`
        errorMsg += `Message: ${error.response.statusText}\n`
        errorMsg += `Data: ${JSON.stringify(error.response.data, null, 2)}`
      } else {
        errorMsg += `Error: ${error.message}`
      }
      
      setTestResult(errorMsg)
      console.error('❌ Test failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const testWithRealUserId = async (userId: string) => {
    setLoading(true)
    setTestResult('Testing with real user ID...')
    
    try {
      console.log('🧪 Testing with user ID:', userId)
      
      const response = await axios.get(`${API_URL}/api/home/welcome/${userId}`, {
        timeout: 5000
      })
      
      setTestResult(`✅ SUCCESS!\n\nMessage: ${response.data.message}\n\nUser:\n${JSON.stringify(response.data.user, null, 2)}`)
      console.log('✅ Test passed:', response.data)
    } catch (error: any) {
      let errorMsg = '❌ FAILED\n\n'
      
      if (error.response?.status === 404) {
        errorMsg += 'User not found in backend database\n'
        errorMsg += `User ID: ${userId}`
      } else if (error.response?.status === 400) {
        errorMsg += 'Invalid user ID format'
      } else {
        errorMsg += `Error: ${error.message}\n`
        if (error.response) {
          errorMsg += `Status: ${error.response.status}\n`
          errorMsg += `Data: ${JSON.stringify(error.response.data, null, 2)}`
        }
      }
      
      setTestResult(errorMsg)
      console.error('❌ Test failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 API Tester</Text>
      <Text style={styles.url}>URL: {API_URL}</Text>
      
      {user?.id && (
        <View style={styles.userIdContainer}>
          <Text style={styles.userIdLabel}>🔑 Your User ID:</Text>
          <Text style={styles.userId} selectable>{user.id}</Text>
          <Text style={styles.userIdHint}>
            👆 Copy this ID to insert into backend database
          </Text>
        </View>
      )}
      
      <View style={styles.buttons}>
        <Button 
          title="Test Connection (Generic)" 
          onPress={testConnection}
          disabled={loading}
        />
        
        {user?.id && (
          <Button 
            title="Test with My User ID ⭐" 
            onPress={() => testWithRealUserId(user.id)}
            disabled={loading}
            color="#27AE60"
          />
        )}
      </View>
      
      {loading && <ActivityIndicator size="large" color="#0a7ea4" />}
      
      {testResult && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultText}>{testResult}</Text>
        </ScrollView>
      )}
      
      <Text style={styles.info}>
        💡 This tests if the backend is reachable.{'\n'}
        Remove this component after debugging.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  url: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  userIdContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  userIdLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 4,
  },
  userId: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#0c4a6e',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  userIdHint: {
    fontSize: 10,
    color: '#0369a1',
    fontStyle: 'italic',
  },
  buttons: {
    gap: 8,
    marginBottom: 12,
  },
  resultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 12,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  info: {
    fontSize: 11,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
})
