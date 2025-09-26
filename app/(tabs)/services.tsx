import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'

export default function ServicesScreen() {
  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>Browse government services.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#111', fontWeight: '600' },
})
