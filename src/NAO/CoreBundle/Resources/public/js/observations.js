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
    this.lastUpdate=dateObservation; // A la création on positionne lastUpdate à la date de création
    this.setToValidate=function(){
        this.state=this.stateList[0];
        this.lastUpdate= new Date();
    };
    this.setValidated = function() {
        this.state=this.stateList[1];
        this.lastUpdate= new Date();
    };
    this.setInValidated = function() {
        this.state=this.stateList[2];
        this.lastUpdate= new Date();
    }
}