const superagent = require('superagent');

const apibBaseURL = '/api/'

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
function logged() {
  return new Promise((resolve, reject) => {
    superagent.post('/v2/logged')
      .end((err, res) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(res.body.user)
        }
      });
  })
}

function getUsers() {
  return new Promise((resolve, reject) => {
    superagent.get(apibBaseURL + 'users')
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
    superagent.patch(apibBaseURL + 'users')
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
    superagent.patch(apibBaseURL + 'users/password')
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
    superagent.delete(apibBaseURL + 'users/' + user.id)
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
    superagent.post(apibBaseURL + 'users/')
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
    superagent.get(apibBaseURL + 'prizes/')
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

function addPrize(prize) {
  return new Promise((resolve, reject) => {
    superagent.post(apibBaseURL + 'prizes/')
      .type('form')
      .send(prize)
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



function updatePrize(prize) {
  return new Promise((resolve, reject) => {
    superagent.patch(apibBaseURL + 'prizes')
      .type('form')
      .send(prize)
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

export {
  login,
  logout,
  logged,
  getUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  addUser,
  getPrizes,
  addPrize,
  updatePrize
}