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
    accent: '#00BCD4'
  }
}