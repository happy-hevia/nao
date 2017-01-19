/**
 * Created by marcd on 17/01/2017.
 */
oiseauStorage.loadAll();
fillTabObserver();

$("#onglet_espece").click(function() {
    //On récupère le nom de l'espèce dans le span form-observation__espece
    var espece = $("#form-observation__espece").text();
    // On récupère l'image et on lui change le href et sa description alt
    $("#espece-image__").attr("src",oiseauStorage.getImage500300(espece)).attr("alt",espece).click(function() {
        // Sur click sur l'image et si la connexion est Ok on ouvre l'image source
        if (Connexion.isConnected()) {
            window.open(oiseauStorage.storeData[espece].image);
        }
    });
    // On met son nom et sa description
    $("#espece-nom__").text(espece);
    $("#espece-description__").html(oiseauStorage.storeData[espece].description);
});

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
