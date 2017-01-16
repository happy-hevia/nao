<?php

namespace NAO\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Observation
 *
 * @ORM\Table(name="observation")
 * @ORM\Entity(repositoryClass="NAO\CoreBundle\Repository\ObservationRepository")
 */
class Observation
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
     * @var \DateTime
     *
     * @ORM\Column(name="dateCreation", type="datetime")
     */
    private $dateCreation;

    /**
     * @var int
     *
     * @ORM\Column(name="latitude", type="integer")
     */
    private $latitude;

    /**
     * @var int
     *
     * @ORM\Column(name="longitude", type="integer")
     */
    private $longitude;

    /**
     * @var string
     *
     * @ORM\Column(name="oiseau", type="string", length=255)
     */
    private $oiseau;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="observateur", type="object")
     */
    private $observateur;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="valideur", type="object", nullable=true)
     */
    private $valideur;

    /**
     * @var string
     *
     * @ORM\Column(name="statut", type="string", length=255)
     */
    private $statut;


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
     * Set dateCreation
     *
     * @param \DateTime $dateCreation
     *
     * @return Observation
     */
    public function setDateCreation($dateCreation)
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    /**
     * Get dateCreation
     *
     * @return \DateTime
     */
    public function getDateCreation()
    {
        return $this->dateCreation;
    }

    /**
     * Set latitude
     *
     * @param integer $latitude
     *
     * @return Observation
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return int
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Set longitude
     *
     * @param integer $longitude
     *
     * @return Observation
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * Get longitude
     *
     * @return int
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * Set oiseau
     *
     * @param string $oiseau
     *
     * @return Observation
     */
    public function setOiseau($oiseau)
    {
        $this->oiseau = $oiseau;

        return $this;
    }

    /**
     * Get oiseau
     *
     * @return string
     */
    public function getOiseau()
    {
        return $this->oiseau;
    }

    /**
     * Set observateur
     *
     * @param \stdClass $observateur
     *
     * @return Observation
     */
    public function setObservateur($observateur)
    {
        $this->observateur = $observateur;

        return $this;
    }

    /**
     * Get observateur
     *
     * @return \stdClass
     */
    public function getObservateur()
    {
        return $this->observateur;
    }

    /**
     * Set valideur
     *
     * @param \stdClass $valideur
     *
     * @return Observation
     */
    public function setValideur($valideur)
    {
        $this->valideur = $valideur;

        return $this;
    }

    /**
     * Get valideur
     *
     * @return \stdClass
     */
    public function getValideur()
    {
        return $this->valideur;
    }

    /**
     * Set statut
     *
     * @param string $statut
     *
     * @return Observation
     */
    public function setStatut($statut)
    {
        $this->statut = $statut;

        return $this;
    }

    /**
     * Get statut
     *
     * @return string
     */
    public function getStatut()
    {
        return $this->statut;
    }
}

