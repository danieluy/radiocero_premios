const superagent = require('superagent');



function login(userName, password) {
  if (!userName || !password)
    throw new Error('Username and Password must be provided')
  return new Promise((resolve, reject) => {
    superagent.post('/v2/login')
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
    superagent.post('/v2/logout')
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
    superagent.get('/api/users')
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
    superagent.patch('/api/users')
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

function updateUserPassword(data) {
  return new Promise((resolve, reject) => {
    superagent.patch('/api/users/password')
      .type('form')
      .send(data)
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
    superagent.delete('/api/users/' + user.id)
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

function addUser(user) {
  return new Promise((resolve, reject) => {
    superagent.post('/api/users/')
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

function getPrizes() {
  return new Promise((resolve, reject) => {
    superagent.get('/api/prizes/')
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

function addPrize(){
  return Promise.resolve()
  // type
  // sponsor
  // description
  // stock
  // periodic
  // due_date
  // note
  // total_handed
}

export {
  login,
  logout,
  getUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  addUser,
  getPrizes,
  addPrize
}