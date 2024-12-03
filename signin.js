let submit = document.querySelector('.form-button')
let email = document.getElementById('email')
let pass = document.getElementById('password')
let wrongval = document.querySelector('.wrong-values')

email.addEventListener('input', () => {
    wrongval.style.display = 'none'
})
pass.addEventListener('input', () => {
    wrongval.style.display = 'none'
})

submit.addEventListener('click', async (event) => {
    event.preventDefault();
    emailval = email.value
    passval = pass.value
    data = { 'email': emailval, 'pass': passval }
    let url = 'https://cybersquad-backend.onrender.com/signin'
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Network issues')
        }
        let values = await response.json()
        if (values['signin']) {
            localStorage.setItem('email', emailval)
            window.location.href = 'home.html';
        }
        else {
            email.value = ''
            pass.value = ''
            wrongval.style.display = 'block'
        }
    }
    catch (err) {
        console.log(err)
    }

})