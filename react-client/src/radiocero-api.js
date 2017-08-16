const superagent = require('superagent');



function login() {
  return new Promise((resolve, reject) => {
    superagent.post('http://localhost:1043/login')
      .type('form')
      .send({ userName: 'admin', password: 'Rmc12242008' })
      .end((err, res) => {
        if (err) reject(err)
        else resolve(res.body)
      });
  })
}

export { login }