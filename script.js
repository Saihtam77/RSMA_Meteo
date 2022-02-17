
//appelle des fonction
function all() { //execute tout les fonction
    updateTime();
    updateData();
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


function refresh_data() {// fonction timer pour l'actualisation des donnés
    let t_data = 60000;
    setTimeout('weather()', t_data)
}

function refresh_date() {//fonction timer pour l'actualisatoin de l'horloge et de la date
    let t_time = 1000;
    setTimeout('updateTime()', t_time)
}


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


// création des fonction météo

function weather() { //Change les element donner en fonction de donnée

    //capture de tous les balise html néccesaire
    const meteo = document.querySelector(".météo");
    const celcus = document.querySelector(".celcus :first-child");
    const humidite = document.querySelector(".precipitation");
    const vitesse_vent = document.querySelector(".humidite");
    const precipitation = document.querySelector(".vitesse_vent");


    //initialisation du fetch
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let fetchInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'no-cors',
        cache: 'default'
    };

    //Capture de L'API
    fetch("meteo.json", fetchInit)
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

            const data_value = { //recup des donner de l'API

                state: jsonData.TFFF.wx,
                temperature: jsonData.TFFF.temp,
                dewpoint: jsonData.TFFF.dewpoint,
                vitesse: jsonData.TFFF.wind_vel,
            }

            const convert_value = { //Convertion des unité de certain valeur
                humidité: humidity_calcl(data_value.dewpoint, data_value.temperature),
                vitesseDuVent: vitesseVent_calcl(data_value.vitesse),
            }

            //affichage dans le console (Pour verifier)
            console.log("Température:", data_value.temperature, "°")
            console.log("Humidité de:", convert_value.humidité, "%")
            console.log("Vent: ", convert_value.vitesseDuVent, "Km/h")
            console.log(data_value.state)

            //Ajout dans le DOM
            celcus.textContent = (data_value.temperature + "°")
            humidite.textContent = ("Humidité: " + convert_value.humidité + "%")
            vitesse_vent.textContent = ("Vent: " + convert_value.vitesseDuVent + " Km/h")

            switch (data_value.state) {
                case "RA":
                    meteo.src = "icone météo/rain.png";
                    break;
                case "TS":
                    meteo.src = "icone météo/fort orage.png";
                    break;
                case "+RA":
                    meteo.src = "icone météo/pluvieux.png";
                    break;
                case "SKC":
                    meteo.src = "icone météo/ensolellier.png";
                    break;
                case "NSC":
                    meteo.src = "icone météo/ensolellier.png";
                    break;
                case "FEW":
                    meteo.src = "icone météo/nuageux.png";
                    break;
                case "SCT":
                    meteo.src = "icone météo/nuageux.png"
                    break;
                case "BKN":
                    meteo.src = "icone météo/nuageux.png"
                    break;
                case "OVC":
                    meteo.src = "icone météo/nuageux.png"
                    break;


            }

        })

    //Creation des fonction de convertion des unité
    function humidity_calcl(dewpoint_value, temp_value) { //fonction de caclcule de l'humidité

        humidity = -1 * (5 * (temp_value - dewpoint_value) - 100);
        return humidity;
    }

    function vitesseVent_calcl(vitesseEnNoeud) {

        kmParheure = vitesseEnNoeud * 1.852;
        return kmParheure;

    }

}