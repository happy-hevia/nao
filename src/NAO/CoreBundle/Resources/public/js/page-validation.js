/**
 * Created by marcd on 17/01/2017.
 */

gestionPageValidation();
oiseauStorage.loadAll();

function gestionPageValidation() {

    //Lorsque le select est modifié
    $('.form-observation__select-statut').change(function () {
        var id = $(this).data('id');
        var nouveauStatut = this.value;

        var $this = $(this); // L'objet jQuery du formulaire
        // Envoi de la requête HTTP en mode asynchrone
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: $this.data('action'), // Le nom du fichier indiqué dans le formulaire
            type: $this.data('method'), // La méthode indiquée dans le formulaire (get ou post)
            data: {
                id: id,
                nouveaustatut: nouveauStatut
            },
            success: function (data) { // Je récupère la réponse
                if (data === "true"){
                    setMessage("le statut a bien été modifié");
                } else {
                    setMessage("Impossible de modifier le statut");
                }

            }
        });
    });
    //Lorsque on clique sur un nom d'oiseau
    $('.observation_oiseau__').click(function() {
        var nom = $(this).text();
        console.log('\t click sur '+nom);
        $('#modal-description').modal('show');
        $('#description_espece-nom__').html(nom);
        $("#description_espece-description__").html(oiseauStorage.storeData[nom].description);
        $('#description_espece-image__').attr("src",oiseauStorage.getImage500300(nom)).attr("alt",nom).click(function() {
            // Sur click sur l'image et si la connexion est Ok on ouvre l'image source
            if (Connexion.isConnected()) {
                window.open(oiseauStorage.storeData[nom].image);
            }
        });
    });
}