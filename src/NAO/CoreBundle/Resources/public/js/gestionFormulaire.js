/**
 Ce script permet de définir l'ensemble des fonctions en relation avec les formulaires
 **/

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
                if (html === "valide") {
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


/**
 * Permet de gérer la soumission du formulaire de connexion en mode en ligne
 */
function gestionFormulaireConnexionEnLigne() {
    var $formulaireConnexion = $('#form-login-online');

    // Lorsque je soumets le formulaire
    $formulaireConnexion.on('submit', function (e) {
        e.preventDefault(); // J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire

        var $this = $(this); // L'objet jQuery du formulaire
        // Envoi de la requête HTTP en mode asynchrone
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: $this.attr('action'), // Le nom du fichier indiqué dans le formulaire
            type: $this.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
            data: {
                email: $('#form-login__email').val(),
                mdp: $('#form-login__password').val()
            },
            success: function (jsonUtilisateur) { // Je récupère la réponse

                // Si les identifiant sont invalide
                if (jsonUtilisateur === "false") {
                    // J'affiche un message d'erreur en dessous du formulaire
                    $('#form-login-online__wrapper-error').html("<div class='alert alert-danger' role='alert'>Votre email ou mot de passe est incorrect</div>");
                } else {
                    $('#modal-login').modal('hide');
                    var utilisateur = JSON.parse(jsonUtilisateur);

                    // j'ajoute l'utilisateur dans la liste des utilisateurs disponible
                    userStorage.add(utilisateur);
                    // Je connecte cette utilisateur
                    currentUserStorage.setCurrentUser(utilisateur.email)
                }
            }
        });
    });
}

/**
 * Permet de gérer la soumission du formulaire en mode hors ligne
 */
function gestionFormulaireConnexionHorsLigne() {
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
        for (var utilisateur in userStorage.coll) {
            select.append("<option value='" + utilisateur + "'>" + utilisateur + "</option>");
        }
    }

//    si le formulaire est validé
    boutonSoumission.on('click', function () {
        $('#modal-login').modal('hide') // Je ferme la modal
        currentUserStorage.setCurrentUser($('#form-login__user option:selected').val()); // Je définie le nouveau utilisateur courant
    });
}


/**
 * Permet de gérer la soumission du formulaire de modification de mot passe sur la page "Mon Compte"
 */
function gestionFormulaireModificationMotDePasse() {
    var $formulaireModification = $('#form-change');

    // Lorsque je soumets le formulaire
    $formulaireModification.on('submit', function (e) {
        e.preventDefault(); // J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire

        //Je récupère l'email de l'utilisateur courrant
        currentUserStorage.getCurrentUser();
        var emailUtilisateur = userStorage.coll[currentUserStorage.coll].email;

        var $this = $(this); // L'objet jQuery du formulaire
        // Envoi de la requête HTTP en mode asynchrone
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: $this.attr('action'), // Le nom du fichier indiqué dans le formulaire
            type: $this.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
            data: {
                email: emailUtilisateur,
                mdpancien: $('#form-change__mdp-actuel').val(),
                mdpnouveau: $('#form-change__mdp-nouveau').val()
            },
            success: function (data) { // Je récupère la réponse
                if (data === "true") {
                    $formulaireModification.reset();
                    setMessage("Votre mot de passe a été validé avec succès");
                    $('#form-change__wrapper-error').html("");
                } else if (data === "false") {
                    $('#form-change__wrapper-error').html("<div class='alert alert-warning'>Le mot de passe actuel renseigné n'est pas correct !</div>");
                } else {
                    $('#form-change__wrapper-error').html("<div class='alert alert-warning'>" + data + "</div>");
                }
            }
        });
    });
}

/**
 * Permet de gérer le formulaire de recherche d'utilisateur par email
 */
function gestionFormulaireRechercheUtilisateur() {
    var $formulaireRecherche = $('#form-recherche-utilisateur');

    // Lorsque je soumets le formulaire
    $formulaireRecherche.on('submit', function (e) {
        e.preventDefault(); // J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire

        var $this = $(this); // L'objet jQuery du formulaire

        // Envoi de la requête HTTP en mode asynchrone
        $.ajax({
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            url: $this.attr('action'), // Le nom du fichier indiqué dans le formulaire
            type: $this.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
            data: {
                email: $('#form-recherche-utilisateur__email').val()
            },
            success: function (data) { // Je récupère la réponse
                // et je l'affiche
                $('#emplacement__recherche-utilisateur').html(data);

                // Permet d'activer la fonctionnalité de modification de droit sur la nouvelle ligne
                gestionPageGestion();
            }
        });
    });
}


// Formulaire d'ajout d'observation
// @todo vérifier que l'espèce existe bien
// @todo autocomplétion espèce
// @todo emplacement actuel

// formulaire de validation espèce
