//appelle des fonction
function UpdateAll() {
    //execute tout les fonction
    updateTime();
    updateData();
}

function updateTime() {
    //fonction pour l'horloge et la date

    let t_time = 1000;
    setTimeout("updateTime()", t_time);

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

function updateData() {
    //fonction pour les gestion des donner météo

    let t_data = 60000;
    setTimeout("updateData()", t_data);

    let data = weather();
    console.log(data);
    aire_quality();
    authorizationSport();
}

// création des fonction météo

function weather() {
    //capture de tous les balise html néccesaire
    const meteo = document.querySelector(".image-meteo");
    const celcus = document.querySelector(".celcus :first-child");
    const humidite = document.querySelector(".precipitation");
    const vitesse_vent = document.querySelector(".humidite");
    const precipitation = document.querySelector(".vitesse_vent");

    let result = null;

    //initialisation du fetch
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let fetchInit = {
        method: "GET",
        headers: myHeaders,
        mode: "no-cors",
        cache: "default",
    };

    //Capture de L'API
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

            const data_value = {
                //recup des donner de l'API
                state: jsonData.TFFF.wx,
                temperature: jsonData.TFFF.temp,
                dewpoint: jsonData.TFFF.dewpoint,
                vitesse: jsonData.TFFF.wind_vel,
            };

            const convert_value = {
                //Convertion des unité de certain valeur
                humidité: humidity_calcl(
                    data_value.dewpoint,
                    data_value.temperature
                ),
                vitesseDuVent: vitesseVent_calcl(data_value.vitesse),
            };

            //affichage dans le console (Pour verifier)
            console.log("Température:", data_value.temperature, "°");
            console.log("Humidité de:", convert_value.humidité, "%");
            console.log("Vent: ", convert_value.vitesseDuVent, "Km/h");
            console.log(data_value.state);

            //Ajout dans le DOM
            celcus.textContent = data_value.temperature + "°";
            humidite.textContent = "Humidité: " + convert_value.humidité + "%";
            vitesse_vent.textContent =
                "Vent: " + convert_value.vitesseDuVent + " Km/h";

            switch (data_value.state) {
                case "RA":
                    meteo.src = "icone-meteo/rain.png";
                    break;
                case "TS":
                    meteo.src = "icone-meteo/fort-orage.png";
                    break;
                case "+RA":
                    meteo.src = "icone-meteo/pluvieux.png";
                    break;
                case "SKC":
                    meteo.src = "icone-meteo/ensoleille.png";
                    break;
                case "NSC":
                    meteo.src = "icone-meteo/ensoleille.png";
                    break;
                case "FEW":
                    meteo.src = "icone-meteo/nuageux.png";
                    break;
                case "SCT":
                    meteo.src = "icone-meteo/nuageux.png";
                    break;
                case "BKN":
                    meteo.src = "icone-meteo/nuageux.png";
                    break;
                case "OVC":
                    meteo.src = "icone-meteo/nuageux.png";
                    break;
            }

            result = { convert_value, data_value };
        });

    //Creation des fonction de convertion des unité
    function humidity_calcl(dewpoint_value, temp_value) {
        humidity = -1 * (5 * (temp_value - dewpoint_value) - 100);
        return humidity;
    }

    function vitesseVent_calcl(vitesseEnNoeud) {
        kmParheure = vitesseEnNoeud * 1.852;
        return kmParheure;
    }
}

function aire_quality() {
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
}

function authorizationSport(data) {
    var HI = {
        // utility functions
        toFahrenheit: function (celsius) {
            return (9 * celsius) / 5 + 32;
        },
        toCelsius: function (fehrenheit) {
            return (5 * (fehrenheit - 32)) / 9;
        },
        getType: function (input) {
            return {}.toString.call(input).slice(8, -1);
        },

        // definition http://www.hpc.ncep.noaa.gov/html/heatindex_equation.shtml
        // input = {
        //     temperature: Number,  required
        //     humidity   : Number,  required
        //     fahrenheit : Boolean, optional
        // }
        heatIndex: function (input) {
            if (arguments.length === 0) {
                throw new Error("Invalid Argument. Need at least one.");
            }
            if (HI.getType(input) !== "Object") {
                throw new TypeError("Invalid Argument. Expecting 'Object'");
            }
            if (
                HI.getType(input.temperature) !== "Number" ||
                HI.getType(input.humidity) !== "Number"
            ) {
                throw new TypeError(
                    "Invalid Argument. temperature and humidity must be 'Number'"
                );
            }

            var t = HI.toFahrenheit(input.temperature) || 0,
                h = input.humidity || 0;

            if (input.fahrenheit) {
                t = input.temperature;
            }

            // Steadman's result
            var heatIndex = 0.5 * (t + 61 + (t - 68) * 1.2 + h * 0.094);

            // regression equation of Rothfusz is appropriate
            if (t >= 80) {
                var heatIndexBase =
                    -42.379 +
                    2.04901523 * t +
                    10.14333127 * h +
                    -0.22475541 * t * h +
                    -0.00683783 * t * t +
                    -0.05481717 * h * h +
                    0.00122874 * t * t * h +
                    0.00085282 * t * h * h +
                    -0.00000199 * t * t * h * h;
                // adjustment
                if (h < 13 && t <= 112) {
                    heatIndex =
                        heatIndexBase -
                        ((13 - h) / 4) *
                            Math.sqrt((17 - Math.abs(t - 95)) / 17);
                } else if (h > 85 && t <= 87) {
                    heatIndex =
                        heatIndexBase + ((h - 85) / 10) * ((87 - t) / 5);
                } else {
                    heatIndex = heatIndexBase;
                }
            }

            return input.fahrenheit ? heatIndex : HI.toCelsius(heatIndex);
        },
    };

    let indice_de_chaleur = HI.heatIndex({ temperature: 25, humidity: 70 });
    return indice_de_chaleur;
}
