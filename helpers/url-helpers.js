// Function: 產生短網址
const shorten_url = () => {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '012345679'
  const url_component = lowerCaseLetters.split('').concat(upperCaseLetters.split(''), numbers.split(''))

  let url_shorten = ''

  for (let i = 1; i <= 5; i++) {
    url_shorten += randomIndex(url_component)
  }
  return url_shorten
}
// Function: 產生亂數
const randomIndex = array => {
  const letter = array[Math.floor(Math.random() * array.length)]
  return letter
}

module.exports = { shorten_url }  
