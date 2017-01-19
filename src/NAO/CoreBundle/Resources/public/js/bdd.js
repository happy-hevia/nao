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
function MyWebStore(cle, typeStockage) {
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
    if (currentUserEmail !== null) {
        currentUser = userStorage.coll[currentUserEmail].role;
    } else {
        currentUser = 'null';
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
    if (currentUserStorage.coll != 'null' && currentUserStorage.coll != null) {
        currentUser = userStorage.coll[currentUserStorage.coll].role;
    } else {
        currentUser = 'null';
    }
    // Je met à jour les pages selon le nouveau utilisateur
    updateDOMElementVisibility()
};


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
        observations = {};
    } else {
        observations = this.coll;
    }
    observations[newObservation.date] = newObservation;
    this.setAll(observations);
};
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

var updateStorage = new MyWebStore("last_update", localStorage);
updateStorage.update = function () { // Ajoute ou met à jour l'objet
    var dateCourrante = new Date();
    this.setAll(dateCourrante.getTime());
};

function synchronizeObservation(){
    // Je récupère les observations
    observationStorage.getAll();
    var observations = observationStorage.coll;

    //Je récupère la date du dernier update
    updateStorage.getAll();
    var last_update = updateStorage.coll;

    // Je crée un tableau avec tout les observations à envoyé au serveur
    var observationsAjax = [];
    for (var observation in observations){
        if (observations[observation].date >= last_update) {
            observationsAjax.push(observations[observation]);
        }
    }

    if(observationsAjax.length == 0) {
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
            // Je définie la synchronisation comme ok
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
