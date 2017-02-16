/**
 * Created by marcd on 09/01/2017.
 */

var connexionState;
var timer; // Pour stockage listener cyclique de détection de la version du serveur
var internetTimer; // Pour stockage listener cyclique de détection de la présence d'internet

/* Définition des fonctions de l'espace de nom Connexion */
function Connexion() {} // Espace de nom
Connexion.stateList=["online","offline"];

Connexion.connecter =function(){
    connexionState = Connexion.stateList[0];
    // Je synchronize les observations vers le serveur
    synchronizeObservation();
    updateDOMElementVisibility();
    normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18
    });

    map = L.map('mapid', {
        center: [46.935261, 2.779541],
        zoom: 5,
        layers: normal
    });
    gestionCarte();
};
Connexion.deconnecter = function() {
    connexionState=Connexion.stateList[1];
    updateDOMElementVisibility();
    clearInterval(timer);
};
Connexion.isConnected = function() {
    return connexionState===Connexion.stateList[0];
}

Connexion.initListener = function() {
    internetTimer = window.setInterval(myConnexionAjax,1500);
    if (Connexion.isConnected()) {
        timer = window.setInterval(getServeurLastUpdate,120000);
    }
};

function myConnexionAjax () {
    try {
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: urlGestion,
            type: "GET",
            success: connexionOk,
            error: connexionKO
        }).fail(connexionKO);
    } catch(err) {
        connexionKO(null);
    }

}
function connexionOk(data) {
    if (pageChange===false && connexionState==="offline") {
        Connexion.connecter();
        // On active le listener de récupération du dernier update du serveur
        timer = window.setInterval(getServeurLastUpdate,120000);

        statutStorage.save();
        data=null;
    } else {

    }
}

function connexionKO(xhr, ajaxOptions, thrownError) {
    if (pageChange===false && connexionState==="online") {
        Connexion.deconnecter();
        statutStorage.save();
        var urlCourante = document.URL;
        // Si on est déconnecté alors que la page d'administration des droits est active Alors on redirige vers la page observer
        if (urlGestion === urlCourante) {
            // Je redirige vers la page observer
            document.location.href=urlAccueil;
        }
    }

}

function getServeurLastUpdate() {
    $.ajax({
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        url: urlGetLastServeurUpdate,
        type: "GET",
        success: function(lastupdate) {
            // Si les données serveurs sont plus récentes
            var localLastUpdate = updateStorage.coll;
            if (lastupdate>localLastUpdate) {
                synchronizeObservation();
            } else {
            }
        }
    });
}
