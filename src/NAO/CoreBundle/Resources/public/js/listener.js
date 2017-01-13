/**
 * Created by marcd on 13/01/2017.
 */
/**
 * Fonction : startListeners
 * Description :
 *      Lance les boucles de détection Localisation et connexion internet
 */
function Listeners() {} // Espace de nom

Listeners.start = function (){
    // La disponibilité de la localisation est testée toutes les 5 secondes
    Localisation.initListener();
    Connexion.initListener();
};