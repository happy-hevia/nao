/**
 * Created by marcd on 09/01/2017.
 */

var currentUser;

/* Définition de la classe User */
function User() {
    this.nom = "";
    this.prenom = "";
    this.email = "";
}
User.valueList=["null", "particulier","naturaliste", "administrateur"];
User.setNull = function () {
    console.log("User=Null");
    currentUser=User.valueList[0];
    updateDOMElementVisibility();
};
User.setUserData = function (nom, prenom, email) {
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
};
User.setVisiteur = function () {
    console.log("User=particulier");
    currentUser=User.valueList[1];
    updateDOMElementVisibility();
};
User.setNaturaliste = function() {
    console.log("User=naturaliste");
    currentUser=User.valueList[2];
    updateDOMElementVisibility();
};
User.setAdmin = function() {
    console.log("User=administrateur");
    currentUser=User.valueList[3];
    updateDOMElementVisibility();
};