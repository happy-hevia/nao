/**
 * Created by marcd on 09/01/2017.
 */

var gpsState;
var gpsCoords=null;
var survId=null;

/* Définition des fonctions et classe de l'espace de nom Localisation */
function Localisation() {} // Espace de nom

Localisation.Coords = function(latitude, longitude, altitude) { // Objet coordonnées
    this.latitude=latitude;
    this.longitude=longitude;
    this.altitude=altitude;
};

Localisation.stateList=["gps_ko","gps_ok"];

Localisation.setIndisponible = function() {
    if (gpsState != Localisation.stateList[0]) {// Si changement d'état seulement
        console.log("GPS= Indisponible");
        gpsState = Localisation.stateList[0];
        updateDOMElementVisibility();
    }
};
Localisation.setDisponible = function() {
    if (gpsState != Localisation.stateList[1]) {// Si changement d'état seulement
        console.log("GPS= Disponible");
        gpsState = Localisation.stateList[1];
        updateDOMElementVisibility();
    }
};
Localisation.isAvailable = function() {
    Localisation.testAvailable();
    return gpsState===Localisation.stateList[1];
};
Localisation.updatePosition = function (position) {
    console.log(position);
    gpsCoords = new Localisation.Coords(position.coords.latitude,position.coords.longitude,position.coords.altitude);
    $(".glyphicon-record").attr("title","Localisation Disponible");
    Localisation.setDisponible();
};
Localisation.testAvailable = function () {
    if (navigator.geolocation) {
        survId=navigator.geolocation.watchPosition(Localisation.updatePosition);
        navigator.geolocation.getCurrentPosition(this.updatePosition, function(positionError) {
            Localisation.setIndisponible();
            navigator.geolocation.clearWatch(survId);
            var info = "Erreur lors de la géolocalisation : ";
            switch(positionError.code) {
                case positionError.TIMEOUT:
                    info += "Timeout !";
                    break;
                case positionError.PERMISSION_DENIED:
                    info += "Vous n’avez pas donné la permission";
                    break;
                case positionError.POSITION_UNAVAILABLE:
                    info += "La position n’a pu être déterminée";
                    break;
                case positionError.UNKNOWN_ERROR:
                    info += "Erreur inconnue";
                    break;
            }
            $(".glyphicon-ban-circle").attr("title",info);
        });
    } else {
        Localisation.setIndisponible();
        navigator.geolocation.clearWatch(survId);
        $(".glyphicon-ban-circle").attr("title","Localisation indisponible");
    }
};

Localisation.testGPS = function(){
    // Mémorisation de l'état initial de la variable globale
    var gpsStateMemo = gpsState;
    console.log("test position");
    if (Localisation.isAvailable()) {
        if (gpsStateMemo!=gpsState) {
            // On vient de passer de l'état "gps_ko" à "gps_ok"
            updateDOMElementVisibility();
        } // S'il n'y a pas de changement d'état, on ne fait rien
    } else {
        if (gpsStateMemo!=gpsState) {
            // On vient de passer de l'état "gps_ok" à "gps_ko"
            updateDOMElementVisibility();
        } // S'il n'y a pas de changement d'état, on ne fait rien
    }
};


Localisation.initListener = function() {
    Localisation.setIndisponible();
    setTimeout(Localisation.testGPS(),5000);
};



function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1); // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2) ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d; }

function deg2rad(deg) { return deg * (Math.PI/180) }
