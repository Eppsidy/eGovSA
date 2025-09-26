import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function ServicesScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.text}>Browse government services.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { color: '#111', fontWeight: '600' },
})
