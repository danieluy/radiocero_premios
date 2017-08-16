import axios from 'axios'

function test() {
  return axios.post('http://192.168.5.6:1043/login', {
    userName: 'admin',
    password: 'Rmc12242008'
  })
}

export { test }