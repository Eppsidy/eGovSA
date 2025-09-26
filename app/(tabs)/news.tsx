import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function NewsScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.text}>Latest government news and updates.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { color: '#111', fontWeight: '600' },
})
