export default {
  get dialog() {
    if (window.innerWidth < 481)
      return {
        width: '100%',
        maxWidth: 'none',
      }
    return null
  },
  color: {
    primary: '#FF9800',
    primaryLight: '#FFC947',
    primaryDark: '#C66900',
    accent: '#00BCD4',
    accentLight: '#62EFFF',
    accentdark: '#008BA3',
    grey100: '#FAFAFA',
    grey300: '#E0E0E0',
    grey500: '#9E9E9E',
    grey800: '#424242',
    htmlBackgroundColor: '#EEE'
  },
  size: {
    barHeight: '64px'
  }
}