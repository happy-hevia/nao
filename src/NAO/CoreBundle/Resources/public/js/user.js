/**
 * Created by marcd on 09/01/2017.
 */

var currentUser;

/* Définition de la classe User */
function User(nom, prenom, email) {
    this.valueList=["null", "Visiteur","Naturaliste", "Admin"];
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
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