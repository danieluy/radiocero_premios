"use strict"

import moment from 'moment'

function checkEnabled(prize) {
  if (!prize)
    throw new Error('Missing argument, expected prize: Object')
  if (!!prize.due_date && prize.due_date < moment().valueOf())
    return false
  if (prize.stock !== null && prize.stock === 0)
    return false
  return true
}

function formatCI(unformatted) {
  if (!unformatted)
    throw new Error('Missing argument, expected unformatted: String')
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
  if (gender === 'F') return 'Femenino'
  if (gender === 'M') return 'Masculino'
  return 'Otro'
}

function validateCi(ci) {
  if (!ci)
    throw new Error('Missing argument, expected ci: String')
  if (ci.match(/^\d+$/) && ci.length >= 7 && ci.length <= 8) {
    let fixed_ci = ci
    if (ci.length === 7)
      fixed_ci = '0' + ci
    let coeffs = [2, 9, 8, 7, 6, 3, 4]
    let sum = 0
    for (let i = 0; i < coeffs.length; i++) {
      let digit = parseInt(fixed_ci.slice(i, i + 1))
      let coeff = coeffs[i]
      let multiply = ((digit * coeff).toString())
      let toAdd = multiply.slice(multiply.length - 1)
      sum += parseInt(toAdd)
    }
    let verifDig = 10 - (sum % 10)
    if (verifDig === 10)
      verifDig = 0
    if (verifDig.toString() == fixed_ci.slice(fixed_ci.length - 1))
      return true
  }
  return false
}

export { checkEnabled, formatCI, getFullGender, validateCi }