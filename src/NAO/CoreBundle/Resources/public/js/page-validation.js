/**
 * Created by marcd on 17/01/2017.
 */
oiseauStorage.loadAll();
$(function() {
    //activationDescriptionEspece();
    loadObservationsAValider();
    gestionPageValidation();
    affichageInformationObservation('td.observation_oiseau');
});
function loadObservationsAValider() {
    // Je récupère l'utilisateur courant
    // email contenu dans currentUser
    var observationsAValider = observationStorage.observationsAValider();
    if (observationsAValider!=false) {
        // On parcourt la liste et pour chaque item on ajoute une ligne dans le tableau
        for (var i=0; i<observationsAValider.length; i++) {
            var ligneObservation="<tr>";
            ligneObservation+="<td class='observation_oiseau' data-id='"+observationsAValider[i].id+"'>"+observationsAValider[i].oiseau+"</td>";
            ligneObservation+="<td>"+observationsAValider[i].latitude+"</td>";
            ligneObservation+="<td>"+observationsAValider[i].longitude+"</td>";
            var date = new Date(observationsAValider[i].dateCreation*1000);
            ligneObservation+="<td>"+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"</td>";
            ligneObservation+="<td>";
            ligneObservation+="<form action='"+pathValidationObservation+"' method='post' >";
            ligneObservation+="<select name='form-observation__select-statut' class='form-observation__select-statut' data-id='"+observationsAValider[i].id+"' data-action='"+pathValidationObservation+"' data-method='post' >";
            ligneObservation+="<option value='toValidate' >A valider</option >";
            ligneObservation+="<option value='validated' >Valider</option >";
            ligneObservation+="<option value='inValidated' >Invalider</option >";
            ligneObservation+="</select >";
            ligneObservation+="</form >";
            ligneObservation+="</td>";
            ligneObservation+="</tr>";
            $('#observationsAValider_table__').append(ligneObservation);
        }


    }
}



