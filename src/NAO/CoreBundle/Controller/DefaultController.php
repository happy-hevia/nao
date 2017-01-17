<?php

namespace NAO\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="nao_accueil")
     */
    public function accueilAction() {
        return $this->render('@NAOCore/Default/index.html.twig');
    }

    /**
     * @Route("/observer", name="nao_observer")
     */
    public function observerAction() {
        return $this->render('NAOCoreBundle:Observer:observer.html.twig');
    }

    /**
     * @Route("/mes_observations", name="nao_mes_observations")
     */
    public function mesObservationsAction() {
        return $this->render('NAOCoreBundle:Observer:mesObservations.html.twig');
    }

    /**
     * @Route("/validations", name="nao_observations_a_valider")
     */
    public function validationsAction() {
        return $this->render('NAOCoreBundle:Observer:observationAValider.html.twig', array(
            "observations" => $this->getDoctrine()->getRepository("NAOCoreBundle:Observation")->findByStatut('toValidate'),

        ));
    }

    /**
     * @Route("/mon_compte", name="nao_mon_compte")
     */
    public function monComptesAction() {
        return $this->render('NAOCoreBundle:Utilisateur:monCompte.html.twig');
    }

    /**
     * @Route("/admin", name="nao_gestion_droits")
     */
    public function adminAction() {
        return $this->render('NAOCoreBundle:Utilisateur:gestionDroits.html.twig', array(
            "utilisateurs" => $this->getDoctrine()->getRepository("NAOCoreBundle:Utilisateur")->findAll(),

        ));
    }

    /**
     * @Route("/mentions_legales", name="nao_mentions_legales")
     */
    public function mentionsLegalesAction() {
        return $this->render('NAOCoreBundle:Divers:mentionsLegales.html.twig');
    }

    /**
     * @Route("/cgu", name="nao_cgu")
     */
    public function cguAction() {
        return $this->render('NAOCoreBundle:Divers:cgu.html.twig');
    }


    /**
     * @Route("/test_base")
     */
    public function indexAction() // Utilisé seulement pour tester la définition de base.html.twig
    {
        return $this->render('NAOCoreBundle:Default:index.html.twig');
    }


}
