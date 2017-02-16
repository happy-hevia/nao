/**
 Ce script permet de définir l'ensemble des fonctions en relation avec les formulaires
 **/

/**
 * Permet de gérer la validation du formulaire de création d'un nouveau compte utilisateur
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
                    setMessage("Votre compte a bien été enregistré. Vous devez valider votre compte depuis l'email de confirmation qui vous a été envoyé par email avant de vous connecter !");
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

                // Si les identifiant sont invalides
                if (jsonUtilisateur === "false") {
                    // J'affiche un message d'erreur en dessous du formulaire
                    $('#form-login-online__wrapper-error').html("<div class='alert alert-danger' role='alert'>Votre email ou mot de passe est incorrect</div>");
                } else {
                    $('#modal-login').modal('hide');
                    var utilisateur = JSON.parse(jsonUtilisateur);

                    // j'ajoute l'utilisateur dans la liste des utilisateurs disponible
                    usersStorage.add(utilisateur);
                    // Je connecte cette utilisateur
                    currentUserStorage.setCurrentUser(utilisateur.email)
                    // Je rafraichis la page pour rafraichir les listes en regard des droits de l'utilisateur
                    window.location.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
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
    usersStorage.getAll();

    // si il n'y a pas d'utilisateurs locaux, on le notifie à l'internaute
    if (usersStorage.coll == null) {
        formulaire.replaceWith("<div class='alert alert-warning' role='alert'><strong>OUPS !</strong> Il n'y a d'utilisateur disponible en mode hors ligne, merci de vous connectez à votre compte en ligne avant de pouvoir accéder à votre compte en mode hors ligne</div>")

        //    si il y a des utilisateurs locaux, on les intégrent dans le select du formulaire
    } else {
        for (var utilisateur in usersStorage.coll) {
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
        currentUserStorage.recoverCurrentUser();
        var emailUtilisateur = usersStorage.coll[currentUserStorage.coll].email;

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
                    $formulaireModification[0].reset();
                    setMessage("Votre mot de passe a été modifié avec succès");
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


/**
 * Permet de gérer le formulaire d'ajout d'une observation
 */
function gestionFormulaireAjoutObservation() {
    var $formulaireObservation = $('form[name="nao_corebundle_observation"]');


    // j'ajoute la contrainte de validation sur le choix oiseau pour vérifier que l'oiseaux est valide
    window.Parsley
        .addValidator('species', {
            requirementType: 'string',
            validateString: function (value) {
                var index = $.inArray(value, oiseauStorage.storeName);
                return index >= 0;
            },
            messages: {
                fr: 'Vous devez renseigner un oiseau valide'
            }
        });

    $formulaireObservation.parsley();

    // Si le formulaire a une erreur, j'affiche la modal
    if ($('#form-have-error').length >= 1) {
        $('#modal-addObservation').modal('show');
    }

    // Lorsque je soumets le formulaire
    $formulaireObservation.on('submit', submitAddObservation);
    function submitAddObservation (e) {
        setSyncState("sync_ec");
        if (!Connexion.isConnected()) {
            e.preventDefault();
            var $this = $(this);
            // Je récolte les informations de l'observation
            var dateObservation = $('#nao_corebundle_observation_dateCreation').val();
            var latitude = $('#nao_corebundle_observation_latitude').val();
            var longitude = $('#nao_corebundle_observation_longitude').val();
            var oiseauId = $('#nao_corebundle_observation_oiseau').val();
            var observateur = currentUserStorage.coll;

            // je crée l'objet javascript observation
            var observation = new Observation(dateObservation, latitude, longitude, oiseauId, observateur);
            observation.lastUpdate = $('#nao_corebundle_observation_lastUpdate').val();
            observation.id = observationStorage.getLocalId();

            // je le stocke dans le bdd local
            observationStorage.add(observation);
            $('#modal-addObservation').modal('hide');
            setSyncState("sync_todo");
            setMessage("Sauvegarde locale effectuée, En attente de connexion internet pour synchronisation avec le serveur...");
        }
        else {
            e.preventDefault();
            var $form = $(this);
            var formdata = (window.FormData) ? new FormData($form[0]) : null;
            var data = (formdata !== null) ? formdata : $form.serialize();

            $.ajax({
                url: $form.attr('action'), // Le nom du fichier indiqué dans le formulaire
                type: $form.attr('method'), // La méthode indiquée dans le formulaire (get ou post)
                contentType: false,
                processData: false,
                data: data, // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
                success: function(html) { // Je récupère la réponse du fichier PHP
                    if (html=="valide") {
                        setMessage("Sauvegarde serveur effectuée avec succès...Rechargement de la page en cours pour update ");
                        $('#modal-addObservation').modal('hide');
                        // on vide la base locale avant de rechargement
                        observationStorage.clean();
                        window.location.reload();
                    } else {
                        $form.replaceWith(html);
                        $('form[name="nao_corebundle_observation"]').on('submit', submitAddObservation);
                    }
                }
            });
           //    je ferme la modal et j'affiche le message de confirmation
        }
        /*else {
            observationStorage.clean();

            setMessage("Enregistrement en cours, Rechargement de la page...");
            setTimeout(function() {
                $('#modal-addObservation').modal('hide');
            }, 3000);*/
            //window.location.reload();
        //}


    }

//    Lorsque l'internaute clique sur le bouton emplacement actuel, rempli les champs longitude et latitude
    $('#btn-emplacement-actuel').click(function () {
        if (gpsState == "gps_ok") {
            $('#nao_corebundle_observation_latitude').val(gpsCoords.latitude);
            $('#nao_corebundle_observation_longitude').val(gpsCoords.longitude);
        } else {
            setMessage("Impossible d'accéder à la localisation courante !")
        }
    });

//    Lorsque l'internaute change la valeur de l'oiseau, change l'image si elle existe
    $('#nao_corebundle_observation_oiseau').on("awesomplete-selectcomplete", function () {
        if (connexionState == "online") {
            var image_url = oiseauStorage.getImage500300($(this).val());

            // affiche l'image correspondante à l'oiseau seulement si elle existe
            // sinon affiche l'image par defaut
            $.get(image_url)
                .done(function () {
                    $('#modal__image').attr('src', image_url);

                }).fail(function () {
                $('#modal__image').attr('src', "/bundles/naocore/images/v3-500.png");

            })
        }
    });
}

