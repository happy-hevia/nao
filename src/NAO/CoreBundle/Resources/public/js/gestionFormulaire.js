/**
 Ce script permet de gérer l'ensemble des formulaires du site : ce qui comprends les fonctionnalités suivantes
 - validation front
 **/

gestionFormulaireCreation();

/**
 * Permet de gérer la validation du formulaire de création
 */
function gestionFormulaireCreation() {
    var $formulaireCreation = $('form[name="nao_corebundle_utilisateur"]');

    // Activation de la validation front
    $formulaireCreation.parsley();

    // Lorsque je soumets le formulaire
    $formulaireCreation.on('submit', function (e) {
        e.preventDefault(); // J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire

        var $this = $(this); // L'objet jQuery du formulaire

        // Envoi de la requête HTTP en mode asynchrone
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: $this.attr('action'), // Le nom du fichier indiqué dans le formulaire
            type: $this.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
            data: $this.serialize(), // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
            success: function (html) { // Je récupère la réponse du fichier PHP

                // si le formulaire est valide alors je ferme la modal et j'affiche le message d'information
                if (html === "valide"){
                    $('#modal-sign-up').modal('hide')
                    setMessage("Votre compte a bien été enregistré. Merci de vous connecter !")
                } else {
                    // sinon j'affiche le formulaire avec les erreurs
                    $('#emplacement__formulaire-creation').html(html);
                    // je relance la fonction pour qu'elle soit actif avec le nouveau formulaire
                    gestionFormulaireCreation();
                }
            },
        });
    });
}


// Formulaire de connexion
// @todo gestion connexion en mode en ligne
// @todo gestion connexion en mode hors ligne


// Formulaire d'ajout d'observation
// @todo vérifier que l'espèce existe bien
// @todo autocomplétion espèce
// @todo emplacement actuel

// formulaire de validation espèce
