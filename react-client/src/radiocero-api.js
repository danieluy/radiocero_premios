const superagent = require('superagent');



function login(userName, password) {
  if (!userName || !password)
    throw new Error('Username and Password must be provided')
  return new Promise((resolve, reject) => {
    superagent.post('http://localhost:1043/v2/login')
      .type('form')
      .send({ userName, password })
      .end((err, res) => {
        if (err)
          reject(err)
        else if (res.body.error)
          reject(res.body.error)
        else
          resolve(res.body.user)
      });
  })
}
function logout() {
  return new Promise((resolve, reject) => {
    superagent.post('http://localhost:1043/v2/logout')
      .end((err, res) => {
        if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function getUsers() {
  return new Promise((resolve, reject) => {
    superagent.get('http://localhost:1043/api/users')
      .end((err, res) => {
        if (err && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function updateUser(user) {
  return new Promise((resolve, reject) => {
    superagent.patch('http://localhost:1043/api/users')
      .type('form')
      .send(user)
      .end((err, res) => {
        if (err && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function deleteUser(user) {
  return new Promise((resolve, reject) => {
    superagent.delete('http://localhost:1043/api/users/' + user.id)
      .end((err, res) => {
        console.log(res)
        if (err && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

export {
  login,
  logout,
  getUsers,
  updateUser,
  deleteUser
}