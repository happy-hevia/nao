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
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\Tests\Encoder\PasswordEncoder;

class GestionFormulaire
{
    private $formFactory;
    private $entityManager;
    private $utilisateur;
    private $mdpEncoder;
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

//            On encode le mot de passe
            $this->utilisateur->setMdp(md5($this->utilisateur->getMdp()));
            $this->utilisateur->setMdpConfirmation(md5($this->utilisateur->getMdpConfirmation()));

            $em = $this->entityManager;
            $em->persist($this->utilisateur);
            $em->flush($this->utilisateur);

            return "valide";
        }

        return $this->form;

    }

    /**
     * @param $request
     * @return string|\Symfony\Component\Form\FormInterface
     *
     * Permet de gérer la validation du formulaire de connexion en mode en ligne
     */
    public function gestionConnexion($request)
    {
//        récupère l'utilisateur concerné si il existe
        $utilisateur = $this->entityManager->getRepository("NAOCoreBundle:Utilisateur")->findByEmail($request->request->get("email"));
//        Si l'utilisateur exite
        if ($utilisateur[0] != null) {

//            récupère le mot de passe encodé du serveur
            $mdpServeur = $utilisateur[0]->getMdp();

//            Si les identifiant renseigné ne sont pas correct alors retourne false
            if (md5($request->request->get('mdp')) != $mdpServeur) {
                return "false";
            }
        } else{
//            Si l'utilisateur n'exite pas retourne false
            return "false";
        }

//        création de l'objet utilisateur pour le front
        $utilisateurJs = array(
            "valueList" => ["null", "particulier","naturaliste", "administrateur"],
        "nom" =>$utilisateur[0]->getNom(),
        "prenom"=>$utilisateur[0]->getPrenom(),
        "pseudo"=>$utilisateur[0]->getPseudo(),
        "email"=>$utilisateur[0]->getEmail(),
        "role"=>$utilisateur[0]->getDroit()
        );

//        Si les identifiants renseignés sont correct alors on retourne les informations de l'utilisateur
        return json_encode($utilisateurJs);

    }
}
