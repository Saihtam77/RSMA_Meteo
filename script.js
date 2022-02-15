
//actualisation de l'heure et de la date tout les minute
function refresh() {
    let t_time = 1000; // rafraîchissement en millisecondes de l'horloge
    setTimeout('updateTime()', t_time)
}

function updateTime() {
    showDate();
    showTime();
    refresh();
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

    let resultat = jours + "/" + mois + "/" + annees

    document.querySelector(".date").innerHTML = resultat;
}
