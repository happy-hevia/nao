/**
 * Created by marcd on 22/01/2017.
 */
$(function() {
    gestionMesObservations();
    affichageInformationObservation('td.observation_oiseau');
});

function gestionMesObservations() {
    // Je récupère l'utilisateur courant
    // email contenu dans currentUser
    var mesObservations = observationStorage.mesObservations();
    if (mesObservations!=false) {
        // On parcourt la liste et pour chaque item on ajoute une ligne dans le tableau
        for (var i=0; i<mesObservations.length; i++) {
            var ligneObservation="<tr>";
            ligneObservation+="<td class='observation_oiseau' data-id='"+mesObservations[i].id+"'>"+mesObservations[i].oiseau+"</td>";
            ligneObservation+="<td>"+mesObservations[i].latitude+"</td>";
            ligneObservation+="<td>"+mesObservations[i].longitude+"</td>";
            var date = new Date(mesObservations[i].dateCreation*1000);
            ligneObservation+="<td>"+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"</td>";
            switch (mesObservations[i].statut) {
                case "validated":
                    ligneObservation+="<td>Validée</td>";
                    break;
                case 'toValidate':
                    ligneObservation+="<td>En attente de Validation</td>";
                    break;
                case 'inValidated':
                    ligneObservation+="<td>Rejetée</td>";
                    break;
            }

            ligneObservation+="</tr>";
            $('#mesObservation_table__').append(ligneObservation);
        }


    }
}
