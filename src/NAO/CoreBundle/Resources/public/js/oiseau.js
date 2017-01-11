/**
 * Created by marcd on 09/01/2017.
 */
/* Définition de la classe Oiseau */
function Oiseau(id, ordre, famille, lb_nom, nom_complet, nom_complet_html, nom_vern, nom_vern_eng) {
    this.id=id;
    this.ordre=ordre;
    this.famille=famille;
    this.lb_nom=lb_nom;
    this.nom_complet=nom_complet;
    this.nom_complet_html=nom_complet_html;
    this.nom_vern=nom_vern;
    this.nom_vern_eng = nom_vern_eng;
    this.media=[];
    this.description=[];
}