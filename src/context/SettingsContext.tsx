import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'blue' | 'purple' | 'green' | 'orange' | 'emerald';
  backgroundStyle: 'minimal' | 'solid' | 'gradient' | 'glass';
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Poppins' | 'Roboto';
  fontSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
  alerts: {
    applications: boolean;
    deadlines: boolean;
    documents: boolean;
    schemes: boolean;
    grievances: boolean;
  };
}

const defaultSettings: AppSettings = {
  theme: 'light',
  accentColor: 'blue',
  backgroundStyle: 'minimal',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 'medium',
  density: 'comfortable',
  sidebarCollapsed: false,
  alerts: {
    applications: true,
    deadlines: true,
    documents: true,
    schemes: true,
    grievances: true,
  },
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  toggleSidebar: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('compliance_app_settings');
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('compliance_app_settings', JSON.stringify(settings));

    // Apply dark class to documentElement
    const root = document.documentElement;
    if (
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font family
    root.style.fontFamily = `'${settings.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`;

    // Apply font size
    if (settings.fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (settings.fontSize === 'large') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '15px';
    }
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const toggleSidebar = () => {
    setSettings((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        toggleSidebar,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
