function all() { //execute tout les fonction
    updateTime();
    updateData();
}


function refresh_data() {//timer pour l'actualisation des donnés
    let t_data = 60000;
    setTimeout('weather()', t_data)
}

function refresh_date() {//timer pour l'actualisatoin de l'horloge et de la date
    let t_time = 1000;
    setTimeout('updateTime()', t_time)
}



function updateTime() {//fonction pour l'horloge et la date
    showDate();
    showTime();
    refresh_date();
}

function updateData() { //fonction pour les gestion des donner météo

    weather();
    refresh_data();

}



//Creation des fonction//


//Création de l'horloge et de la date
function showTime() {
    let date = new Date()
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if (h < 10) { h = '0' + h; }
    if (m < 10) { m = '0' + m; }
    if (s < 10) { s = '0' + s; }
    let time = h + ':' + m + ':' + s

    document.querySelector(".heure").innerHTML = time;
}
function showDate() {

    let date = new Date()

    let jours = date.getDate();
    let mois = date.getMonth() + 1;
    let annees = date.getFullYear();

    if (jours < 10) { jours = "0" + jours; }
    if (mois < 10) { mois = "0" + mois; }

    let resultat = jours + "/" + mois + "/" + annees;

    document.querySelector(".date").innerHTML = resultat;
}


//fonction météo
function weather() { //Change les element donner en fonction de donnée

    const météo = document.querySelector(".météo");

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let fetchInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'no-cors',
        cache: 'default'
    };

    fetch("data.json", fetchInit)
        .then(data => { //success or not
            if (data.ok) {

                console.log("sucess")
            }
            else {

                console.log("fail")
            }
            return data;
        })
        .then(data => data.json())//Conversion en json

        .then(jsonData => {
            console.log(jsonData);

            let today = {

                dewpoint: jsonData.TFFF.dewpoint,
                temperature: jsonData.TFFF.temp,

            }
            console.log(today.temperature)
        })
}