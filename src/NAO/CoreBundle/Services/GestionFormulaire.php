<?php
/**
 * Created by PhpStorm.
 * User: Jérémie
 * Date: 11/01/2017
 * Time: 14:54
 */

namespace NAO\CoreBundle\Services;


use Doctrine\ORM\EntityManager;
use NAO\CoreBundle\Entity\Observation;
use NAO\CoreBundle\Entity\Utilisateur;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Config\Tests\Util\Validator;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\Tests\Encoder\PasswordEncoder;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Validation;

class GestionFormulaire
{
    private $formFactory;
    private $entityManager;
    private $validator;
    private $utilisateur;
    private $observation;
    private $formUtilisateur;
    private $formObservation;
    private $mailer;
    private $secret;

    public function __construct(FormFactory $formFactory, EntityManager $entityManager, $validator, \Swift_Mailer $mailer, $secret)
    {
        $this->formFactory = $formFactory;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->mailer = $mailer;
        $this->secret = $secret;

        $this->utilisateur = new Utilisateur();
        $this->observation = new Observation();

        // Création du formulaire de création d'utilisateur
        $this->formUtilisateur = $this->formFactory->create('NAO\CoreBundle\Form\UtilisateurType', $this->utilisateur);

        // Création du formulaire de création d'observation
        $this->formObservation = $this->formFactory->create('NAO\CoreBundle\Form\ObservationType', $this->observation);
    }

