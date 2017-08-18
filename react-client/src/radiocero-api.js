const superagent = require('superagent');



function login(userName, password) {
  if (!userName || !password)
    throw new Error('Username and Password must be provided')
  return new Promise((resolve, reject) => {
    superagent.post('http://localhost:1043/login')
      .type('form')
      .send({ userName, password })
      .end((err, res) => {
        if (err)
          reject(err)
        else if (res.body.error)
          resolve(null)
        else
          resolve(res.body.user)
      });
  })
}
function logout() {
  return new Promise((resolve, reject) => {
    superagent.post('http://localhost:1043/logout')
      .end((err, res) => {
        if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

export { login, logout }