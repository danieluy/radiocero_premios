"use strict"

import moment from 'moment'

function checkEnabled(prize) {
  if (!!prize.due_date && prize.due_date < moment().valueOf())
    return false
  if (prize.stock !== null && prize.stock === 0)
    return false
  return true
}

function formatCI(unformatted) {
  let ci = unformatted.split('');
  if (ci.length === 6)
    return `${ci[0]}${ci[1]}.${ci[2]}${ci[3]}${ci[4]}-${ci[5]}`;
  if (ci.length === 7)
    return `${ci[0]}${ci[1]}${ci[2]}.${ci[3]}${ci[4]}${ci[5]}-${ci[6]}`;
  if (ci.length === 8)
    return `${ci[0]}.${ci[1]}${ci[2]}${ci[3]}.${ci[4]}${ci[5]}${ci[6]}-${ci[7]}`;
  if (ci.length === 9)
    return `${ci[0]}${ci[1]}.${ci[2]}${ci[3]}${ci[4]}.${ci[5]}${ci[6]}${ci[7]}-${ci[8]}`;
  return unformatted;
}

export { checkEnabled, formatCI }