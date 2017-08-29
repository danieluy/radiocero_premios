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
    primary: '#F58500',
    accent: '#0070F5'
  }
}