    /**
     * Retourne le formulaire de création vide
     * Cette fonction est appelée depuis twig
     */
    public function creerFormulaireCreation()
    {
        return $this->formUtilisateur->createView();
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
        $this->formUtilisateur->handleRequest($request);

        //        Gestion soumission formulaire
        if ($this->formUtilisateur->isSubmitted() && $this->formUtilisateur->isValid()) {

            $this->utilisateur->setDroit("particulier"); // définit l'utilisateur comme particulier
            $this->utilisateur->setDateCreation(new \DateTime()); // remplit la date de création à l'heure actuelle

//            On crée le code pour la confirmation par mail
            $this->utilisateur->setMailCode(md5($this->utilisateur->getEmail()));
            $this->utilisateur->setEmailValide(false);


//            On encode le mot de passe
            $this->utilisateur->setMdp(md5($this->utilisateur->getMdp()));
            $this->utilisateur->setMdpConfirmation(md5($this->utilisateur->getMdpConfirmation()));

            $em = $this->entityManager;
            $em->persist($this->utilisateur);
            $em->flush($this->utilisateur);

            return $this->utilisateur;
        }

        return $this->formUtilisateur;

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
        if (isset($utilisateur[0]) && $utilisateur[0] != null) {

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

//        Si le compte n'a pas été validé, on retourne false
        if (!$utilisateur[0]->getEmailValide()){
            return "false";
        }

//        création de l'objet utilisateur pour le front
        $utilisateurJs = array(
            "valueList" => ["null", "particulier","naturaliste", "administrateur"],
            "date" => $utilisateur[0]->getDateCreation()->format('d/m/Y'),
            "nom" =>$utilisateur[0]->getNom(),
            "prenom"=>$utilisateur[0]->getPrenom(),
            "pseudo"=>$utilisateur[0]->getPseudo(),
            "email"=>$utilisateur[0]->getEmail(),
            "role"=>$utilisateur[0]->getDroit(),
            "clef"=>md5($utilisateur[0]->getEmail() . $this->secret .  $utilisateur[0]->getDroit())
        );

//        Si les identifiants renseignés sont correct alors on retourne les informations de l'utilisateur
        return json_encode($utilisateurJs);

    }

    /**
     * @param $request
     *
     * Permet de gérer la soumission du formulaire de modification de mot de passe dans la page "Mon Compte"
     */
    public function gestionModification($request)
    {
        //        récupère l'utilisateur concerné si il existe
        $utilisateur = $this->entityManager->getRepository("NAOCoreBundle:Utilisateur")->findByEmail($request->request->get("email"));
        //        Si l'utilisateur exite
        if (isset($utilisateur[0]) && $utilisateur[0] != null) {

            //            récupère le mot de passe encodé du serveur
            $mdpServeur = $utilisateur[0]->getMdp();

            //            Si les identifiant renseigné ne sont pas correct alors retourne false
            if (md5($request->request->get('mdpancien')) != $mdpServeur) {
                return "false";
            }
        } else{
            //            Si l'utilisateur n'exite pas retourne false
            return "false";
        }
//        Si les identifiants sont correct on continue

//        Si le nouveau mot de passe ne rempli pas les contraintes, on renvoie le message d'erreur
      $validator = Validation::createValidator();
        $violations = $validator->validate($request->request->get('mdpnouveau'), array(
            new Regex(array("pattern" => "/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,26}$/", "message" => "Le mot de passe doit être composé de 8 à 26 caractères (au moins 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial)."))
        ));

        if (0 !== count($violations)) {
            foreach ($violations as $violation) {
                return $violation->getMessage();
            }
        }


//        On modifie les nouveaux identifiant
        $utilisateur[0]->setMdp(md5($request->request->get('mdpnouveau')));
        $utilisateur[0]->setMdpConfirmation(md5($request->request->get('mdpnouveau')));

//        On enregistre dans la bdd
        $this->entityManager->persist($utilisateur[0]);
        $this->entityManager->flush();

        return "true";



    }

    /**
     * @param $request
     * @return String
     * Permet de gérer la soumission du formulaire de modification de droit dans la page "Gestion des droits"
     */
    public function gestionDroit($request)
    {
        $modificateur = $request->request->get("modificateur");

//        Si la clef de vérification n'est pas bonne (si l'utilisateur ment sur son rôle) alors on annule la modification
        if (md5($modificateur['email'] . $this->secret . "administrateur" ) !==  $modificateur['clef'] ){
            return "false";
        }

        //        récupère l'utilisateur concerné
        $utilisateur = $this->entityManager->getRepository("NAOCoreBundle:Utilisateur")->findByEmail($request->request->get("email"));

//        L'utilisateur ne peux pas modifier son propre droit
        if ($utilisateur[0]->getEmail() == $modificateur['email']) {
            return "false";
        }

        //        On modifie les droits
        $utilisateur[0]->setDroit($request->request->get('nouveaudroit'));

        //        On enregistre dans la bdd
        $this->entityManager->persist($utilisateur[0]);
        $this->entityManager->flush();

        return "true";
    }

    /**
     * @param $request
     * @return Utilisateur
     * Permet de récuperer un utilisateur en renseignant son adresse email
     */
    public function utilisateurParEmail($request)
    {
        //        récupère l'utilisateur concerné si il existe
        $utilisateur = $this->entityManager->getRepository("NAOCoreBundle:Utilisateur")->findByEmail($request->request->get("email"));

        //        Si l'utilisateur n'existe pas on retourne false
        if (!isset($utilisateur[0]) || $utilisateur[0] == null) {
            return null;
        }

//        Sinon on retourne l'utilisateur
        return $utilisateur[0];

    }

    /**
     * Retourne le formulaire de création vide
     * Cette fonction est appelée depuis twig
     */
    public function creerFormulaireObservation()
    {
        return $this->formObservation->createView();
    }

    /**
     * @param $request
     * @return Array
     * Permet de gérer le formulaire d'ajout d'une observation
     */
    public function gestionFormulaireObservation($request)
    {

        $this->formObservation->handleRequest($request);

        //        Gestion soumission formulaire
        if ($this->formObservation->isSubmitted() && $this->formObservation->isValid()) {

            $this->observation->setStatut("toValidate"); // définit l'observation comme à valider
            $this->observation->setDateCreation(new \DateTime()); // remplit la date de création à la date actuelle
            $this->observation->setValideur(null);
            $this->observation->setlastUpdate(new \DateTime()); // initie lastUpdate à la date actuelle

            $em = $this->entityManager;
            $em->persist($this->observation);
            $em->flush($this->observation);

            $this->observation = new Observation();
            // Création du formulaire de création d'observation
            $this->formObservation = $this->formFactory->create('NAO\CoreBundle\Form\ObservationType', $this->observation);

            return array("validated", $this->formObservation->createView());
        } else {
            return array("toValidate", $this->formObservation->createView());
        }
    }

    /**
     * @param $request
     * @return String
     * Permet de gérer la soumission du formulaire de modification des statuts dans la page "Observations à valider"
     */
    public function gestionStatut($request)
    {
        //        récupère l'observation concernée
        $observation = $this->entityManager->getRepository("NAOCoreBundle:Observation")->findById($request->request->get("id"));

        //        On modifie le statut
        $observation[0]->setStatut($request->request->get('nouveaustatut'));
        //        On modifie l'email du valideur
        $observation[0]->setValideur($request->request->get('valideur'));

        //        On enregistre dans la bdd
        $this->entityManager->persist($observation[0]);
        $this->entityManager->flush();

        return "true";
    }

    /**
     * @param $code
     *
     * Permet de vérifier que l'email renseigné lors du formulaire d'inscription est correct
     * @return bool
     */
    public function confirmerMail( $code)
    {
        //        récupère l'utilisateur concernée
        $utilisateur = $this->entityManager->getRepository("NAOCoreBundle:Utilisateur")->findByMailCode($code);

        //        Si l'utilisateur exite
        if (isset($utilisateur[0]) && $utilisateur[0] != null) {
            //        On modifie le statut
            $utilisateur[0]->setEmailValide(true);

            //        On enregistre dans la bdd
            $this->entityManager->persist($utilisateur[0]);
            $this->entityManager->flush();

            return true;

        } else{
            //            Si l'utilisateur n'exite pas retourne false
            return false;
        }
    }
}
