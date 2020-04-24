const btnEncrypt = this.document.querySelector("a[href=encrypt]")
const btnCopy = this.document.querySelector("[name=copy]")
const btnDecrypt = this.document.querySelector("a[href=decrypt]")
const tabEncrypt = this.document.querySelector("form[name=encrypt]")
const tabDecrypt = this.document.querySelector("form[name=decrypt]")

function bindFields(form, fields, result) {
  Array
    .from(form.querySelectorAll(fields))
    .map(bindReset(form.querySelector(result)))
}

function bindReset(ele){
  return node => {
    node.onkeydown = () => ele.textContent = ""
  }
}

function toggleTab(event) {
  const klass = "-on"
  event.preventDefault()
  btnEncrypt.classList.toggle(klass)
  btnDecrypt.classList.toggle(klass)
  tabEncrypt.classList.toggle(klass)
  tabDecrypt.classList.toggle(klass)
  tabEncrypt.querySelector("[name=hash]").textContent = ""
  tabDecrypt.querySelector("[name=secret]").textContent =  ""
  btnCopy.textContent = ""
}

function copyToClipboard(hash) {
    if (!navigator.clipboard
      && typeof navigator.clipboard.writeText !== "function") {
      return
    }
    hash = hash || ""
    btnCopy.textContent = "copy"
    btnCopy.onclick = event => {
      event.preventDefault()
      navigator.clipboard.writeText(hash)
        .then(_ => {
          btnCopy.textContent = "copied"
        }, err =>{
          btnCopy.textContent = "failed"
          console.error(err)
        })
        .catch(err => {
          btnCopy.textContent = "failed"
          console.error(err)
        })
    }
}

async function createHash(event) {
  event.preventDefault()
  const form = event.target
  const secret = form.querySelector("[name=secret]").value.trim()
  const password = form.querySelector("[name=password]").value.trim()
  const encripted = await encrypt(secret, password)
  const hash = (fromUint8ArrayToHexa(encripted.iv) + ";;" +  fromArrayBufferToHexa(encripted.cipherText)).trim()
  const result = form.querySelector("[name=hash]")
  form.reset()
  btnCopy.textContent = ""
  result.textContent = hash
  if (window === window.top) copyToClipboard(hash)
  result.focus()
}

async function decodeHash(event) {
  event.preventDefault()
  const form = event.target
  const hash = form.querySelector("[name=hash]").value.trim();
  const parts = hash.split(";;")
  const password = form.querySelector("[name=password]").value.trim()
  try{
    const encripted = {
      iv: fromHexaToUint8Array(parts[0]),
      cipherText: fromHexaToUint8Array(parts[1]),
    }
    const decrypted = await decrypt(encripted, password);
    form.querySelector("[name=secret]").textContent = decrypted
  } catch (e) {
    form.querySelector("[name=secret]").textContent = ""
    alert("invalid password")
    console.warn(e)
  }
  form.reset()
}


// ----
tabEncrypt.addEventListener("submit", createHash)
tabDecrypt.addEventListener("submit", decodeHash)

bindFields(tabEncrypt, "[name=secret],[name=password]", "[name=hash]")
bindFields(tabDecrypt, "[name=hash],[name=password]", "[name=secret]")

btnEncrypt.addEventListener("click", toggleTab)
btnDecrypt.addEventListener("click", toggleTab)
