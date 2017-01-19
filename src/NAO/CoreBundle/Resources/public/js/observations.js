/**
 * Created by marcd on 09/01/2017.
 */
/* Définition de la classe Observation */
function Observation(dateObservation, latitude, longitude, oiseauId, observateur) {
    this.date=dateObservation;
    this.latitude=latitude;
    this.longitude=longitude;
    this.oiseauId=oiseauId;
    this.observateur=observateur;
    this.stateList=["toValidate","validated", "inValidated"];
    this.state="toValidate";
    this.valideur="";
    this.offline=true; // Par défault l'utilisation de cette Classe est dans les fonctions hors connexion.
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