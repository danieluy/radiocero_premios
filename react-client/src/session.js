import { login } from './radiocero-api'
import events from './events'

const session = {
  init: function () {
    console.log('localUser',  (getLocalUser()).user)
  },
  login: function (userName, password) {
    login(userName, password)
      .then(user => {
        if (!user)
          events.emit('alert', { message: 'Error de usuario o contraseña' })
        else {
          setLocalUser(user)
          events.emit('login', user)
        }
      })
      .catch(err => { events.emit('exception', { message: localUser.err.message, err: localUser.err }) })
  }
}

function getLocalUser() {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return { err: null, user: user }
  }
  catch (err) {
    return { err }
  }
}

function setLocalUser(user) {
  try {
    window.localStorage.setItem('user', user)
    return { err: null }
  }
  catch (err) {
    return { err }
  }
}

export default session