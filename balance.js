let influxtxt = document.getElementById('influx-balance')
let addinflux = document.getElementById('addinflux')
let closebutton = document.querySelector('.close-button')
let modaloverlay = document.querySelector('.modal-overlays')
let addearning = document.querySelector('.addearning')
let email = localStorage.getItem('email')
let latestspend = document.getElementById('latestspend')
let bodyhtml = document.querySelector('body')

addinflux.addEventListener('click', () => {
    modaloverlay.style.display = 'flex'
})

closebutton.addEventListener('click', () => {
    modaloverlay.style.display = 'none'
})

addearning.addEventListener('click', async () => {
    let url = 'https://cybersquad-backend.onrender.com/addinflux'
    try {
        let earningname = document.getElementById('earningname').value
        let earningamt = document.getElementById('amount-earning').value
        let data = { 'earningname': earningname, 'earningamt': earningamt, 'email': email }
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
        influxload()
    }
    catch (err) {
        console.log(err)
    }
    finally {
        modaloverlay.style.display = 'none'
    }
})

async function influxload() {
    let url = 'https://cybersquad-backend.onrender.com/influxlist'
    try {
        let response = await fetch(url)
        if (response.status != 200) {
            throw new Error('Network response was not ok');
        }
        data = await response.json()
        let values = data.Values
        influxtxt.innerHTML = ''
        console.log(values)
        influxtxt.style.textAlign = 'center'
        for (let i of values) {
            influxtxt.innerHTML += `${i[0].trimEnd()} - ${i[1]}<br>`
        }
    }
    catch (err) {
        console.log(err)
    }
}


async function latestspends() {
    let url = 'https://cybersquad-backend.onrender.com/latestspend'
    let dict = { 'email': email }
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(dict)
    })
    let data = await response.json()
    let spending = data.spendlist
    latestspend.innerHTML = ''
    latestspend.style.textAlign = 'center'
    latestspend.style.justifyContent = 'center'
    latestspend.style.alignItems = 'center'
    for (let i of spending) {
        time = i[3].split(' ')
        time.pop()
        time.pop()
        time = time.join(' ')

        expense = i[0][0].toUpperCase()
        for (let j = 1; j < i[0].length; j++) {
            expense += i[0][j]
        }

        latestspend.innerHTML += `Date - ${time} , Expense - ${expense} , Amount - ${i[2]} <br>`
    }
}

async function bargraph() {
    try {
        monthdict = { 1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December' }
        let url = 'https://cybersquad-backend.onrender.com/bargraph'
        let dict = { 'email': email }
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dict)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json()
        console.log(data)
        if ((data['variable'].length != 0) || (data['unexpected'].length != 0) || (data['casual'].length != 0) || data['recurring'] != 0) {
            values = [data['recurring'], data['recurring'], data['recurring'], data['recurring']]
            months = data['months']
            tempvalue = [data['recurring'], data['recurring'], data['recurring'], data['recurring']]
            allvalues = [tempvalue, data.unexpected, data.variable, data.casual]
            for (let i = 0; i <= 3; i++) {
                values[i] = values[i] + ((i < data['unexpected'].length) ? data.unexpected[i] : 0) + ((i < data['variable'].length) ? data.variable[i] : 0) + ((i < data['casual'].length) ? data.casual[i] : 0)
            }
            let sum = 0
            for (let i of values) {
                sum += i
            }

            console.log(allvalues)

            sum = Math.ceil(sum / 4)
            heightofbar = [0, 0, 0, 0]
            for (let i = 0; i <= 3; i++) {
                heightofbar[i] = Math.floor((values[i] / sum) * 50)
            }

            console.log()
            const bars = document.querySelectorAll('.bar');
            const popups = document.querySelectorAll('.popup_bar')


            let color = ['coral', 'brown', 'burlywood', 'seagreen']

            popups.forEach((popup, index) => {
                popup.innerHTML = `<h5>${monthdict[months[index]]}</h5><br>Total :- ${values[index]}<br>Recurring :- ${((index < allvalues[0].length) ? allvalues[0][index] : 0)} <br> Unexpected :- ${((index < allvalues[1].length) ? allvalues[1][index] : 0)} <br> Variable :- ${((index < allvalues[2].length) ? allvalues[2][index] : 0)} <br> Casual :- ${((index < allvalues[3].length) ? allvalues[3][index] : 0)}`
            })

            bars.forEach((bar, index) => {
                bar.style.height = `${heightofbar[index]}%`;
                let textdiv = document.createElement('div')
                textdiv.className = 'labelxdiv'
                textdiv.textContent = `${monthdict[months[index]]}`
                for (let i = 0; i < 4; i++) {
                    let subbar = document.createElement('div')
                    subbar.className = 'subbar'
                    subbar.className = 'bar'
                    subbar.style.height = `${Math.floor((allvalues[i][index] / values[index]) * 100)}%`
                    subbar.style.backgroundColor = color[i]
                    bar.appendChild(subbar)
                }
                bar.addEventListener('mouseover', () => {
                    popups[index].style.display = 'block'
                })

                bar.addEventListener('mouseout', () => {
                    popups[index].style.display = 'none'
                })

                bar.appendChild(textdiv)
            });
        }
        else {
            let barchart = document.querySelector('.bar-chart')
            barchart.innerHTML = "<h4>No payment made till this day</h4>"
            barchart.style.justifyContent = 'center';
            barchart.style.alignItems = 'center';
            barchart.style.textAlign = 'center';
        }
    }
    catch (err) {
        console.log(err)
    }
}

window.onload = async function () {
    if (!localStorage.getItem('email')) {
        window.location.href = 'sign-in.html';
    }
    influxload()
    latestspends()
    bargraph()
}