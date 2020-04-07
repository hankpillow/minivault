const btnEncrypt = this.document.querySelector("a[href=encrypt]")
const btnDecrypt = this.document.querySelector("a[href=decrypt]")
const tabEncrypt = this.document.querySelector("form[name=encrypt]")
const tabDecrypt = this.document.querySelector("form[name=decrypt]")

const klass = "-on"
function toggleTab(event) {
  event.preventDefault()
  btnEncrypt.classList.toggle(klass)
  btnDecrypt.classList.toggle(klass)
  tabEncrypt.classList.toggle(klass)
  tabDecrypt.classList.toggle(klass)
}

tabEncrypt.addEventListener("submit", async event => {
  event.preventDefault()
  const form = event.target
  const secret = form.querySelector("[name=secret]").value.trim()
  const password = form.querySelector("[name=password]").value.trim()
  const encripted = await encrypt(secret, password, mode, length, ivLength)
  const hash = fromUint8ArrayToHexa(encripted.iv) + ";;" +  fromArrayBufferToHexa(encripted.cipherText)
  form.querySelector("[name=hash]").textContent = hash.trim()
  form.reset()
})

tabDecrypt.addEventListener("submit", async event => {
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
    const decrypted = await decrypt(encripted, password, mode, length);
    form.querySelector("[name=secret]").textContent = decrypted
  } catch (e) {
    form.querySelector("[name=secret]").textContent = ""
    alert("invalid password")
    console.warn(e)
  }
  form.reset()
})

btnEncrypt.addEventListener("click", toggleTab)
btnDecrypt.addEventListener("click", toggleTab)
