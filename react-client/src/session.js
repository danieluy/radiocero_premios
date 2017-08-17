import { login } from './radiocero-api'
import events from './events'

const session = {
  init: function () {
    const localUser = getLocalUser()
    if (localUser.err)
      events.emit('exception', { message: localUser.err.message, err: localUser.err })
    else if (localUser.user)
      this.login(localUser.userName, localUser.password)
    else
      events.emit('login', null)
  },
  login: function (userName, password) {
    login(userName, password)
      .then(user => { events.emit('login', user) })
      .catch(err => { events.emit('exception', { message: localUser.err.message, err: localUser.err }) })
  }
}

function getLocalUser() {
  try {
    const user = window.localStorage.getItem('user')
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