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
        gpsState = Localisation.stateList[0];
        statutStorage.save();
        updateDOMElementVisibility();
    }
};
Localisation.setDisponible = function() {
    if (gpsState != Localisation.stateList[1]) {// Si changement d'état seulement
        gpsState = Localisation.stateList[1];
        statutStorage.save();
        updateDOMElementVisibility();
    }
};
Localisation.isAvailable = function() {
    Localisation.testAvailable();
    return gpsState===Localisation.stateList[1];
};
Localisation.updatePosition = function (position) {
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
    if (Localisation.isAvailable()) {
        if (gpsStateMemo!=gpsState) {
            // On vient de passer de l'état "gps_ko" à "gps_ok"
            Localisation.setDisponible();
        } // S'il n'y a pas de changement d'état, on ne fait rien
    } else {
        if (gpsStateMemo!=gpsState) {
            // On vient de passer de l'état "gps_ok" à "gps_ko"
            Localisation.setIndisponible
        } // S'il n'y a pas de changement d'état, on ne fait rien
    }
};


Localisation.initListener = function() {
    Localisation.testAvailable();
    setInterval(Localisation.testGPS,2000);
};

Localisation.distance = function(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
