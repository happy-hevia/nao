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
                    $('#modal-sign-up').modal('hide');
                    setMessage("Votre compte a bien été enregistré. Merci de vous connecter !");
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


// Gestion du formualaire de connexion en mode hors ligne
function gestionFormulaireConnexionHorsLigne(){
    var formulaire = $('#form-login-offline');
    var select = $('#form-login__user');
    var boutonSoumission = $('#form-login-offline__submit');

    //Je récupère les utilisateurs locaux
    userStorage.getAll();

    // si il n'y a pas d'utilisateurs locaux, on le notifie à l'internaute
    if (userStorage.coll == null) {
        formulaire.replaceWith("<div class='alert alert-warning' role='alert'><strong>OUPS !</strong> Il n'y a d'utilisateur disponible en mode hors ligne, merci de vous connectez à votre compte en ligne avant de pouvoir accéder à votre compte en mode hors ligne</div>")

        //    si il y a des utilisateurs locaux, on les intégrent dans le select du formulaire
    } else {
        for(var utilisateur in userStorage.coll) {
            select.append("<option value='" + utilisateur + "'>" + utilisateur + "</option>");
        }
    }

//    si le formulaire est validé
    boutonSoumission.on('click', function() {
        $('#modal-login').modal('hide') // Je ferme la modal
        currentUserStorage.setCurrentUser($('#form-login__user option:selected').val()); // Je définie le nouveau utilisateur courant
    });
}


// Formulaire d'ajout d'observation
// @todo vérifier que l'espèce existe bien
// @todo autocomplétion espèce
// @todo emplacement actuel

// formulaire de validation espèce
