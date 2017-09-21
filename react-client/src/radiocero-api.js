const superagent = require('superagent');

const APIBaseURL = '/api/'

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
    superagent.get(APIBaseURL + 'users')
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
    superagent.patch(APIBaseURL + 'users')
      .type('form')
      .send(user)
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
    superagent.patch(APIBaseURL + 'users/password')
      .type('form')
      .send(data)
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
    superagent.delete(APIBaseURL + 'users/' + user.id)
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
    superagent.post(APIBaseURL + 'users/')
      .type('form')
      .send(user)
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
    superagent.get(APIBaseURL + 'prizes/')
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function getPrizeById(id) {
  return new Promise((resolve, reject) => {
    superagent.get(APIBaseURL + 'prizes/' + id)
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function getPrizesGroup(ids) {
  // ids:[String]
  return Promise.all(ids.map(id => getPrizeById(id)))
}

function addPrize(prize) {
  return new Promise((resolve, reject) => {
    superagent.post(APIBaseURL + 'prizes/')
      .type('form')
      .send(prize)
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
    superagent.patch(APIBaseURL + 'prizes')
      .type('form')
      .send(prize)
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function deletePrize(prize) {
  return new Promise((resolve, reject) => {
    superagent.delete(APIBaseURL + 'prizes/' + prize.id)
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function getWinners() {
  return new Promise((resolve, reject) => {
    superagent.get(APIBaseURL + 'winners/')
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function handoverPrize(winner_ci, prize_id) {
  if (!winner_ci || !prize_id)
    throw new Error('Winner CI and Prize ID must be provided')
  return new Promise((resolve, reject) => {
    superagent.post(APIBaseURL + 'winners/handprize/')
      .type('form')
      .send({ winner_ci, prize_id })
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function cancelHandoverPrize(winner_ci, prize_id) {
  if (!winner_ci || !prize_id)
    throw new Error('Winner CI and Prize ID must be provided')
  return new Promise((resolve, reject) => {
    superagent.post(APIBaseURL + 'winners/cancelHandprize/')
      .type('form')
      .send({ winner_ci, prize_id })
      .end((err, res) => {
        if (err && res && res.unauthorized)
          reject('Unauthorized')
        else if (err)
          reject(err)
        else
          resolve(res.body)
      });
  })
}

function grantPrize(prizeId) {
  // if (!winner_ci || !prize_id)
  //   throw new Error('Winner CI and Prize ID must be provided')
  // return new Promise((resolve, reject) => {
  //   superagent.post(APIBaseURL + 'winners/cancelHandprize/')
  //     .type('form')
  //     .send({ winner_ci, prize_id })
  //     .end((err, res) => {
  //       if (err && res && res.unauthorized)
  //         reject('Unauthorized')
  //       else if (err)
  //         reject(err)
  //       else
  //         resolve(res.body)
  //     });
  // })
  return Promise.resolve(null)
}

function checkWinner(ci) {
  if (!ci)
    throw new Error('Winner CI must be provided')
  return new Promise((resolve, reject) => {
    superagent.post(APIBaseURL + 'winners/checkwinner/')
      .type('form')
      .send({ ci })
      .end((err, res) => {
        if (err && res && res.unauthorized)
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
  getPrizesGroup,
  addPrize,
  updatePrize,
  deletePrize,
  getWinners,
  handoverPrize,
  cancelHandoverPrize,
  grantPrize,
  checkWinner
}