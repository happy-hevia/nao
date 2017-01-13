/**
 * Created by marcd on 09/01/2017.
 */

var currentUser;

// Récupère l'utilisateur courant à chaque chargement de page depuis le local storage
currentUserStorage.getCurrentUser()


/* Définition de la classe User */
function User(nom, prenom, email, pseudo, role) {
    this.valueList=["null", "Visiteur","Naturaliste", "Admin"];
    this.nom = nom;
    this.prenom = prenom;
    this.pseudo = pseudo;
    this.email = email;
    this.role = role;
    this.setNull = function () {
        console.log("User=Null");
        currentUser=this.valueList[0];
        updateDOMElementVisibility();
    };
    this.setVisiteur = function () {
        console.log("User=Visiteur");
        currentUser=this.valueList[1];
        updateDOMElementVisibility();
    };
    this.setNaturaliste = function() {
        console.log("User=Naturaliste");
        currentUser=this.valueList[2];
        updateDOMElementVisibility();
    };
    this.setAdmin = function() {
        console.log("User=Administrateur");
        currentUser=this.valueList[3];
        updateDOMElementVisibility();
    };
}

// Gestion du formualaire de connexion en mode hors ligne
function gestionFormulaireConnexionHorsLigne(){
    var formulaire = $('#form-login-offline');
    var select = $('#form-login__user');

    //Je récupère les utilisateurs locaux
    userStorage.getAll();

    // si il n'y a pas d'utilisateurs locaux, on le notifie à l'internaute
    if (userStorage.coll == null) {
        formulaire.replaceWith("<div class='alert alert-warning' role='alert'><strong>OUPS !</strong> Il n'y a d'utilisateur disponible en mode hors ligne, merci de vous connectez à votre compte en ligne avant de pouvoir accéder à votre compte en mode hors ligne</div>")

    //    si il y a des utilisateurs locaux, on les intégrent dans le formulaire
    } else {
        for(var utilisateur in userStorage.coll) {

        }
    }
}
