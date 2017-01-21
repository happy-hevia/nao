/**
 * Created by marcd on 09/01/2017.
 */


/**
 * Classe : MyWebStore
 * Description : Classe de stockage webstorage générique
 * @param cle
 * @param typeStockage
 * @constructor
 */
function MyWebStore (cle, typeStockage) {
    this.typeStockage = typeStockage;
    this.cle = cle;
    this.coll = {};
    this.loaded = false;
    this.getAll = function () {
        // récuperation de la valeur et parse JSON
        this.coll = JSON.parse(this.typeStockage.getItem(this.cle));
        this.loaded = true;
    };
    this.setAll = function (objectColl) {
        // Stockage de la valeur stringifié
        this.typeStockage.setItem(this.cle, JSON.stringify(objectColl));
        this.getAll(); // On recharge l'objet après la modification
    };
}

function myJsonAjax (url, requestData, successFunction) {
    $.ajax({
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        url: url,
        type: "POST",
        dataType: 'json',
        data: requestData,                               //{ lastUpdate: new Date()    },
        success: successFunction,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//########################################################################
//                  GESTION UTILISATEURS
//########################################################################
/**
 * Objet : userStorage
 * Description : Permet la persistence et la récupération des données User
 * @type {MyWebStore}
 */
var userStorage = new MyWebStore("localUsers", sessionStorage);
userStorage.add = function (newUser) { // Ajoute ou met à jour l'objet
    if (!this.loaded) {
        this.getAll();
    }
    var users = this.coll || {};
    users[newUser.email] = newUser;
    this.setAll(users);
};

userStorage.clean = function() {
  this.setAll({});
};

userStorage.hasNaturaliste = function() {
    // Je charge la collection des utilisateurs de la sessionStorage
    userStorage.getAll();
    // Pour chaque utilisateur, je regarde s'il a les droits de naturaliste.
    if (userStorage.coll != null) {
        for(var email in userStorage.coll) {
            if (isNaturaliste(userStorage.coll[email])) {
                // Je retourne True si au moins un utilisateur a les droits de Naturaliste
                return true;
            }
        }
    }
    // Je retourne False si aucun utilisateur n'est Naturaliste.
    return false;
};


/**
 * Objet : currentUserStorage
 * Description : Permet la persistence et la récupération de l'utilisateur courant
 * @type {MyWebStore}
 */
var currentUserStorage = new MyWebStore("currentUser", sessionStorage);
// Ajoute ou met à jour l'utilsateur courant dans la session, null pour indiquer qu'il n'y a pas d'utilisateur courrant
currentUserStorage.setCurrentUser = function (currentUserEmail) {
    // Je stocke l'email dans la session
    this.setAll(currentUserEmail);
    // Je récupère l'ensemble des utilisateurs locaux
    userStorage.getAll();
    // Je définie le rôle de l'utilisateur dans la variable global
    if (currentUserEmail !== null && Object.size(userStorage.coll)>0 ) {
        currentUser = userStorage.coll[currentUserEmail].role;
    } else {
        currentUser = 'null';
        console.log("Impossible de mémoriser "+currentUserEmail)
    }
    // Je met à jour les pages selon le nouveau utilisateur
    updateDOMElementVisibility()
}

// Récupère l'utilisateur courant dans la session
currentUserStorage.getCurrentUser = function () {
    // Je récupère l'adresse email de l'utilisateur courant
    this.getAll();
    // Je récupère l'ensemble des utilisateurs locaux
    userStorage.getAll();
    // Je définie le rôle de l'utilisateur dans la variable global
    if (currentUserStorage.coll != 'null' && currentUserStorage.coll != null && userStorage.coll.length>0) {
        currentUser = userStorage.coll[currentUserStorage.coll].role;
    } else {
        currentUser = 'null';
    }
    // Je met à jour les pages selon le nouveau utilisateur
    updateDOMElementVisibility()
};

//########################################################################
//                  GESTION OBSERVATIONS
//########################################################################
/**
 * Objet : observationStorage
 * Description : Permet la persistence et la récupération des données Observation
 * @type {MyWebStore}
 */
var observationStorage = new MyWebStore("observations", localStorage);
observationStorage.add = function (newObservation) {
    if (!this.loaded) {
        this.getAll();
    }
    var observation;
    if (this.coll == null) {
        observations = [];
    } else {
        observations = this.coll;
    }
    observations.push(newObservation);
    this.setAll(observations);
};

/**
 * Cette fonction vide le stockage local des Observations
 */
observationStorage.clean = function() {
    this.setAll(null);
}

/**
 * Cette fonction gère le traitement des données Observations reçues via AJAX et les ajoute en localStorage
 * @param data
 */
observationStorage.loadSuccess = function(data) {
    console.log("Téléchargement des données du Serveur -- Terminé !");
    syncState="sync_ok";
    updateDOMElementVisibility();
    updateStorage.update();
    // Je récupère la réponse
    // console.log("Données AJAX Observations reçues");
    // Lecture de chacun des éléments
    data.forEach(function(element) {
        // J'ajoute l'élément au stockage local
        observationStorage.add(element);
    });
};

/**
 * Cette fonction charge l'ensemble des Observations validées et les ajoutes au stockage local
 * Requiert : MyJsonAjax
 */
observationStorage.loadFromServeur = function() {
    //Construction de la requête AJAX pour récupérer les observations à synchroniser
    // On souhaite récupérer toutes les observations validées
    var status =["validated"];
    // Si un des utilisateurs du navigateur a les droits de Naturaliste, on charge en plus les observations à valider
    if (userStorage.hasNaturaliste()) {
        status.push("toValidate");
    }
    // Je lance la requête AJAX
    myJsonAjax(
        urlSynchroServeurLocal,
        {   status: status, // Etats des observations à récupérer
            lastUpdate: updateStorage.getLastUpdate // On précise la date du dernier update de la base locale
        },
        this.loadSuccess // Fonction callback en cas de succès de la requête AJAX.
    )
};

//########################################################################
//                  GESTION OISEAUX
//########################################################################
/**
 * Objet : oiseauStorage
 * Description : Permet la récupération en mémoire de la liste des oiseaux
 */
var oiseauStorage = {
    storeName: [],
    storeData: [],
    loadAll: function () {
        // on charge le fichier JSON
        $.getJSON("/nao/web/bundles/naocore/file/test.json", function (data) { // TODO: Changer URL par URL de prod window.location.host
            // un petit espion...
            console.log("\t#########   Il y a " + data.length + " espèces");

            for (var i = 0; i < data.length; i++) {
                oiseauStorage.storeName.push(data[i]["name"]);
                oiseauStorage.storeData[data[i]["name"]] = {
                    description: data[i]["description"],
                    image: data[i]["link"]
                };
            }
            // On active les listes d'autocomplétion
            var inputsAutocompletion = $(".liste_espece");
            $(function () {
                inputsAutocompletion.each(function () {
                    var awesomplete = new Awesomplete($(this).get()[0]);
                    awesomplete.list = oiseauStorage.storeName;
                });
            });
        });
    },
    getImage500300: function (nomEspece) { //window.location.host+
        return "/nao/web/bundles/naocore/images/oiseaux/" + nomEspece + ".jpg";
    }
};


//########################################################################
//                  GESTION SYNCHRONISATION LOCAL<->SERVEUR
//########################################################################

var updateStorage = new MyWebStore("last_update", localStorage);
updateStorage.update = function () { // Ajoute ou met à jour l'objet
    var dateCourrante = new Date();
    this.setAll(dateCourrante.getTime());
};
updateStorage.getLastUpdate = function() {
    if (typeof this.typeStockage == 'undefined' || this.typeStockage.getItem(this.cle) == null) {
        return null;
    } else {
        return new Date().setTime(this.typeStockage.getItem(this.cle));
    }
};

updateStorage.init = function() {
    syncState="sync_ec";
    updateDOMElementVisibility();
    observationStorage.loadFromServeur();
};

function synchronizeObservation(){
    // Je récupère les observations
    observationStorage.getAll();
    var observations = observationStorage.coll;

    //Je récupère la date du dernier update
    updateStorage.getAll();
    var last_update = updateStorage.coll;

    // Je crée un tableau avec toutes les observations à envoyer au serveur
    var observationsAjax = [];
    for (var observation in observations){
        // On transfert toutes les observations modifiées en locale
        if (observations[observation].lastUpdate.timestamp >= last_update) {
            observationsAjax.push(observations[observation]);
        }
    }
    if(observationsAjax.length == 0) {
        console.log("Pas d'élément à synchroniser");
        console.log("Synchronisation avec le serveur  -- Terminée");
        return;
    }

    // je définie la synchronisation comme en cours
    syncState = "sync_ec";
    updateDOMElementVisibility();


    // J'envois les observations aux serveur
    $.ajax({
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        url: "http://localhost/nao/web/app_dev.php/observation/synchronisation",
        type: "post", // La méthode indiquée dans le formulaire (get ou post)
        data: { observations : observationsAjax }, // Je sérialise les données (j'envoie toutes les valeurs présentes dans le formulaire)
        success: function (html) { // Je récupère la réponse du fichier PHP

            // Je vide de la base locale
            observationStorage.clean();
            // Je lance alors la synchronisation globale Serveur-> Locale
            observationStorage.loadFromServeur();
            // Je définie la synchronisation comme ok
            console.log("Synchronisation avec le serveur  -- Terminée");
            syncState = "sync_ok";
            updateDOMElementVisibility();

            // Je met à jour la date de la dernière modification
            var dateCourrante = new Date();
            dateCourrante = dateCourrante.getTime();
            updateStorage.setAll(dateCourrante);
        },
        error: function(){
            // Je définie la synchronisation comme ko en cas d'erreur
            syncState = "sync_ko";
            updateDOMElementVisibility();
        }
    });


}

var storeDetector = function () {
    this.key = "nao";
    this.test = false;
    this.versions = {}; // Pour la mémorisation des versions (date) des bases
    this.init = function () {
        if (localStorage.getItem(this.key)) {
            // Le stockage existe, on ne fait rien de particulier hormis le lancement des boucles de détection d'état

        } else {
            // Il faut créer ici la base de données locale
            localStorage.setItem(this.key, new Date());
        }
    }
};
