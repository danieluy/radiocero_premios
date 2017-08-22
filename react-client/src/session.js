import { login as serverLogin, logout as serverLogout } from './radiocero-api'
import events from './events'
import db from './db'

function login(userName, password) {
  serverLogin(userName, password)
    .then(user => {
      if (user)
        setLocalUser(user)
      events.emit('login', user)
    })
    .catch(err => {
      events.emit('exception', err)
    })
}
function logout() {
  serverLogout()
    .then(() => {
      setLocalUser(null)
      window.location.reload()
    })
    .catch(err => {
      events.emit('exception', err)
    })
}
function getLocalUser() {
  return (db.get(db.keys.USER)).data
}
function setLocalUser(user) {
  return db.set(db.keys.USER, user)
}
function deleteLocalUser() {
  return db.set(db.keys.USER, null)
}

export default {
  login,
  logout,
  getLocalUser,
  setLocalUser
}

window.getLocalUser = getLocalUser
window.setLocalUser = setLocalUser

