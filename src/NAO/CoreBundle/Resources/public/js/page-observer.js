/**
 * Created by marcd on 17/01/2017.
 */
oiseauStorage.loadAll();
activationDescriptionEspece();
fillTabObserver();
/**
 * Rempli le tableau des observations sur la page Observer
 */
function fillTabObserver(){
    observationStorage.getAll();
    var observations = observationStorage.coll;

    var tableContent;
    for (var observation in observations) {
        console.log(gpsCoords);
        var distance = Localisation.distance(gpsCoords.latitude, gpsCoords.longitude, observation.latitude, observation.longitude);
        tableContent = tableContent + "<tr ><td data-time='" + observations[observation].date + ">" + observations[observation].oiseauId + " - " + observations[observation].observateur + "</td >" +
                        "<td >" + observations[observation].latitude + ", " + observations[observation].longitude + "</td >" +
                        "<td >" + distance + "</td ></tr>";

    }

    $('#emplacement__ligne tbody').append(tableContent);
}

/**
 * Permet d'afficher la modal avec les informations de l'espèce quand l'internaute clique sur le nom de l'espèce
 */
function affichageInformationObservation(){
    $('#emplacement__ligne td:first-of-type').click(function(){

    })
}