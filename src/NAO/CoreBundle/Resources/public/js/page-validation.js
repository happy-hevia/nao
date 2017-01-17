/**
 * Created by marcd on 17/01/2017.
 */

gestionPageValidation();

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
}