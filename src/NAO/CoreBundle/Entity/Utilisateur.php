<?php

namespace NAO\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * Utilisateur
 *
 * @ORM\Table(name="utilisateur")
 * @ORM\Entity(repositoryClass="NAO\CoreBundle\Repository\UtilisateurRepository")
 * @UniqueEntity("email", message="Il existe déjà un compte pour cet email !")
 */
class Utilisateur
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="prenom", type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 26
     * )
     */
    private $prenom;

    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 26
     * )
     */
    private $nom;

    /**
     * @var string
     *
     * @ORM\Column(name="pseudo", type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 26
     * )
     */
    private $pseudo;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255, unique=true)
     * @Assert\NotBlank()
     * @Assert\Email()
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(name="droit", type="string", length=255)
     */
    private $droit;

    /**
     * @var string
     *
     * @ORM\Column(name="mdp", type="text")
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 8,
     *      max = 26
     * )
     * @Assert\Regex("/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,26}$/")
     */
    private $mdp;

    /**
     * @var string
     *
     * @ORM\Column(name="mdpConfirmation", type="text")
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 26
     * )
     */
    private $mdpConfirmation;

    /**
     * @var boolean
     *
     * @ORM\Column(name="mentions", type="boolean")
     * @Assert\IsTrue()
     */
    private $mentions;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_creation", type="datetime")
     */
    private $date_creation;

    /**
     * @var string
     *
     * @ORM\Column(name="mail_code", type="string", length=255)
     */
    private $mailCode;

    /**
     * @var boolean
     *
     * @ORM\Column(name="email_valide", type="boolean", length=255)
     */
    private $emailValide;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set prenom
     *
     * @param string $prenom
     *
     * @return Utilisateur
     */
    public function setPrenom($prenom)
    {
        $this->prenom = $prenom;

        return $this;
    }

    /**
     * Get prenom
     *
     * @return string
     */
    public function getPrenom()
    {
        return $this->prenom;
    }

    /**
     * Set nom
     *
     * @param string $nom
     *
     * @return Utilisateur
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return Utilisateur
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set droit
     *
     * @param string $droit
     *
     * @return Utilisateur
     */
    public function setDroit($droit)
    {
        $this->droit = $droit;

        return $this;
    }

    /**
     * Get droit
     *
     * @return string
     */
    public function getDroit()
    {
        return $this->droit;
    }

    /**
     * Set mdp
     *
     * @param string $mdp
     *
     * @return Utilisateur
     */
    public function setMdp($mdp)
    {
        $this->mdp = $mdp;

        return $this;
    }

    /**
     * Get mdp
     *
     * @return string
     */
    public function getMdp()
    {
        return $this->mdp;
    }

    /**
     * Set mdpConfirmation
     *
     * @param string $mdpConfirmation
     *
     * @return Utilisateur
     */
    public function setMdpConfirmation($mdpConfirmation)
    {
        $this->mdpConfirmation = $mdpConfirmation;

        return $this;
    }

    /**
     * Get mdpConfirmation
     *
     * @return string
     */
    public function getMdpConfirmation()
    {
        return $this->mdpConfirmation;
    }

    /**
     * Set dateCreation
     *
     * @param \DateTime $dateCreation
     *
     * @return Utilisateur
     */
    public function setDateCreation($dateCreation)
    {
        $this->date_creation = $dateCreation;

        return $this;
    }

    /**
     * Get dateCreation
     *
     * @return \DateTime
     */
    public function getDateCreation()
    {
        return $this->date_creation;
    }

    /**
     * Set pseudo
     *
     * @param string $pseudo
     *
     * @return Utilisateur
     */
    public function setPseudo($pseudo)
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    /**
     * Get pseudo
     *
     * @return string
     */
    public function getPseudo()
    {
        return $this->pseudo;
    }

    /**
     * Set mentions
     *
     * @param boolean $mentions
     *
     * @return Utilisateur
     */
    public function setMentions($mentions)
    {
        $this->mentions = $mentions;

        return $this;
    }

    /**
     * Get mentions
     *
     * @return boolean
     */
    public function getMentions()
    {
        return $this->mentions;
    }

    /**
     * Set mailCode
     *
     * @param string $mailCode
     *
     * @return Utilisateur
     */
    public function setMailCode($mailCode)
    {
        $this->mailCode = $mailCode;

        return $this;
    }

    /**
     * Get mailCode
     *
     * @return string
     */
    public function getMailCode()
    {
        return $this->mailCode;
    }

    /**
     * Set emailValide
     *
     * @param boolean $emailValide
     *
     * @return Utilisateur
     */
    public function setEmailValide($emailValide)
    {
        $this->emailValide = $emailValide;

        return $this;
    }

    /**
     * Get emailValide
     *
     * @return boolean
     */
    public function getEmailValide()
    {
        return $this->emailValide;
    }
}
