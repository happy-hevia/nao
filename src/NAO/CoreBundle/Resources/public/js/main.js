/**
 * Created by marcd on 30/12/2016.
 */

/** Liste des fonctions de cette bibliothèque
 * - updateModalTarget  :    change de data-target des fenêtres modales pour que la bonne modale puisse se charger
 * - updateHeaderUserElements   :   mets à jour les éléments du header suite à l'identification ou déconnexion de l'utilisateur
 *
 *
 * */

var updateDOMElementVisibility = function() {
    $("[data-on]").each(function(index, element) {
        // On récupère le tableau de condition
        var conditions=$(this).data("on");

    });
    $("[data-off]").each(function(index, element) {
        var conditions=$(this).data("off");
    });
};


$(function() {
    // Création des variables globales
    var currentUser;    // Nécessite
    var connexionState;
    var gpsState;
    var syncState;
    updateDOMElementVisibility();
    // Initialisation des variables globales
    connexionState= true;   //TODO: lier au gestionnaire offline-js.js
    gpsState=false;
    syncState=true;
    currentUser= "Not Identified";

    // Détection présence de l'application en locale

    // Si application présente en locale,
    //      récupération des informations web storage
    //      mise à jour des éléments

});
