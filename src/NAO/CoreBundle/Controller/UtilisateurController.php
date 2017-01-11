<?php

namespace NAO\CoreBundle\Controller;

use NAO\CoreBundle\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;
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
        $form = $this->get('nao_core.gestion_formulaire')->gestionFormulaireCreation($request);

        if ($form === "valide") {
            return new Response("valide");
        }

        return $this->render('@NAOCore/formulaire/creation.html.twig', array(
            'formulaireCreation' => $form->createView(),
        ));
    }

}
