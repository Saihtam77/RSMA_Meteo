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
        console.log(today.qualite);
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
