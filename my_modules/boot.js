"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Dependencies  //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const Users = require('./users.js');
const User = Users.User;
const commander = require('commander');
const MISC = require('../config.json').misc;

function action(cmd, arg) {
  if (typeof cmd === 'undefined' || typeof arg === 'undefined') {
    console.error('Command not recognized, please use: "node app --help"');
    process.exit(1);
  }
  if (cmd === 'admin') {
    if (arg === 'create') {
      if (commander.password) {
        const user = new User({
          userName: 'admin',
          password: commander.password,
          role: 'admin'
        })
        user.save()
          .then((WriteResult) => {
            if (WriteResult.insertedCount > 0) {
              console.log('Administrator account correctly set');
              process.exit(0);
            }
            else {
              console.error('Something went wrong, administrator account was not set');
              process.exit(1);
            }
          })
          .catch(err => console.log(err))
      }
      else {
        console.error('A password must be provided, please use: "node app --help"');
        process.exit(1);
      }
    }
    else if (arg === 'change') {
      console.error('Sorry, this functionality is not implemented yet');
      process.exit(1);
    }
    else {
      console.error('The command "admin" requires an argument, please use: "node app --help"');
      process.exit(1);
    }
  }
  // console.log('command:', cmd);
  // console.log('environment:', arg || "no environment given");
  // console.log('option:', commander.password || "no password given");
  // console.log('option:', commander.oldpassword || "no password given");
  // console.log('option:', commander.newpassword || "no password given");
}

commander
  .version(`${MISC.appName} v${MISC.version}`)
  .arguments('<cmd> [env]')
  .option('-p, --password [password]', 'Sets up the specified password (to be used after [create] argument)', undefined)
  .option('-o, --oldpassword [password]', 'Inputs the old password (to be used after [change] argument)', undefined)
  .option('-n, --newpassword [password]', 'Inputs the new password (to be used after [change] argument)', undefined)
  .action(action);

commander.on('--help', function () {
  console.log('  Commands:');
  console.log('');
  console.log('    admin                         used to create the administrator account or to change its password');
  console.log('    others                        will be added in the future ');
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ node app.js -p passExample admin create');
  console.log('    $ node app.js -o passExample -n newPassExample admin change');
  console.log('');
});

commander.parse(process.argv);

const checkAdmin = (cb) => {
  Users.findByName('admin')
    .then((user) => {
      if (!user)
        console.log('Administrator account must be created, please use: node app --help');
      else
        cb();
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = {
  checkAdmin: checkAdmin
}
