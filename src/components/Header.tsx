import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type HeaderProps = {
  title?: string
  subtitle?: string
}

export default function Header({
  title = 'eGov SA',
  subtitle = 'Government Services',
}: HeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <StatusBar style="dark" />
      <View style={styles.headerBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/South-African-flag.jpg')}
              style={{ width: 36, height: 36, borderRadius: 32 }}
            />
          </View>
          <View>
            <Text style={styles.appName}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>


      </View>
    </SafeAreaView>
  )
}

const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
}

const styles = StyleSheet.create({
  safeTop: { backgroundColor: '#F5F6F8' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10, backgroundColor: '#1A2B4A', ...shadow },
  logoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2F80ED22', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  appName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff' },

})
