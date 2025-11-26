/**
 * Color constants for light and dark themes
 */

export const Colors = {
  light: {
    // Background colors
    background: '#F5F6F8',
    backgroundSecondary: '#f7f7f8',
    card: '#ffffff',
    cardHover: '#f9fafb',
    
    // Text colors
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#6b7280',
    textMuted: '#9CA3AF',
    
    // Primary brand colors
    primary: '#E67E22',
    primaryLight: '#FFF4E6',
    primaryDark: '#d66a1f',
    
    // Accent colors
    accent: '#1e48a1ff',
    accentHover: '#de6c0fff',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // UI element colors
    border: '#E5E7EB',
    borderLight: '#f0f0f0',
    divider: '#f0f0f0',
    
    // Notification colors
    notificationDot: '#de6c0fff',
    notificationBg: '#DCFCE7',
    
    // Shadow
    shadow: '#000',
    
    // Status badge
    badgeBg: '#FFF4E6',
    badgeText: '#E67E22',
    
    // Icon backgrounds
    iconBg: '#FFF4E6',
    contactIconBg: '#ed7e2f22',
    
    // Service status indicators
    statusOnline: '#10B981',
    statusOffline: '#EF4444',
  },
  dark: {
    // Background colors
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    card: '#1e293b',
    cardHover: '#334155',
    
    // Text colors
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textMuted: '#64748b',
    
    // Primary brand colors
    primary: '#E67E22',
    primaryLight: '#4a2d1a',
    primaryDark: '#f97316',
    
    // Accent colors
    accent: '#60a5fa',
    accentHover: '#de6c0fff',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // UI element colors
    border: '#334155',
    borderLight: '#334155',
    divider: '#334155',
    
    // Notification colors
    notificationDot: '#de6c0fff',
    notificationBg: '#064e3b',
    
    // Shadow
    shadow: '#000',
    
    // Status badge
    badgeBg: '#4a2d1a',
    badgeText: '#fb923c',
    
    // Icon backgrounds
    iconBg: '#4a2d1a',
    contactIconBg: '#4a2d1a',
    
    // Service status indicators
    statusOnline: '#10B981',
    statusOffline: '#EF4444',
  },
};

export type ColorScheme = 'light' | 'dark';
