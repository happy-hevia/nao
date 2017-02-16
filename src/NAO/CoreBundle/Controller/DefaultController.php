<?php

namespace NAO\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="nao_accueil")
     * @Route("/observer", name="nao_observer")
     * @param Request $request
     * @return Response|\Symfony\Component\HttpFoundation\Response
     */
    public function observerAction(Request $request)
    {
        $form = $this->get('nao_core.gestion_formulaire')->gestionFormulaireObservation($request);

        return $this->render('@NAOCore/Observer/observer.html.twig', array('tabForm' => $form));
    }

    /**
     * @Route("/mes_observations", name="nao_mes_observations")
     */
    public function mesObservationsAction()
    {
        return $this->render('NAOCoreBundle:Observer:mesObservations.html.twig');
    }

    /**
     * @Route("/validations", name="nao_observations_a_valider")
     */
    public function validationsAction()
    {
        return $this->render('NAOCoreBundle:Observer:observationAValider.html.twig', array("observations" => $this->getDoctrine()->getRepository("NAOCoreBundle:Observation")->findByStatut('toValidate'),

        ));
    }

    /**
     * @Route("/mon_compte", name="nao_mon_compte")
     */
    public function monComptesAction()
    {
        return $this->render('NAOCoreBundle:Utilisateur:monCompte.html.twig');
    }

    /**
     * @Route("/admin", name="nao_gestion_droits")
     */
    public function adminAction()
    {
        return $this->render('NAOCoreBundle:Utilisateur:gestionDroits.html.twig', array("utilisateurs" => $this->getDoctrine()->getRepository("NAOCoreBundle:Utilisateur")->findAll(),

        ));
    }

    /**
     * @Route("/mentions_legales", name="nao_mentions_legales")
     */
    public function mentionsLegalesAction()
    {
        return $this->render('NAOCoreBundle:Divers:mentionsLegales.html.twig');
    }

    /**
     * @Route("/cgu", name="nao_cgu")
     */
    public function cguAction()
    {
        return $this->render('NAOCoreBundle:Divers:cgu.html.twig');
    }



}
