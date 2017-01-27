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
 * Affiche le message d'information depuis le dom #message
 */
function afficheMessageDepuisDom(){
    var contenuMessage = $('#message-dom').data('content');
    setMessage(contenuMessage);
}

/**
 * Permet d'afficher la modal avec les informations de l'espèce quand l'internaute clique sur le nom de l'espèce
 */
function affichageInformationObservation(selectionDomStr) {
    $(selectionDomStr).click(function () {
        //    On récupère les informations de l'observation
        observationStorage.getAll();
        var observations = observationStorage.coll;
        var id = $(this).data('id');
        var observation = observationStorage.getById(id);

        //    On récupère la date de l'observation
        var dateObservation = new Date(observation.dateCreation*1000);
        var moisTab = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var annee = dateObservation.getFullYear();
        var mois = moisTab[dateObservation.getMonth()];
        var jours = dateObservation.getDate();
        var dateFormatee = jours + " " + mois + " " + annee;

        //    On l'affiche dans la modal
        $('#form-observation__latitude').val(observation.latitude);
        $('#form-observation__longitude').val(observation.longitude);
        $('#form-observation__espece').text(observation.oiseau);
        $('#form-observation__date').text(dateFormatee);

        //    On affiche le bouton #annuler_observation uniquement si l'utilisateur courant est l'observateur.
        currentUserStorage.recoverCurrentUser();
        var emailUtilisateur = usersStorage.coll[currentUserStorage.coll].email;
        if (observation != false) {
            var emailObservateur = observation.observateur;
            if (emailUtilisateur===emailObservateur) {
                // Si l'utilisateur courant est l'observateur, on active le bouton d'annulation de l'observation
                $('#annuler_observation').attr("data-id",id).click(function() {
                    // Sur clic je récupère l'id de l'observation
                    var id=$(this).data('id');
                    // On met à jour le statut de l'observation
                    updateObservationStatut(id,"inValidated");
                    // On ferme la modale
                    $('#modal-observation').modal('hide');
                }).show();
            } else {
                // On masque le bouton annuler si l'utilisateur courant n'est pas l'observateur
                $('#annuler_observation').hide();
            }
            if (observation.statut==="validated") {
                // Si l'observation est déjà validée, on masque les boutons de validation et d'invalidation de l'observation
                $('#valider_observation').hide();
                $('#refuser_observation').hide();
            } else {
                $('#valider_observation').attr("data-id",id).click(function() {
                    // Sur clic je récupère l'id de l'observation
                    var id=$(this).data('id');
                    // On met à jour le statut de l'observation
                    updateObservationStatut(id,"validated");
                    // On ferme la modale
                    $('#modal-observation').modal('hide');
                }).show();
                $('#refuser_observation').attr("data-id",id).click(function() {
                    // Sur clic je récupère l'id de l'observation
                    var id=$(this).data('id');
                    // On met à jour le statut de l'observation
                    updateObservationStatut(id,"inValidated");
                    // On ferme la modale
                    $('#modal-observation').modal('hide');
                }).show();
            }

        } else {
            setMessage("Observation non trouvée dans la base locale !");
            console.log("Observation non trouvée d'id :"+id);
        }
        // On initialise l'onglet "espèce"
        var espece = observation.oiseau;
        // On récupère l'image et on lui change le href et sa description alt
        $("#espece-image__").attr("src", oiseauStorage.getImage500300(espece)).attr("alt", espece).click(function () {
            // Sur click sur l'image et si la connexion est Ok on ouvre l'image source
            if (Connexion.isConnected()) {
                window.open(oiseauStorage.storeData[espece].image);
            }
        });
        // On met son nom et sa description
        $("#espece-nom__").text(espece);
        $("#espece-description__").html(oiseauStorage.storeData[espece].description);

        //    ouvre la modal information sur l'observation
        $('#modal-observation').modal('show');
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


    // Récupèration de l'ensemble des données des bases locales
    usersStorage.getAll();
    currentUserStorage.getAll();
    observationStorage.getAll();
    oiseauStorage.loadAll();

    currentUserStorage.recoverCurrentUser();
    if (Connexion.isConnected()) {
        // Je teste l'existence d'un stockage local via la présence de la dernière date de synchronisation (updateStorage)
        updateStorage.getAll();
        if (updateStorage.getLastUpdate != null) { // Si le stockage local existe,
            // Je teste l'existence d'un stockage local d'observation (observationStorage)

            if(observationStorage.coll!=null) { // Si le stockage local d'observation existe
                console.log("Le Stockage local OBSERVATION trouvé");
                // Je lance la synchronisation avec le Serveur
                synchronizeObservation();
            } else { // Si le stockage local d'observation n'existe pas
                // Je lance la récupération de l'ensemble des Observations du Serveur
                console.log("Le Stockage local OBSERVATION n'existe PAS");
                updateStorage.init();
            }
        } else { // Le Stockage local n'existe pas
            // Je lance la récupération de l'ensemble des Observations du Serveur
            console.log("Le Stockage local n'existe PAS");
            updateStorage.init();
        }

    }

    gestionFormulaireCreation();
    gestionFormulaireConnexionHorsLigne();
    gestionFormulaireConnexionEnLigne();
    gestionBoutonConnexion();
    gestionFormulaireModificationMotDePasse();
    gestionFormulaireRechercheUtilisateur();
    gestionFormulaireAjoutObservation();
    afficheMessageDepuisDom();
    //gestionMesObservations();


});
