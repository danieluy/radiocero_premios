"use strict"

import moment from 'moment'

function checkEnabled(prize) {
  if (!prize)
    throw new Error('Missing argument (prize: Object)')
  if (!!prize.due_date && prize.due_date < moment().valueOf())
    return false
  if (prize.stock !== null && prize.stock === 0)
    return false
  return true
}

function formatCI(unformatted) {
  if (!unformatted)
    throw new Error('Missing argument (unformatted: String)')
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

function getFullGender(gender) {
  if (!gender) return 'No ingresado'
  if(gender === 'F') return 'Femenino'
  if(gender === 'M') return 'Masculino'
  return 'Otro'
}

export { checkEnabled, formatCI, getFullGender }