let influxtxt = document.getElementById('influx-balance')
let addinflux = document.getElementById('addinflux')
let closebutton = document.querySelector('.close-button')
let modaloverlay = document.querySelector('.modal-overlays')
let addearning = document.querySelector('.addearning')
let email = 'krishnannarayanan05@gmail.com'
let latestspend = document.getElementById('latestspend')
let bodyhtml = document.querySelector('body')

addinflux.addEventListener('click', () => {
    modaloverlay.style.display = 'flex'
})

closebutton.addEventListener('click', () => {
    modaloverlay.style.display = 'none'
})

addearning.addEventListener('click', async () => {
    let url = 'http://localhost:5000/addinflux'
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
    let url = 'http://localhost:5000/influxlist'
    try {
        let response = await fetch(url)
        if (response.status != 200) {
            throw new Error('Network response was not ok');
        }
        data = await response.json()
        let values = data.Values
        influxtxt.innerHTML = ''
        for (let i of values) {
            influxtxt.innerHTML += `${i[0]} - ${i[1]}<br>`
        }
    }
    catch (err) {
        console.log(err)
    }
}


async function latestspends() {
    let url = 'http://localhost:5000/latestspend'
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
        let url = 'http://localhost:5000/bargraph'
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
        values = [data['recurring'], data['recurring'], data['recurring'], data['recurring']]
        months = data['months']
        tempvalue = [data['recurring'], data['recurring'], data['recurring'], data['recurring']]
        allvalues = [tempvalue, data.unexpected, data.variable, data.casual]
        for (let i = 0; i <= 3; i++) {
            values[i] = values[i] + data.unexpected[i] + data.variable[i] + data.casual[i]
        }
        let sum = 0
        for (let i of values) {
            sum += i
        }
        sum = Math.ceil(sum / 4)
        heightofbar = [0, 0, 0, 0]
        for (let i = 0; i <= 3; i++) {
            heightofbar[i] = Math.floor((values[i] / sum) * 50)
        }

        const bars = document.querySelectorAll('.bar');
        const popups = document.querySelectorAll('.popup_bar')


        let color = ['black', 'brown', 'burlywood', 'seagreen']

        popups.forEach((popup, index) => {
            popup.innerHTML = `<h5>${monthdict[months[index]]}</h5><br>Total :- ${values[index]}<br>Recurring :- ${allvalues[0][index]} <br> Unexpected :- ${allvalues[1][index]} <br> Variable :- ${allvalues[2][index]} <br> Casual :- ${allvalues[3][index]}`
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
    catch (err) {
        console.log(err)
    }
}

window.onload = async function () {
    influxload()
    latestspends()
    bargraph()
}