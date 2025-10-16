import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Check if running in Expo Go (SDK 53+ doesn't support push notifications in Expo Go)
const isExpoGo = Constants.appOwnership === 'expo'

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

/**
 * Request push notification permissions and get the Expo push token
 * Note: Push notifications don't work in Expo Go (SDK 53+). Use a development build instead.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null

  // Warn if in Expo Go
  if (isExpoGo) {
    console.warn(
      '⚠️ Push notifications are not supported in Expo Go (SDK 53+). ' +
      'Please use a development build to test push notifications. ' +
      'See PUSH_NOTIFICATIONS_SETUP.md for instructions.'
    )
    // Return null but don't throw error - allows app to continue working
    return null
  }

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    } catch (error) {
      console.error('Error setting notification channel:', error)
    }
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!')
      return null
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id',
      })).data
      console.log('Push token:', token)
    } catch (error) {
      console.error('Error getting push token:', error)
      return null
    }
  } else {
    console.log('Must use physical device for Push Notifications')
  }

  return token
}

/**
 * Check if push notifications are enabled in device settings
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync()
  return status === 'granted'
}

/**
 * Send a local notification (for testing)
 */
export async function sendLocalNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Send immediately
  })
}

/**
 * Add notification received listener
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback)
}

/**
 * Add notification response received listener (when user taps on notification)
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback)
}

/**
 * Get badge count
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync()
}

/**
 * Set badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count)
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync()
}
