/**
 Ce script permet de gérer les fonctionnalités spécifique à la page "Mon Compte"
 **/

rempliInformationCompte()

function rempliInformationCompte(){

// Je récupère l'utilisateur courant depuis la sessions storage
    currentUserStorage.getCurrentUser();
    var utilisateur = userStorage.coll[currentUserStorage.coll];

//    Je stocke les informations dans le DOM
    $('#date-inscription__data').text(utilisateur.date);
    $('#nom__data').text(utilisateur.nom);
    $('#prenom__data').text(utilisateur.prenom);
    $('#pseudo__data').text(utilisateur.pseudo);
    $('#email__data').text(utilisateur.email);

}
