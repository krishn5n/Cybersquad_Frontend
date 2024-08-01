let but = document.querySelector('.quiz-button')
let emailobj = document.getElementById('email')
let passobj = document.getElementById('Password')
but.addEventListener('click', async (event) => {
    event.preventDefault()
    let name = document.getElementById('name').value
    let phone = document.getElementById('phone').value
    let age = document.getElementById('age').value
    let email = document.getElementById('email').value
    let pass = document.getElementById('Password').value
    let usage = document.getElementById('usage').value
    let data = { "name": name, "phone": phone, "age": age, "email": email, "pass": pass, "usage": usage }
    let passwdcheck = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+[{}|;:'",.<>?]).*$/
    let emailtest = /^[A-Za-z0-9]+@(gmail|yahoo)\.(com|in|us)$/
    if (passwdcheck.test(pass) && emailtest.test(email)) {
        localStorage.setItem('email', email)
        let url = 'http://localhost:5000/signup'
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (usage === 'personal') {
                window.location.href = 'quiz1.html';
                //form.action = 'quiz1.html';
            } else if (usage === 'entrepreneur') {
                window.location.href = 'quiz2.html';
                //form.action = 'quiz2.html';
            }

        }
        catch (err) {
            console.log(err)
        }
    }
    else {
        let warn = document.querySelector('.warnpass')
        warn.style.display = 'none'
    }
})


emailobj.addEventListener('change', () => {
    let email = emailobj.value
    let emailtest = /^[A-Za-z0-9]+@(gmail|yahoo)\.(com|in|us)$/
    if (!emailtest.test(email)) {
        let warn = document.querySelector('.warnemail')
        warn.style.display = 'inline-block'
        let warns = document.querySelector('.warnpass')
        warns.style.display = 'inline-block'
    }
})

emailobj.addEventListener('input', () => {
    let warn = document.querySelector('.warnemail')
    warn.style.display = 'none'
})

passobj.addEventListener('change', () => {
    let pass = passobj.value
    let passwdcheck = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+[{}|;:'",.<>?]).*$/
    if (!passwdcheck.test(pass)) {
        let warn = document.querySelector('.warnpass')
        warn.style.display = 'inline-block'
    }
})

passobj.addEventListener('input', () => {
    let warn = document.querySelector('.warnpass')
    warn.style.display = 'none'
})