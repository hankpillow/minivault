const doc = this.document

Array
  .from(doc.querySelectorAll("nav a"))
  .forEach(a => a.onclick = toggleTab)

Array
  .from(doc.querySelectorAll("form"))
  .forEach(form => {
    switch(form.name){
      case "encrypt":
        form.onsubmit = createHash
        break
      case "decrypt":
        form.onsubmit = decodeHash
        break
      case "create":
        form.onsubmit = createPassword
        break
    }
  })

function toggleTab(event) {
  event.preventDefault()
  const klass = "-on"
  const target = event.target.getAttribute("href")
  Array.from(
    event.target.parentNode.querySelectorAll("a")
  ).forEach(a => {

    const targetTab = a.getAttribute("href")
    const form = doc.querySelector(`form[name=${targetTab}]`)
    const copy = form.querySelector("[name=copy]")

    if (copy) copy.textContent = ""

    if (target === targetTab) {
      a.classList.add(klass)
      form.classList.add(klass)
    } else  {
      a.classList.remove(klass)
      form.classList.remove(klass)
    }
    switch(targetTab){
      case  "encrypt":
        form.reset()
        form.querySelector("[name=hash]").textContent = ""
        break
      case "decrypt":
        form.reset()
        form.querySelector("[name=secret]").textContent = ""
        break
      case "create":
        form.querySelector("[name=password]").textContent = ""
        const range = doc.querySelector("form[name=create] input[type=range]")
        const rangeValue = doc.querySelector("form[name=create] span[name=rangeValue]")
        range.oninput = e => rangeValue.textContent = e.target.value + " length"
        break
    }
  })
}

function copyToClipboard(hash, btn) {
    if (!btn || (!navigator.clipboard
      && typeof navigator.clipboard.writeText !== "function")){ return }

    hash = hash || ""
    if (!hash.length) return

    btn.textContent = "copy"
    btn.onclick = event => {
      event.preventDefault()
      navigator.clipboard.writeText(hash)
        .then(_ => {
          btn.textContent = "copied"
        }, err =>{
          btn.textContent = "couldnt copy!"
          console.error(err)
        })
        .catch(err => {
          btn.textContent = "couldnt copy!"
          console.error(err)
        })
    }
}

async function createHash(event) {
  event.preventDefault()
  if (!crypto) return
  const form = event.target
  const secret = form.querySelector("[name=secret]").value.trim()
  const password = form.querySelector("[name=password]").value.trim()
  const copy = form.querySelector("[name=copy]")
  const hash = await encrypt(secret, password, crypto)
  const result = form.querySelector("[name=hash]")
  form.reset()
  result.textContent = hash
  if (window === window.top) { copyToClipboard(hash, copy) }
  result.focus()
}

async function decodeHash(event) {
  event.preventDefault()
  if (!crypto) return
  const form = event.target
  const hash = form.querySelector("[name=hash]").value.trim();
  const password = form.querySelector("[name=password]").value.trim()
  const copy = form.querySelector("[name=copy]")
  let secret
  try{
    secret = await decrypt(hash, password, crypto);
    form.querySelector("[name=secret]").textContent = secret
    if (window === window.top) {
      copyToClipboard(secret, copy)
    }
  } catch (e) {
    form.querySelector("[name=secret]").textContent = ""
    alert("invalid password")
    console.warn(e)
  }
  form.reset()
}

function createPassword(event) {
  event.preventDefault()

  const withNum = event.target.querySelector("[name=withNum]").checked
  const withSign = event.target.querySelector("[name=withSign]").checked
  const withSize = parseInt(event.target.querySelector("[type=range]").value)
  const psw = getHash(withSize, withNum, withSign) 
  const copy = event.target.querySelector("[name=copy]")

  event.target.querySelector("[name=password]").textContent = psw
  if (window === window.top) { copyToClipboard(psw, copy) }
}

