import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function SubmitIncomeTaxReturns() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Submit Income Tax Returns</Text>

        <View style={styles.section}>
          <MaterialIcons name="description" size={18} color="#334155" style={styles.icon} />
          <Text style={styles.subtitle}>The Tax Compliance Status (TCS) application form</Text>
        </View>
        <Text style={styles.body}>
          You can request your Tax Compliance Status on:
        </Text>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={18} color="#0f172a" style={styles.icon} />
          <Text style={styles.body}>The SARS Online Query Service</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={18} color="#0f172a" style={styles.icon} />
          <Text style={styles.body}>Online via eFiling</Text>
        </View>

        <View style={styles.section}>
          <MaterialIcons name="laptop-mac" size={18} color="#334155" style={styles.icon} />
          <Text style={styles.subtitle}>How to request your TCS via eFiling</Text>
        </View>
        <Text style={styles.body}>
          Once you have viewed your “My Compliance Profile”, you may request a TCS by:
        </Text>
        <View style={styles.listItem}>
          <Entypo name="dot-single" size={22} color="#475569" style={styles.icon} />
          <Text style={styles.body}>Selecting the TCS Request option and the type of TCS you want:</Text>
        </View>
        <View style={styles.subList}>
          <Text style={styles.body}>• Good standing</Text>
          <Text style={styles.body}>• Approval International Transfer</Text>
        </View>
        <View style={styles.listItem}>
          <Entypo name="dot-single" size={22} color="#475569" style={styles.icon} />
          <Text style={styles.body}>Completing the request and submitting it to SARS.</Text>
        </View>
        <View style={styles.tipBox}>
          <Ionicons name="information-circle" size={18} color="#0284c7" style={styles.icon} />
          <Text style={styles.tip}>
            FIA and Emigration applications are now renamed to AIT (Approval International Transfer).
          </Text>
        </View>

        <Text style={styles.body}>
          Once approved by SARS, you will be issued a TCS and a unique PIN. You can request the PIN via SMS or view it on your “TCS Request” dashboard in eFiling.
        </Text>

        <View style={styles.section}>
          <MaterialIcons name="vpn-key" size={18} color="#334155" style={styles.icon} />
          <Text style={styles.subtitle}>The Tax Compliance Status PIN</Text>
        </View>
        <Text style={styles.body}>
          The PIN authorises third parties to check your compliance status online. It shows your current status (as at the time of checking) but hides all other taxpayer information.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f8' },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    padding: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 2 
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#334155' },
  body: { marginTop: 6, fontSize: 14, color: '#475569', lineHeight: 20 },
  section: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  listItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  subList: { marginLeft: 28, marginTop: 4 },
  icon: { marginRight: 6 },
  tipBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, 
    backgroundColor: '#e0f2fe', 
    padding: 10, 
    borderRadius: 10 
  },
  tip: { flex: 1, fontSize: 13, color: '#0369a1', lineHeight: 18 },
})
