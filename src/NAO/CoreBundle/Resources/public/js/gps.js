/**
 * Created by marcd on 09/01/2017.
 */

var gpsState;


/* Définition de la classe Localisation */
function Localisation() {
    this.stateList=["gps_ko","gps_ok"];
    this.setIndisponible = function() {
        if (gpsState != this.stateList[0]) {// Si changement d'état seulement
            console.log("GPS= Indisponible");
            gpsState = this.stateList[0];
            updateDOMElementVisibility();
        }

    };
    this.setDisponible = function() {
        if (gpsState != this.stateList[1]) {// Si changement d'état seulement
            console.log("GPS= Disponible");
            gpsState = this.stateList[1];
            updateDOMElementVisibility();
        }
    };
    this.latitude=0.0;
    this.longitude=0.0;
    this.altitude=0.0;
    this.isAvailable = function() {
        this.testAvailable();
        return gpsState===this.stateList[1];
    };
    this.updatePosition = function (position) {
        this.latitude=position.coords.latitude;
        this.longitude=position.coords.longitude;
        this.altitude=position.coords.altitude;
        this.setDisponible;
    };
    this.testAvailable = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.updatePosition, function(positionError) {
                this.setIndisponible;
            });
        } else {
            this.setIndisponible;
        }
    }
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1); // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2) ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d; }

function deg2rad(deg) { return deg * (Math.PI/180) }
