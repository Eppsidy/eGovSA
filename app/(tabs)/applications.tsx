import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function ApplicationsScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.text}>Applications will appear here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { color: '#111', fontWeight: '600' },
})
