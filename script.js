function all() {
  //execute tout les fonction
  updateTime();
  updateData();
}

function refresh_data() {
  //timer pour l'actualisation des donnés
  let t_data = 60000;
  setTimeout("weather()", t_data);
}

function refresh_date() {
  //timer pour l'actualisatoin de l'horloge et de la date
  let t_time = 1000;
  setTimeout("updateTime()", t_time);
}

function updateTime() {
  //fonction pour l'horloge et la date
  showDate();
  showTime();
  refresh_date();
}

function updateData() {
  //fonction pour les gestion des donner météo

  weather();
  refresh_data();
}

//Creation des fonction//

//Création de l'horloge et de la date
function showTime() {
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  let time = h + ":" + m + ":" + s;

  document.querySelector(".heure").innerHTML = time;
}
function showDate() {
  let date = new Date();

  let jours = date.getDate();
  let mois = date.getMonth() + 1;
  let annees = date.getFullYear();

  if (jours < 10) {
    jours = "0" + jours;
  }
  if (mois < 10) {
    mois = "0" + mois;
  }

  let resultat = jours + "/" + mois + "/" + annees;

  document.querySelector(".date").innerHTML = resultat;
}

//fonction météo
function weather() {
  //Change les element donner en fonction de donnée

  const météo = document.querySelector(".météo");

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let fetchInit = {
    method: "GET",
    headers: myHeaders,
    mode: "no-cors",
    cache: "default",
  };

  fetch("meteo.json", fetchInit)
    .then((data) => {
      //success or not
      if (data.ok) {
        console.log("sucess");
      } else {
        console.log("fail");
      }
      return data;
    })
    .then((data) => data.json()) //Conversion en json

    .then((jsonData) => {
      console.log(jsonData);

      let today = {
        state: jsonData.TFFF.wx,
        temperature: jsonData.TFFF.temp,
      };
      console.log(today.temperature);
    });
}
const apiBaseUrl =
  "https://services1.arcgis.com/y8pKCLYeLI1K2217/arcgis/rest/services/ind_martinique/FeatureServer/0/query?";

let now = new Date();
now.setDate(now.getDate() - 3);
var date = now.toISOString();

var filter = `where=date_dif>='${date}'+and+code_zone='97213'&outFields=code_qual,lib_qual,coul_qual,date_dif,source,type_zone,code_zone,lib_zone,date_ech&returnGeometry=false&outSR=4326&f=json`;

var queryUrl = apiBaseUrl + filter;

fetch(queryUrl) //si pas internet utiliser le fichier data.json, si internet utilisé la variable queryUrl
  .then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        // Lire le json
        /*console.log(data); */

        // stocker dans des variables les valeurs à afficher

        let today = {
          qualite: data.features[0].attributes.code_qual,
          date_dif: data.features[0].attributes.date_dif,
          source: data.features[0].attributes.source,
          lib_zone: data.features[0].attributes.lib_zone,
          lib_qual: data.features[0].attributes.lib_qual,
          couleur: data.features[0].attributes.coul_qual,
        };
        let yesterday = {
          qualite: data.features[1].attributes.code_qual,
          date_dif: data.features[1].attributes.date_dif,
          source: data.features[1].attributes.source,
          lib_zone: data.features[1].attributes.lib_zone,
          lib_qual: data.features[1].attributes.lib_qual,
          couleur: data.features[1].attributes.coul_qual,
        };

        // récupérer les éléments dont on veut changer la valeur dans la page et changer

        // Je dois sélectionner l'élément qualité de l'air du let today , afin de l'appliquer à la flèche
        updateFleche(today.qualite);
        //console.log(today.qualite);
      });
    } else {
      console.log("ERREUR lecture json");
      
    }
  });

function updateFleche(value) {
  // récupérer element .fleche-col
  var fleche = document.getElementsByClassName("fleche-col");
  // changer le style de l'element pour que grid-column-start soit égale à value
  fleche[0].style.gridColumnStart = value;
}

function authorizationSport(value) {
  //recuper element
}
