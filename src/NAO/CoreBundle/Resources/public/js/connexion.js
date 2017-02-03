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
    window.setInterval(myConnexionAjax,1500);
};

function myConnexionAjax () {
    $.ajax({
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        url: "/nao/web/app.php/admin",
        type: "GET",
        timeout: 3000,
        success: connexionOk,
        error: connexionKO
    }).fail(connexionKO);
}
function connexionOk(data) {
    if (connexionState==="offline") {
        Connexion.connecter();
        console.log("Connexion Internet OK");
        statutStorage().save();
        data=null;
    }
}
function connexionKO(xhr, ajaxOptions, thrownError) {
    if (connexionState==="online") {
        console.log("Connexion Internet KO");
        Connexion.deconnecter();
        statutStorage().save();
        var urlCourante = document.URL;
        // Si on est déconnecté alors que la page d'administration des droits est active Alors on redirige vers la page observer
        if (urlGestion === urlCourante) {
            // Je redirige vers la page observer
            document.location.href=urlAccueil;
        }
    }

}
