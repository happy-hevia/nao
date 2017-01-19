<?php

namespace NAO\CoreBundle\Controller;

use NAO\CoreBundle\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Observation controller.
 *
 * @Route("observation")
 */
class ObservationController extends Controller
{

    /**
     * Permet d'ajouter une nouvelle observation
     *
     * @Route("/nouveau", name="observation_nouveau")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function nouveauAction(Request $request)
    {
        $form = $this->get('nao_core.gestion_formulaire')->gestionFormulaireObservation($request);

        if ($form === "valide") {
            return new Response("valide");
        }

        return $this->render('@NAOCore/formulaire/observation.html.twig', array('formulaireObservation' => $form->createView()));
    }
    /**
     * Permet de changer le statut d'une observation
     *
     * @Route("/change-statut", name="observation_change_statut")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function statutAction(Request $request)
    {
        $success = $this->get('nao_core.gestion_formulaire')->gestionStatut($request);
        return new Response($success);
    }

    /**
     * Permet d'ajouter une nouvelle observation
     *
     * @Route("/synchronisation", name="observation_synchronisation")
     * @Method({"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function synchronisationAction(Request $request)
    {
        $retour = $this->get('nao_core.gestion_synchronisation')->gestionSynchronisationObservation($request);

        return new Response($retour);
    }

}
