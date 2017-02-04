/**
 * Created by Jérémie on 14/01/2017.
 *
 * Ce script permet de gérer les fonctionnalités spécifiques à la page "gestion des droits"
 */
gestionPageGestion();

function gestionPageGestion() {

    //Lorsque le select est modifié
    $('.form-droit__select-droit').change(function () {
        var email = $(this).data('email');
        var nouveauDroit = this.value;

        // Je récupère l'utilisateur courrant pour pouvoir vérifier qu'il a bien les droits
        currentUserStorage.getAll();
        usersStorage.getAll();
        var modificateur = usersStorage.coll[currentUserStorage.coll];


        var $this = $(this); // L'objet jQuery du formulaire
        // Envoi de la requête HTTP en mode asynchrone
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: $this.data('action'), // Le nom du fichier indiqué dans le formulaire
            type: $this.data('method'), // La méthode indiquée dans le formulaire (get ou post)
            data: {
                modificateur: modificateur,
                email: email,
                nouveaudroit: nouveauDroit
            },
            success: function (data) { // Je récupère la réponse
                if (data === "true"){
                    setMessage("les droits ont bien été modifiés");
                    location.reload();
                } else {
                    setMessage("Impossible de modifier le droit");
                }

            }
        });
    });
}
