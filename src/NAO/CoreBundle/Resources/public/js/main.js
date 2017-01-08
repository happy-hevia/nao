/**
 * Created by marcd on 30/12/2016.
 */

/** Liste des fonctions de cette bibliothèque
 * - updateModalTarget  :    change de data-target des fenêtres modales pour que la bonne modale puisse se charger
 * - updateDOMElementVisibility   :   mets à jour les éléments du DOM suite à l'identification ou déconnexion de l'utilisateur
 *
 * *
 * // Création des variables globales
 * */

var syncState;

/* Définition de la classe Oiseau */
function Oiseau(id, ordre, famille, lb_nom, nom_complet, nom_complet_html, nom_vern, nom_vern_eng) {
    this.id=id;
    this.ordre=ordre;
    this.famille=famille;
    this.lb_nom=lb_nom;
    this.nom_complet=nom_complet;
    this.nom_complet_html=nom_complet_html;
    this.nom_vern=nom_vern;
    this.nom_vern_eng = nom_vern_eng;
    this.media=[];
    this.description=[];
}
/* Définition de la classe Observation */
function Observation(dateObservation, latitude, longitude, oiseauId, observateur) {
    this.date=dateObservation;
    this.latitude=latitude;
    this.longitude=longitude;
    this.oiseauId=oiseauId;
    this.observateur=observateur;
    this.stateList=["toValidate","validated", "inValidated"];
    this.state="toValidate";
    this.setToValidate=function(){
        this.state=this.stateList[0];
    };
    this.setValidated = function() {
        this.state=this.stateList[1];
    };
    this.setInValidated = function() {
        this.state=this.stateList[2];
    }
}

function MyStore (cle, typeStockage) {
    this.typeStockage=typeStockage;
    this.cle=cle;
    this.getAll = function() {
        return this.typeStockage.getItem(this.cle);
    };
    this.setAll = function(objectColl) {
        this.typeStockage.setItem(this.cle,objectColl);
    };
}
var userStorage = new MyStore("localUsers",sessionStorage);
userStorage.prototype.add = function(newUser) { // Ajoute ou met à jour l'objet
    var users=this.getAll();
    users[newUser.email]=newUser;
    this.setAll(users);
};

var observationStorage = new MyStore("observations",localStorage);
observationStorage.prototype.add = function(newObservation) {
    var observations=this.getAll();
    observations[newObservation.date]=newObservation;
    this.setAll(observations);
};

var storeDetector = function() {
    this.key="nao";
    this.test = false;
    this.init = function() {
      if (localStorage.getItem(this.key)) {
          // Le stockage existe, on ne fait rien
      } else {
          // Il faut créer ici la base de données locale
          localStorage.setItem(this.key, new Date());
      }
  }
};


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
 * convertDataToJSON
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
 * testConditions
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
 *
 */
$(function() {


    // Initialisation des variables globales
    connexionState= "online";   //TODO: lier au gestionnaire offline-js.js
    gpsState="gps_ko";
    syncState="sync_ok";
    currentUser ="visiteur";
    updateDOMElementVisibility();
    setMessage("");
    initSocialEvent();
    //setMessage("Grossière Erreur !!!");
    // Détection présence de l'application en locale

    // Si application présente en locale,
    //      récupération des informations web storage
    //      mise à jour des éléments

});
