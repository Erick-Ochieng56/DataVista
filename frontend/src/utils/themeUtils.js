export const getThemeValues = (theme) => {
    const themeValues = {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        mapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      },
      dark: {
        backgroundColor: '#1f2937',
        textColor: '#f3f4f6',
        primaryColor: '#60a5fa',
        secondaryColor: '#34d399',
        mapUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      },
      'high-contrast': {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        primaryColor: '#ffff00',
        secondaryColor: '#00ffff',
        mapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      }
    };
    
    return themeValues[theme] || themeValues.light;
  };
  