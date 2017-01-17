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

}
