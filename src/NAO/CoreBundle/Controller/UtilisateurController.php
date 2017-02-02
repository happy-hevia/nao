<?php

namespace NAO\CoreBundle\Controller;

use NAO\CoreBundle\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Utilisateur controller.
 *
 * @Route("utilisateur")
 */
class UtilisateurController extends Controller
{

    /**
     * Créé un nouveau utilisateur
     * Retourne simplement le formulaire mis en page
     * ou "valide" si le formulaire est complet
     * Cette fonction est appelée depuis une requête ajax
     *
     * @Route("/nouveau", name="utilisateur_nouveau")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function nouveauAction(Request $request)
    {
        $data = $this->get('nao_core.gestion_formulaire')->gestionFormulaireCreation($request);

        if ($data instanceof Utilisateur) {
//                        On envoie l'email
            $message = \Swift_Message::newInstance()
                            ->setSubject("NAO : Confirmer votre adresse mail")
                            ->setFrom('naoconfirmation@gmail.com')
                            ->setTo($data->getEmail())
                            ->setBody($this->get('templating')->renderResponse('@NAOCore/mail/mail.html.twig', array('utilisateur' => $data ))->getContent(), 'text/html');

                        $this->get('mailer')->send($message);

            return new Response("valide");
        }

        return $this->render('@NAOCore/formulaire/creation.html.twig', array('formulaireCreation' => $data->createView()));
    }

    /**
     * Permet de connecter l'internaute
     *
     * @Route("/connexion", name="utilisateur_connexion")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function connexionAction(Request $request)
    {
        $form = $this->get('nao_core.gestion_formulaire')->gestionConnexion($request);

        return new Response($form);
    }
    /**
     * Permet de changer de mot de passe
     *
     * @Route("/modification", name="utilisateur_modification")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function modificationAction(Request $request)
    {
        $form = $this->get('nao_core.gestion_formulaire')->gestionModification($request);

        return new Response($form);
    }

    /**
     * Permet de changer les droits d'un utilisateur
     *
     * @Route("/change-droit", name="utilisateur_change_droit")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function droitAction(Request $request)
    {
        $success = $this->get('nao_core.gestion_formulaire')->gestionDroit($request);

        return new Response($success);
    }

    /**
     * Permet de récuperer un utilisateur particulier selon son adresse email
     *
     * @Route("/utilisateur-par-email", name="utilisateur_utilisateur_par_email")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function utilisateurParEmailAction(Request $request)
    {
        $user = $this->get('nao_core.gestion_formulaire')->utilisateurParEmail($request);

        return $this->render('@NAOCore/formulaire/ligneUtilisateur.html.twig', array('user' => $user));
    }

    /**
     * Permet de confirmer son mail depuis l'email de confirmation
     *
     * @Route("/confirmer-mail/{code}", defaults={"code" = "null"}, name="utilisateur_confirmer_email")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @param $code
     * @return Response
     */
    public function confirmerEmailAction(Request $request, $code = "")
    {
        $etat = $this->get('nao_core.gestion_formulaire')->confirmerMail( $code);

        return $this->render('@NAOCore/Divers/confirmationMail.html.twig', array('etat' => $etat));
    }

}
