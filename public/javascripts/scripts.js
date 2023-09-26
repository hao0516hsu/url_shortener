const copyIcons = document.querySelectorAll('.fa-copy')
const copyButton = document.querySelector('#copy-button')
const urlShorten = document.querySelector("#url-shorten")

// 主頁面的複製
if (copyButton) {
  copyButton.addEventListener('click', () => {
    const urlValue = urlShorten.textContent

    navigator.clipboard.writeText(urlValue)
    alert(`已將短網址存到剪貼簿中。(${urlValue})`)
  })
}


// History頁面的複製
if (copyIcons.length) {
  copyIcons.forEach(copyIcon => {
    copyIcon.addEventListener('click', event => {
      const target = event.target
      const shortenURL = target.parentElement.previousElementSibling.innerText

      navigator.clipboard.writeText(shortenURL)
      alert(`已將短網址存到剪貼簿中。(${shortenURL})`)
    })
  })
}

