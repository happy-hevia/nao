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
    this.coll={};
    this.loaded=false;
    this.getAll = function() {
        this.coll= this.typeStockage.getItem(this.cle);
        this.loaded=true;
    };
    this.setAll = function(objectColl) {
        this.typeStockage.setItem(this.cle,objectColl);
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
    var users=this.coll;
    users[newUser.email]=newUser;
    this.setAll(users);
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
        if (Connexion.isConnected() && espece!=null) {
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

