//reste arrondir a 2 decimal toFixed(2) OK
//rafraichir le résultat au changement de l'input change OK
//vérifier les données < 0 OK
//stocker le formulaire en cookies pour le remplir avec notre dernier calcul
//historique de calcul (seulement si clique sur calculer)
// imprimer la page
//convertir en pdf ou excel
//animation

function CalculGain() {
    //verify input
    checkInputs()
    // on récupère le formulaire
    let myForm = document.getElementById('formCalculGain')

    //On le transforme en obj formData
    let formObj = new FormData(myForm)

    //On récupère tous nos input
    let tauxHoraire = formObj.get('TH')
    let tauxJournalier = formObj.get('TJM')
    let Extras = formObj.get('Extras')

    let qteTauxHoraire = formObj.get('QteTH')
    let qtetauxJournalier = formObj.get('QteTJM')
    let qteExtras = formObj.get('QteExtras')

    let charges = formObj.get('charges')

    //  calcul
    let gainHeure = tauxHoraire * qteTauxHoraire
    let gainJour = tauxJournalier * qtetauxJournalier
    let gainExtras = Extras * qteExtras

    let calculBrut = (gainHeure + gainJour + gainExtras).toFixed(2)

    let taxes = document.getElementById('charges').value

    let calculTaxes = (calculBrut * (taxes / 100)).toFixed(2)

    let calculNet = calculBrut - calculTaxes

    //Animer lecompteur
    animateCounter('resultatBrut', calculBrut)
    animateCounter('resultatDifference', calculTaxes)
    animateCounter('resultatNet', calculNet)
}

async function animateCounter(idToReplace, total) {
    let cpt = 0
    let animationDuration = 70
    var myElementHTMLResult = document.getElementById(idToReplace)

    if (myElementHTMLResult.innerText != total + ' €') {
        let increment = Math.round(total / 10)
        if (increment == 0) increment = 1
        while (cpt <= total) {
            myElementHTMLResult.innerText = cpt + ' €'
            await timer(animationDuration)
            cpt += increment
        }
        myElementHTMLResult.innerText = total + ' €'
    }
}

function timer(ms) {
    return new Promise((res) => setTimeout(res, ms))
}

//check Input < 0
function checkInputs() {
    let mesInputs = document.querySelectorAll(
        '#formCalculGain input.formControl'
    )
    mesInputs.forEach((monInput) => {
        if (monInput.value < 0) {
            monInput.value = 0
        }
        saveElementInCookies(monInput)
    })
}

function saveElementInCookies(input) {
    document.cookie = input.name + ' = ' + input.value
}

// récupérer les cookies
function getCookie(input) {
    let myCookies = document.cookie
    //'TH=1; TJM=2; Extras=3; QteTH=4; QteTJM=5; QteExtras=6'
    // get the name of the input + =
    let name = input.name + '='
    let valueCookie = null

    //cut the string each '; '
    const tableCookies = myCookies.split('; ')

    //get the value of the cookie
    //
    tableCookies.forEach((cookie) => {
        if (cookie.indexOf(name) === 0) {
            valueCookie = cookie.substring(name.length)
            return valueCookie
        }
    })
    return valueCookie
}

// Mettre les éléments dans les inputs

//rafraichir le résultat au changement de l'input
let mesInputs = document.querySelectorAll('#formCalculGain input.formControl')
// si il a une valeur en cookie lui donner

mesInputs.forEach((monInput) => {
    let cookie = getCookie(monInput)

    if (cookie != undefined && cookie != null) {
        monInput.value = cookie
    }

    monInput.addEventListener('change', CalculGain)
})

//calcul avec le bouton
let btnCalc = document.getElementById('btnCalcul')
btnCalc.addEventListener('click', CalculGain)

CalculGain()
