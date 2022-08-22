function UpdateAll() {
    //execute tout les fonction
    updateTime();
    updateData();
}

//Mise a jour de la date et de l'heures
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

//Recuperatoin des données API
function getWeatherData() {
    let t_getWeather = 86400000;
    setTimeout("getWeatherData()", t_getWeather);

    // METAR sources
    // https://api.aviationapi.com/v1/weather/metar?apt=TFFF
    // https://tgftp.nws.noaa.gov/data/observations/metar/stations/TFFF.TXT
    // HTML => https://fr.allmetsat.com/metar-taf/amerique-du-sud.php?icao=TFFF
    // https://api.met.no/weatherapi/tafmetar/1.0/metar.txt?icao=tfff

    // https://thingproxy.freeboard.io/fetch/ helps to solve CORS problem
    // not working anymore trying https://cors-anywhere-sage.vercel.app/ //vercel hosted cors-anywhere
    https: return fetch(
        "https://cors-anywhere-sage.vercel.app/api.aviationapi.com/v1/weather/metar?apt=TFFF"
    )
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
                humidite: humidity_calcl(
                    jsonData.TFFF.dewpoint,
                    jsonData.TFFF.temp
                ),
                vitesseNoeud: jsonData.TFFF.wind_vel,
                vitesseVentKmh: vitesseVent_calcl(jsonData.TFFF.wind_vel),
            };

            return data_value;
        });
}

function getAirQualityData() {
    let t_getAireQuality = 3600000;
    setTimeout("getAirQualityData()", t_getAireQuality);

    const apiBaseUrl =
        "https://services1.arcgis.com/y8pKCLYeLI1K2217/arcgis/rest/services/ind_martinique/FeatureServer/0/query?";

    let now = new Date();
    now.setDate(now.getDate() - 3);
    var date = now.toISOString();

    var filter = `where=date_dif>='${date}'+and+code_zone='97213'&outFields=code_qual,lib_qual,coul_qual,date_dif,source,type_zone,code_zone,lib_zone,date_ech&returnGeometry=false&outSR=4326&f=json`;

    var queryUrl = apiBaseUrl + filter;

    return fetch(queryUrl) //si pas internet utiliser le fichier data.json, si internet utilisé la variable queryUrl
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                console.log("ERREUR lecture json");
                return null;
            }
        })
        .then((data) => {
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
            // récupérer les éléments dont on veut changer la valeur dans la page et changer

            return today;
        });
}

//Mise a jours des donner dans le DOM un fois celle-ci recup par les API
async function updateData() {
    //on demande a la fonction d'attendre la recupératio des donners API avant de continuer sont execution
    const dataWeather_wait = await getWeatherData();
    const dataAireQuality_wait = await getAirQualityData();

    //Capture des element dans le DOM
    const meteo = document.querySelector(".image-meteo");
    const celcus = document.querySelector(".celcus :first-child");
    const humidite = document.querySelector(".precipitation");
    const vitesse_vent = document.querySelector(".humidite");
    const img_AutoriserOuPas = document.querySelector(".img_AutoriserOuPas");
    const SportOuPas = document.querySelector(".SportOuPas");

    //Intégration dans le DOM des condition meteo
    let weatherData = getWeatherData();
    weatherData.then((value) => {
        console.log(value);

        celcus.textContent = value.temperature + "°C";
        humidite.textContent = "Humidité: " + value.humidite + "%";
        vitesse_vent.textContent = "Vent: " + value.vitesseVentKmh + "Km/h";

        //Condtion d'affichage des image météo
        switch (value.state) {
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
    });

    //Mise a jour de la fleche indiquant la qualité de l'aire
    let airData = getAirQualityData();
    airData.then((value) => {
        console.log(value);
        updateFleche(value.qualite);
    });

    //Dit si oui ou non la pratique du sport est conseillé

    let qualiteAire = (await airData).qualite;
    let t = parseInt((await weatherData).temperature);
    let rh = parseInt((await weatherData).humidite);

    let heatIndex_value = indice_chaleur(50, 20);
    console.log(heatIndex_value);

    if (heatIndex_value <= 27 || qualiteAire <= 2) {
        img_AutoriserOuPas.src = "images/autorise.png";
        SportOuPas.textContent = "Sport autorisé";
    } else if (
        (heatIndex_value >= 28 && heatIndex_value <= 31) ||
        qualiteAire <= 2
    ) {
        img_AutoriserOuPas.src = "images/autorise.png";
        SportOuPas.textContent = "Sport autorisé";
    } else if (
        (heatIndex_value >= 32 && heatIndex_value <= 40) ||
        (qualiteAire >= 3 && qualiteAire <= 4)
    ) {
        img_AutoriserOuPas.src = "images/restreint.png";
        SportOuPas.textContent = "Sport limité dans l'enceinte du régiment";
    } else if (
        (heatIndex_value >= 41 && heatIndex_value <= 53) ||
        (qualiteAire >= 5 && qualiteAire <= 6)
    ) {
        img_AutoriserOuPas.src = "images/deconseille.png";
        SportOuPas.textContent = "Sport strictement interdit";
    } else if (heatIndex_value > 53 || (qualiteAire >= 5 && qualiteAire <= 6)) {
        img_AutoriserOuPas.src = "images/deconseille.png";
        SportOuPas.textContent = "Sport strictement interdit";
    }
}

//Fonction de calcule de l'humidité et de conversion de la vitesse du vent
function humidity_calcl(dewpoint_value, temp_value) {
    //fonction de caclcule de l'humidité

    humidity = -1 * (5 * (temp_value - dewpoint_value) - 100);
    return humidity;
}

function vitesseVent_calcl(vitesseEnNoeud) {
    kmParheure = vitesseEnNoeud * 1.852;
    return kmParheure;
}

//fonction deplacement de la fleche  selon la qualité de l'aire
function updateFleche(value) {
    // récupérer element .fleche-col
    var fleche = document.getElementsByClassName("fleche-col");
    // changer le style de l'element pour que grid-column-start soit égale à value
    fleche[0].style.gridColumnStart = value;
    fleche[0].style.gridRowStart = value;
}

//Calcule l'indice de chaleur
function indice_chaleur(T, RH) {
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

    return HI.heatIndex({ temperature: T, humidity: RH });
}
