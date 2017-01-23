/**
 * Created by marcd on 09/01/2017.
 */

var connexionState;
var syncState;

/* Définition des fonctions de l'espace de nom Connexion */
function Connexion() {} // Espace de nom
Connexion.stateList=["online","offline"];
Connexion.connecter =function(){
    console.log("Internet=online");
    connexionState = Connexion.stateList[0];

    // Je synchronize les observations vers le serveur
    synchronizeObservation();
    updateDOMElementVisibility();

};
Connexion.deconnecter = function() {
    console.log("Internet=offline");
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
        checkOnLoad:true,
        interceptRequests: true,
        reconnect: {
            initialDelay:3,
            delay: 3
        },
        requests:true,
        checks:{
            image : {
                url: window.location.host+"\nao\web\bundles\naocore\images\favicon_back_end.ico",
                active: 'image'
            }
        }
    };
    Offline.on('up', function(){
        Connexion.connecter();
        updateDOMElementVisibility();
        console.log("\tPASSAGE EN MODE CONNECTE");
        // On synchronise la base locale -> Serveur
        synchronizeObservation();
    });
    Offline.on('down', function(){
        Connexion.deconnecter();
        console.log("\tPASSAGE EN MODE HORS-CONNEXION");
        updateDOMElementVisibility();
    });
};
