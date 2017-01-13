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
    this.typeStockage=typeStockage;
    this.cle=cle;
    this.coll= {};
    this.loaded=false;
    this.getAll = function() {
        // récuperation de la valeur et parse JSON
        this.coll= JSON.parse(this.typeStockage.getItem(this.cle));
        this.loaded=true;
    };
    this.setAll = function(objectColl) {
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
var userStorage = new MyWebStore("localUsers",sessionStorage);
userStorage.add = function(newUser) { // Ajoute ou met à jour l'objet
    if (!this.loaded) {
        this.getAll();
    }
    var users = this.coll || {};
    users[newUser.email]=newUser;
    this.setAll(users);
};

/**
 * Objet : currentUserStorage
 * Description : Permet la persistence et la récupération de l'utilisateur courant
 * @type {MyWebStore}
 */
var currentUserStorage = new MyWebStore("currentUser",sessionStorage);
    // Ajoute ou met à jour l'utilsateur courant dans la session, null pour indiquer qu'il n'y a pas d'utilisateur courrant
        currentUserStorage.setCurrentUser = function(currentUserEmail) {
        // Je stocke l'email dans la session
        this.setAll(currentUserEmail);
        // Je récupère l'ensemble des utilisateurs locaux
        userStorage.getAll();
        // Je définie le rôle de l'utilisateur dans la variable global
        if (currentUserEmail !== null ) {
            currentUser = userStorage.coll[currentUserEmail].role;
        } else {
            currentUser = 'null';
        }
        // Je met à jour les pages selon le nouveau utilisateur
        updateDOMElementVisibility()
    }

    // Récupère l'utilisateur courant dans la session
        currentUserStorage.getCurrentUser = function() {
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
var observationStorage = new MyWebStore("observations",localStorage);
observationStorage.add = function(newObservation) {
    if (!this.loaded) {
        this.getAll();
    }
    var observations=this.coll;
    observations[newObservation.date]=newObservation;
    this.setAll(observations);
};
/**
 * Objet : oiseauStorage
 * Description : Permet la récupération en mémoire de la liste des oiseaux
 */
var oiseauStorage = function() {
    this.coll={};
    this.loaded=false;
    this.nom_completColl=[];
    this.getAll = function() {
        // Ici exploitation du fichier JSON fourni par Matthias
        //TODO: Récupérer la liste des oiseaux à partir du fichier JSON "oiseau.json" de Matthias => this.coll

        // Extraction de la liste des désignations pour l'autocompletion => this.nom_completColl
        this.nom_completColl=[];
        for (var i=0; i<this.coll.length; i++) {
            this.nom_completColl.push(this.coll[i].nom_complet);
        }
        this.loaded=true;
    };
    // Ici pas de Setter car on ne va créer aucun oiseau
    this.getMedia = function (espece) {
        if (Connexion().isConnected() && espece!=null) {
            var mediaList=[];
            //TODO: Exploiter le fichier JSON this.coll pour :
            // -> récupérer la liste URL des images correspondantes
            // -> et retourner le tableau
            return mediaList;
        } else {
            return false;
        }
    };
    this.getDescriptions = function (espece) {
        var descriptionList=[];
        //TODO: Exploiter le fichier JSON this.coll pour:
        // -> Récupérer la liste des descriptions et leur type.
        // -> et retourner le tableau
        return descriptionList;
    }
};

var storeDetector = function() {
    this.key="nao";
    this.test = false;
    this.versions={}; // Pour la mémorisation des versions (date) des bases
    this.init = function() {
        if (localStorage.getItem(this.key)) {
            // Le stockage existe, on ne fait rien de particulier hormis le lancement des boucles de détection d'état

        } else {
            // Il faut créer ici la base de données locale
            localStorage.setItem(this.key, new Date());
        }
    }
};

/**
 * Fonction : startListeners
 * Description :
 *      Lance les boucles de détection Localisation et connexion internet
 */
function Listeners() {
    this.testGPS = function(){
        // Mémorisation de l'état initial
        var gpsStateMemo = gpsState;
        if (Localisation().isAvailable()) {
            if (gpsStateMemo!=gpsState) {
                // On vient de passer de l'état "gps_ko" à "gps_ok"
                updateDOMElementVisibility();
            } // S'il n'y a pas de changement d'état, on ne fait rien
        } else {
            if (gpsStateMemo!=gpsState) {
                // On vient de passer de l'état "gps_ok" à "gps_ko"
                updateDOMElementVisibility();
            } // S'il n'y a pas de changement d'état, on ne fait rien
        }
    };
    this.start = function (){
        // La disponibilité de la localisation est testée toutes les 5 secondes
        setTimeout(this.testGPS(),5000);

        Offline.options = {
            checkOnLoad: true,
            checks: {
                image: {
                    url: 'http://www.vitaminedz.com/photos/49/02-49565-front-de-mer-a-oran.jpg' //TODO: Générer lien test
                },
                active: 'image'
            }
        };
        // La disponibilité de la connexion est testée toutes les 3 secondes par défault
        Offline.on('up', function(){
            Connexion().connecter();
            updateDOMElementVisibility();
        });
        Offline.on('down', function(){
            Connexion().deconnecter();
            updateDOMElementVisibility();
        });
    };
}
