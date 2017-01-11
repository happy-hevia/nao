<?php
/**
 * Created by PhpStorm.
 * User: Jérémie
 * Date: 11/01/2017
 * Time: 14:54
 */

namespace NAO\CoreBundle\Services;


use Doctrine\ORM\EntityManager;
use NAO\CoreBundle\Entity\Utilisateur;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Response;

class GestionFormulaire
{
    private $formFactory;
    private $entityManager;
    private $utilisateur;
    private $form;

    public function __construct(FormFactory $formFactory, EntityManager $entityManager)
    {
        $this->formFactory = $formFactory;
        $this->entityManager = $entityManager;
        $this->utilisateur = new Utilisateur();

//        Création du formulaire de création
        $this->form = $this->formFactory->create('NAO\CoreBundle\Form\UtilisateurType', $this->utilisateur);
    }

    /**
     * Retourne le formulaire de création vide
     * Cette fonction est appelée depuis twig
     */
    public function creerFormulaireCreation()
    {
        return $this->form->createView();
    }

    /**
     * @param $request
     * @return string|\Symfony\Component\Form\FormInterface
     *
     * Permet de gérer la validation du formulaire de création
     * retourne "valide" si le formulaire est valide
     *          le formulaire avec les erreurs si il ne l'est pas
     */
    public function gestionFormulaireCreation($request)
    {
        $form = $request->request->get('request');
        $this->form->handleRequest($request);

        //        Gestion soumission formulaire
        if ($this->form->isSubmitted() && $this->form->isValid()) {

            $this->utilisateur->setDroit("particulier"); // définit l'utilisateur comme particulier
            $this->utilisateur->setDateCreation(new \DateTime()); // remplit la date de création à l'heure actuelle

            $em = $this->entityManager;
            $em->persist($this->utilisateur);
            $em->flush($this->utilisateur);

            return "valide";
        }

        return $this->form;

    }
}
