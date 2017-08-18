function localStorageGet(key) {
  if (!key || key === '', typeof key !== 'string')
    throw new Error('key: String must be provided')
  try {
    const value = JSON.parse(window.localStorage.getItem(key))
    return { err: null, data: value }
  }
  catch (err) {
    return { err }
  }
}

function localStorageSet(key, value) {
  if (!key || key === '', typeof key !== 'string')
    throw new Error('key: String must be provided')
  try {
    if (value)
      window.localStorage.setItem(key, JSON.stringify(value))
    else
      window.localStorage.setItem(key, null)
    return { err: null }
  }
  catch (err) {
    return { err }
  }
}

const Keys = {
  USER: 'user'
}

export default {
  get: localStorageGet,
  set: localStorageSet,
  keys: Keys
}