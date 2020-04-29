const doc = this.document

Array
  .from(doc.querySelectorAll("nav a"))
  .forEach(a => a.onclick = toggleTab)

Array
  .from(doc.querySelectorAll("form"))
  .forEach(form => form.onsubmit = form.name === "encrypt" ? createHash : decodeHash)

function toggleTab(event) {
  event.preventDefault()
  const klass = "-on"
  Array.from(
    event.target.parentNode.querySelectorAll("a")
  ).forEach(a => {
    a.classList.toggle(klass)
    const targetTab = a.getAttribute("href")
    const qs = targetTab === "encrypt" ? "[name=hash]" : "[name=secret]"
    const form = doc.querySelector(`form[name=${targetTab}]`)
    const copy = form.querySelector("[name=copy]")
    form.classList.toggle(klass)
    form.reset()
    copy.textContent = ""
    form.querySelector(qs).textContent = ""
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
  const form = event.target
  const secret = form.querySelector("[name=secret]").value.trim()
  const password = form.querySelector("[name=password]").value.trim()
  const copy = form.querySelector("[name=copy]")
  const hash = await encrypt(secret, password)
  const result = form.querySelector("[name=hash]")
  form.reset()
  result.textContent = hash
  if (window === window.top) { copyToClipboard(hash, copy) }
  result.focus()
}

async function decodeHash(event) {
  event.preventDefault()
  const form = event.target
  const hash = form.querySelector("[name=hash]").value.trim();
  const password = form.querySelector("[name=password]").value.trim()
  const copy = form.querySelector("[name=copy]")
  let secret
  try{
    secret = await decrypt(hash, password);
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
