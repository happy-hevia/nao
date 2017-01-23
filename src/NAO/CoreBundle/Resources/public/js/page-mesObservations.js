/**
 * Created by marcd on 22/01/2017.
 */
$(function() {
    gestionMesObservations();
});

function gestionMesObservations() {
    // Je récupère l'utilisateur courant
    // email contenu dans currentUser
    var mesObservations = observationStorage.mesObservations();
    if (mesObservations!=false) {
        // On parcourt la liste et pour chaque item on ajoute une ligne dans le tableau
        for (var i=0; i<mesObservations.length; i++) {
            var ligneObservation="<tr>";
            ligneObservation+="<td>"+mesObservations[i].oiseau+"</td>";
            ligneObservation+="<td>"+mesObservations[i].latitude+"</td>";
            ligneObservation+="<td>"+mesObservations[i].longitude+"</td>";
            console.log(mesObservations[i].dateCreation.timestamp);
            var date = new Date(mesObservations[i].dateCreation.timestamp*1000);
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
            //console.log(ligneObservation);
            $('#mesObservation_table__').append(ligneObservation);
        }


    }
}