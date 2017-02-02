/**
 * Created by marcd on 09/01/2017.
 */

var connexionState;
var syncState;

/* Définition des fonctions de l'espace de nom Connexion */
function Connexion() {} // Espace de nom
Connexion.stateList=["online","offline"];
Connexion.connecter =function(){
    connexionState = Connexion.stateList[0];

    // Je synchronize les observations vers le serveur
    synchronizeObservation();
    updateDOMElementVisibility();

};
Connexion.deconnecter = function() {
    connexionState=Connexion.stateList[1];
    updateDOMElementVisibility();
    // TODO: Arrêter la synchronisation
};
Connexion.isConnected = function() {
    return connexionState===Connexion.stateList[0];
}

Connexion.initListener = function() {
    console.log("\tLANCEMENT CONNEXION INIT-LISTENER");
    Offline.options = {
        checkOnLoad: true,
        interceptRequests: true,
        reconnect: {
            initialDelay:3,
            delay: 1
        },
        requests: true,
        checks:{xhr: {url: '/nao/web/bundles/naocore/file/alive.txt'}},
        game: false
    };
    Offline.on('up', function(){
        Connexion.connecter();
        console.log("\tPASSAGE EN MODE CONNECTE");
    });
    Offline.on('down', function(){
        Connexion.deconnecter();
        console.log("\tPASSAGE EN MODE HORS-CONNEXION");
    });
};

function myConnexionAjax () {
    $.ajax({
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        url: "/nao/web/app.php/admin",
        type: "GET",
        timeout: 2000,
        success: connexionOk,
        error: connexionKO
    }).fail(connexionKO);
}
function connexionOk(data) {
    if (connexionState==="offline") {
        Connexion.connecter();
        console.log("Connexion Internet OK");
        console.log(data);
        data=null;
    }
}
function connexionKO(xhr, ajaxOptions, thrownError) {
    if (connexionState==="online") {
        console.log("Connexion Internet KO");
        Connexion.deconnecter();
    }

}
window.setInterval(myConnexionAjax,2000);