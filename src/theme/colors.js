// Centralized theme colors that adapt to light/dark mode
export const getThemeColors = (mode) => {
  if (mode === 'light') {
    return {
      // Backgrounds
      background: '#f8f9fa',
      card: 'rgba(255,255,255,0.95)',
      cardSecondary: 'rgba(248,250,252,0.9)',
      
      // Text
      text: '#1e293b',
      textSecondary: '#475569',
      textMuted: '#64748b',
      
      // Borders
      border: 'rgba(148,163,184,0.3)',
      borderStrong: 'rgba(148,163,184,0.5)',
      
      // Accents
      accent: '#7c3aed',
      accentLight: '#a855f7',
      accentSecondary: '#6366f1',
      
      // Icons
      icon: '#475569',
      iconAccent: '#7c3aed',
      
      // Status
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Blur tint
      blurTint: 'light',
    };
  }
  
  // Dark theme (default)
  return {
    // Backgrounds
    background: '#050616',
    card: 'rgba(15,23,42,0.95)',
    cardSecondary: 'rgba(30,64,175,0.7)',
    
    // Text
    text: '#f9fafb',
    textSecondary: '#e5e7eb',
    textMuted: '#cbd5f5',
    
    // Borders
    border: 'rgba(148,163,184,0.4)',
    borderStrong: 'rgba(148,163,184,0.6)',
    
    // Accents
    accent: '#7c3aed',
    accentLight: '#a855f7',
    accentSecondary: '#6366f1',
    
    // Icons
    icon: '#e5e7eb',
    iconAccent: '#c4b5fd',
    
    // Status
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#fb7185',
    
    // Blur tint
    blurTint: 'dark',
  };
};

