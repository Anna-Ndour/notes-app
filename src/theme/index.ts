export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  accent: string;
  destructive: string;
  inputBackground: string;
  drawerBackground: string;
  drawerActiveBackground: string;
  tabBarBackground: string;
  tabBarBorder: string;
}

export const lightTheme: ThemeColors = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  secondaryText: '#8E8E93',
  border: '#E5E5EA',
  accent: '#D97706',
  destructive: '#FF3B30',
  inputBackground: '#E5E5EA',
  drawerBackground: '#F2F2F7',
  drawerActiveBackground: '#FDE68A',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E5EA',
};

export const darkTheme: ThemeColors = {
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  secondaryText: '#8E8E93',
  border: '#2C2C2E',
  accent: '#F59E0B',
  destructive: '#FF453A',
  inputBackground: '#2C2C2E',
  drawerBackground: '#1C1C1E',
  drawerActiveBackground: '#78350F',
  tabBarBackground: '#121212',
  tabBarBorder: '#2C2C2E',
};
