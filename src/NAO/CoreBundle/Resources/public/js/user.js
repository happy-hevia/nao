/**
 * Created by marcd on 09/01/2017.
 */

var currentUser;

var valueList=["null", "particulier","naturaliste", "administrateur"];
/* Définition de la classe User */
function User(nom, prenom, email, pseudo, role, date ) {
    this.valueList=["null", "particulier","naturaliste", "administrateur"];
    this.date = date;
    this.nom = nom;
    this.prenom = prenom;
    this.pseudo = pseudo;
    this.email = email;
    this.role = role;
    this.clef = null;
}
User.setNull = function () {
    currentUser=this.valueList[0];
    updateDOMElementVisibility();
};
User.setVisiteur = function () {
    currentUser=this.valueList[1];
    updateDOMElementVisibility();
};
User.setNaturaliste = function() {
    currentUser=this.valueList[2];
    updateDOMElementVisibility();
};
User.setAdmin = function() {
    currentUser=this.valueList[3];
    updateDOMElementVisibility();
};
isNaturaliste = function(user) {
    return valueList[2] === user.role;
};
