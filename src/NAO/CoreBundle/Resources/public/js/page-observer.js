/**
 * Created by marcd on 17/01/2017.
 */
oiseauStorage.loadAll();
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