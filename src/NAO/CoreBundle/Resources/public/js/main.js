/**
 * Created by marcd on 30/12/2016.
 */

/**
 * String.replaceAll
 * Effet : Remplace toutes les occurences trouvées d'une chaine texte "search" et la remplace par "replacement"
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/**
 * convertDataToJSON utilisé par updateDOMElementVisibility
 * Effet : Convertis une chaîne texte au format JSON en objet JSON.
 * @param uneData
 * @returns {*}
 */
var convertDataToJSON = function(uneData) {
    // On remplace tous les simples guillemets par des guillemets doubles.
    uneData= uneData.replaceAll("'",'"');
    // On parse
    conditionsJSON = JSON && JSON.parse(uneData) || $.parseJSON(uneData);
    return conditionsJSON;
}

/**
 * testConditions (utilisé par updateDOMElementVisibility)
 * Effet : Retourne TRUE si toutes les conditions sont réunies. Retourne FALSE sinon.
 * @param unObjetJSON
 * @returns {boolean}
 */
var testConditions = function(unObjetJSON) {
    var numberOfConditions = Object.keys(unObjetJSON).length;
    //console.log(unObjetJSON);
    var test=[];
    for (var i=0;i<numberOfConditions;i++) {
        var key = Object.keys(unObjetJSON)[i];
        var valeur = unObjetJSON[key];
        if (valeur==eval(key)) {
            test[i]=true;
        } else {
            test[i]=false;
        }
    }
    // On vérifie que toutes les conditions sont remplies
    var trueCounter=0;
    for (var i=0;i<numberOfConditions;i++) {
        if (test[i]) {
            trueCounter++;
        }
    }
    return (trueCounter==numberOfConditions);
}

/**
 * updateDOMElementVisibility
 * Effet : Affiche ou Masque les éléments du DOM ayant les attributs "data-on" ou "data-off"
 * en fonction des valeurs des variables globales.
 */
var updateDOMElementVisibility = function() {
    $("[data-on]").each(function(index, element) {
        // On récupère les conditions au format String
        var conditions=$(this).data("on");
        // On les convertit en objet JSON
        conditionsJSON = convertDataToJSON(conditions);
        // On teste toutes les conditions
        test = testConditions(conditionsJSON);
        if (test) { // Si les conditions sont remplies
            // On affiche l'élément
            $(this).show();
        } else { // Sinon
            // On masque l'élément
            $(this).hide();
        }
    });
    $("[data-off]").each(function(index, element) {
        var conditions=$(this).data("off");
        conditionsJSON = convertDataToJSON(conditions);
        test = testConditions(conditionsJSON);
        if (!test) { // Si les conditions ne sont pas remplies
            // On affiche l'élément
            $(this).show();
        } else { // Sinon
            // On masque l'élément
            $(this).hide();
        }
    });
};
/**
 * setMessage
 * Effet : Affiche un bandeau contenant un message d'erreur qui disparait si l'on clique dessus.
 * @param aMessage
 */
var setMessage = function(aMessage) {
    if (aMessage=="") { // Si le message est vide, on masque le bandeau
        $('#cadre_message').hide();
    } else { // Sinon on met le message et on affiche le bandeau
        $('#message').html(aMessage);
        $('#cadre_message').click(function() { // Sur click le bandeau doit se refermer
            $('#message').html("");
            $('#cadre_message').unbind('click');
            $('#cadre_message').hide();
        });
        $('#cadre_message').show();
    }
}

/**
 * deconnecte l'utilsateur lorsqu'il clique sur le bouton deconnection
 */
function gestionBoutonConnexion(){
    $('#menu__deconnexion').click(function(){
        currentUserStorage.setCurrentUser(null);
        // redirige vers la page d'accueil
        window.location.href = "http://localhost/nao/web/app_dev.php";
    })
}

/**
 *
 */
$(function() {
    // Initialisation des variables globales
    connexionState= "online";
    gpsState="gps_ko";
    syncState="sync_ok";
    updateDOMElementVisibility();
    setMessage("");
    initSocialEvent();
    Listeners.start();

    //setMessage("Grossière Erreur !!!");
    // Détection présence de l'application en locale

    // Si application présente en locale,
    //      récupération des informations web storage
    //      mise à jour des éléments


    // Récupère l'utilisateur courant à chaque chargement de page depuis le local storage
    currentUserStorage.getCurrentUser();

    gestionFormulaireCreation();
    gestionFormulaireConnexionHorsLigne();
    gestionFormulaireConnexionEnLigne();
    gestionBoutonConnexion();
    gestionFormulaireModificationMotDePasse();
    gestionFormulaireRechercheUtilisateur();
});
