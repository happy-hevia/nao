/**
 * Created by marcd on 09/01/2017.
 */
/* Définition de la classe Observation */
function Observation(dateObservation, latitude, longitude, oiseauId, observateur) {
    this.dateCreation=dateObservation;
    this.latitude=latitude;
    this.longitude=longitude;
    this.oiseau=oiseauId;
    this.observateur=observateur;
    this.stateList=["toValidate","validated", "inValidated"];
    this.statut="toValidate"; // Valeur par défault
    this.valideur="";
    this.lastUpdate=dateObservation; // A la création on positionne lastUpdate à la date de création
    this.imageName="";
    this.imageFile="";

    this.setToValidate=function(){
        this.statut=this.stateList[0];
        this.lastUpdate= new Date();
    };
    this.setValidated = function() {
        this.statut=this.stateList[1];
        this.lastUpdate= new Date();
    };
    this.setInValidated = function() {
        this.statut=this.stateList[2];
        this.lastUpdate= new Date();
    }
    this.getMessageStatut=function(statut) {
        switch (statut) {
            case this.stateList[0]:
                return "L'observation doit désormais être validée";
                break;
            case this.stateList[1]:
                return "L'observation a bien été validée";
                break;
            case this.stateList[2]:
                return "L'observation a bien été invalidée";
                break;
        }
    }
}