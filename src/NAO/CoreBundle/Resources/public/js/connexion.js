/**
 * Created by marcd on 09/01/2017.
 */

var connexionState;
var syncState;

/* Définition de la classe Connexion */
function Connexion() {
    this.stateList=["online","offline"];
    this.connecter =function(){
        console.log("Internet=online");
        connexionState = this.stateList[0];
        updateDOMElementVisibility();
        // TODO: Lancer la synchronisation

    };
    this.deconnecter = function() {
        console.log("Internet=offline");
        connexionState=this.stateList[1];
        updateDOMElementVisibility();
        // TODO: Arrêter la synchronisation
    };
    this.isConnected = function() {
        return connexionState===this.stateList[0];
    }
}
