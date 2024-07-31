let balanceinfodiv = document.getElementById('balance-check')
let amountleftp = document.getElementById('Amount-left-balance')
let amountspentp = document.getElementById('Amount-spent-balance')
let amountsavep = document.getElementById('Amount-save-balance')
let closebutton = document.querySelector('.close-button')
let addspend = document.getElementById('addspend')
let addspending = document.querySelector('.addspending')
let listloan = document.querySelector('.list-loans')
let addloans = document.getElementById('addloans')
let popup_loan = document.querySelector('.addloanlist')
let closebuttonloan = document.querySelector('.close-button-loan')

let email = 'krishnannarayanan05@gmail.com'

addspend.addEventListener('click', () => {
    let modelo = document.querySelector('.spendcontainer')
    modelo.style.display = 'flex'
})

closebutton.addEventListener('click', () => {
    let modelo = document.querySelector('.spendcontainer')
    modelo.style.display = 'none'
})

addspending.addEventListener('click', async () => {
    let modelo = document.querySelector('.spendcontainer')
    modelo.style.display = 'none'
    let url = 'http://localhost:5000/addspend'
    let url1 = 'http://localhost:5000/addfixed'
    let expensename = document.getElementById('expensename')
    let amount = document.getElementById('amount-expense')
    let expensetype = document.getElementById('expensetype')
    let data = { 'expensename': expensename.value, 'amount': amount.value, 'expensetype': expensetype.value, 'email': email }
    try {
        console.log("inside try")
        if (data['expensetype'] === 'recurring') {
            data['amounttype'] = 'outflow'
            let response = await fetch(url1, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        }
        else {
            console.log("we are wrong")
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        }
        balanceinfochange()
    }
    catch (err) {
        console.log(err)
    }
})

//Show loans popup

closebuttonloan.addEventListener('click', () => {
    let loancontainer = document.querySelector('.loancontainer')
    loancontainer.style.display = 'none'
})

popup_loan.addEventListener('click', async () => {
    let loancontainer = document.querySelector('.loancontainer')
    loancontainer.style.display = 'none'
    let loanname = document.getElementById('loanname').value
    let loanamt = document.getElementById('loanamt').value
    let loanint = document.getElementById('loanint').value
    let loantime = document.getElementById('loantime').value

    let email = { 'email': email, 'loanname': loanname, 'loanamt': loanamt, 'loanint': loanint, 'loantime': loantime }
    let url = 'http://localhost:5000/addloan'

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: json.stringify(data)
        })

        if (!response.ok) {
            throw new Error('Network Error')
        }
        await loanlist()
    }
    catch (err) {
        console.log(err)
    }

})

addloans.addEventListener('click', () => {
    let loancontainer = document.querySelector('.loancontainer')
    loancontainer.style.display = 'flex'
})

async function balanceinfochange() {
    let url = 'http://localhost:5000/balanceinfo'
    data = { 'email': email }
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let returned = await response.json()
        amountleftp.textContent = returned.amountleft
        amountspentp.textContent = returned.amountspent
        amountsavep.textContent = returned.amountsave
    }
    catch (err) {
        console.log(err)
    }
}

async function loanlist() {
    let url = 'http://localhost:5000/loanlist'
    let bodyhtml = document.querySelector('body')
    data = { 'email': email }
    keys = ['Loan Name', 'Loan Amount', 'Loan Interest', 'Loan Time']
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let loanjson = await response.json()
        let listofloan = loanjson['loanlist']
        if (listofloan.length == 0) {
            listloan.innerHTML = '<h4>No List Added</h4>'
        }
        else {
            for (let i of listofloan) {
                let div = document.createElement('div')
                let but = document.createElement('button')
                but.className = 'btn btn-primary'
                but.innerHTML = 'More Information'
                but.style.marginTop = '5px'

                but.addEventListener('click', async () => {

                    let modelo = document.createElement('div')
                    let modelc = document.createElement('div')
                    let headingc = document.createElement('div')
                    let headline = document.createElement('div')
                    let headins = document.createElement('h2')
                    let insidepop = document.createElement('div')
                    let unname = document.createElement('div')
                    let clspopbtn = document.createElement('button')
                    modelo.className = `loan-overlays ${i[0] + i[1]}`
                    modelc.className = 'modal-contents'
                    modelc.style.paddingBottom = '10px'
                    headingc.className = 'heading-close'
                    headline.className = 'Headline'
                    headins.className = 'heading-spending'
                    headins.textContent = `Loan Information for ${i[1]}`
                    insidepop.className = 'popupinside'
                    clspopbtn.className = 'btn btn-primary'
                    clspopbtn.innerHTML = 'Close the Details'

                    for (let j = 0; j < 4; j++) {
                        unname.innerHTML += `<h5 style="display:inline-block">${keys[j]}:</h5> ${i[j + 1]} ${keys[j] == 'Loan Interest' ? '%' : '' || keys[j] == 'Loan Time' ? 'years' : ''} <br>`
                    }

                    unname.innerHTML += `<br>${i[5]}`

                    clspopbtn.addEventListener('click', () => {
                        bodyhtml.removeChild(modelo)
                    })

                    headline.appendChild(headins)
                    headingc.appendChild(headline)
                    modelc.appendChild(headingc)
                    insidepop.appendChild(unname)
                    insidepop.appendChild(clspopbtn)
                    modelc.appendChild(insidepop)
                    modelo.appendChild(modelc)
                    bodyhtml.appendChild(modelo)
                })

                for (let j = 0; j < 4; j++) {
                    div.innerHTML += `<h5 style="display:inline-block">${keys[j]}:</h5> ${i[j + 1]} ${keys[j] == 'Loan Interest' ? '%' : '' || keys[j] == 'Loan Time' ? 'years' : ''} &nbsp&nbsp&nbsp`
                }
                div.appendChild(but)
                listloan.appendChild(div)

            }
        }
    }
    catch (err) {
        console.log(err)
    }
}


window.onload = async function () {
    balanceinfochange()
    loanlist()
}