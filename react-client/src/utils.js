const removeVowelAccent = function (str) {
  var noAccents = []
  for (var i = 0; i < str.length; i++) {
    let char = str.charAt(i)
    const charCode = str.charCodeAt(i)
    if (charCode === 225) char = 'a'
    else if (charCode === 233) char = 'e'
    else if (charCode === 237) char = 'i'
    else if (charCode === 243) char = 'o'
    else if (charCode === 250) char = 'u'
    noAccents.push(char)
  }
  return noAccents.join('')
}

export { removeVowelAccent }