///**
// * Permet l'affichage des détails d'une espèce dans l'onglet de la modale descriptionObservation
// */
//function activationDescriptionEspece() {
//    $("#onglet_espece").click(function () {
//        //On récupère le nom de l'espèce dans le span form-observation__espece
//        var espece = $("#form-observation__espece").text();
//        // On récupère l'image et on lui change le href et sa description alt
//        $("#espece-image__").attr("src", oiseauStorage.getImage500300(espece)).attr("alt", espece).click(function () {
//            // Sur click sur l'image et si la connexion est Ok on ouvre l'image source
//            if (Connexion.isConnected()) {
//                window.open(oiseauStorage.storeData[espece].image);
//            }
//        });
//        // On met son nom et sa description
//        $("#espece-nom__").text(espece);
//        $("#espece-description__").html(oiseauStorage.storeData[espece].description);
//    });
//}

// Formulaire d'ajout d'observation
// @todo vérifier que l'espèce existe bien

// formulaire de validation espèce
/**
 * Permet la gestion du clic sur une observation à Valider permettant l'affichage de la modale descriptionObservation
 */
function gestionPageValidation() {

    //Lorsque le select est modifié
    $('.form-observation__select-statut').change(function () {
        // Je récupère l'Id de l'observation
        var id = $(this).data('id');
        // Je récupère le nouveau statut à mettre
        var nouveauStatut = this.value;
        // Je mets à jour le nouveau statut
        updateObservationStatut(id, nouveauStatut);
    });


    //Lorsque on clique sur un nom d'oiseau
    $('.observation_oiseau__').click(function () {
        var nom = $(this).text();
        $('.modal-title').text('Observation faite le' + $(this).data('date'));
        $('#modal-observation').modal('show');
        $('#form-observation__espece').html(nom);
        $('#form-observation__latitude').val($(this).data('latitude'));
        $('#form-observation__longitude').val($(this).data('longitude'));
    });
}

/**
 * Positionne le statut de l'observation n°id à nouveauStatut
 * @param id    : numéro de l'observation dans la base de données
 * @param nouveauStatut     : statut à positionner
 */
function updateObservationStatut(id, nouveauStatut) {
    // Je récupère l'email de l'utilisateur courant
    currentUserStorage.recoverCurrentUser();
    var emailUtilisateur = usersStorage.coll[currentUserStorage.coll].email;
    // Je récupère l'observation ayant l'id correspondant
    var observation = observationStorage.getById(id);
    if (observation != false) {
        // Je mets à jour les champs de l'observation concernée
        observation.valideur = emailUtilisateur;
        observation.statut = nouveauStatut;
        observation.lastUpdate = Math.round(new Date().valueOf() / 1000);
        // Je mets à jour la base locale
        observationStorage.setAll(observationStorage.coll);
        // Je positionne l'indicateur de synchronisation local -> Serveur à sync_todo
        setSyncState("sync_todo");
        // Si on est connecté à internet, on lance la synchronisation
        var requestData = {
            id: id,
            nouveaustatut: nouveauStatut,
            valideur: emailUtilisateur
        };

        if (Connexion.isConnected()) {
            // Envoi de la requête HTTP en mode asynchrone
            myJsonAjax(urlSynchroStatut, requestData, statutUpdateSuccess);
        } else {
            // J'informe l'utilisateur que le statut a bien été modifié
            setMessage("En attente de synchronisation, mémorisation locale bien effectuée");
            // Je rafraichis la page validation
            window.location.reload();
        }

    }
}
function statutUpdateSuccess(data) { // Je récupère la réponse

    if (data) {
        // J'informe l'utilisateur que le statut a bien été modifié
        setMessage("Modifications bien mémorisée");
        // Je rafraichis la page validation
        window.location.reload();
    } else {
        setMessage("Impossible de modifier le statut");
        // Dans ce cas on positionne l'indicateur de synchronisation en erreur
        setSyncState("Sync_ko");
    }
}
