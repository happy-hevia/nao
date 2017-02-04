<?php

namespace NAO\CoreBundle\Entity;

use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Observation
 *
 * @ORM\Table(name="observation")
 * @ORM\Entity(repositoryClass="NAO\CoreBundle\Repository\ObservationRepository")
 * @ORM\HasLifecycleCallbacks()
 * @Vich\Uploadable
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
     * @ORM\Column(name="dateCreation", type="bigint")
     */
    private $dateCreation;

    /**
     * @var float
     *
     * @ORM\Column(name="latitude", type="float")
     * @Assert\NotBlank()
     * @Assert\Regex("/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/")
     */
    private $latitude;

    /**
     * @var float
     *
     * @ORM\Column(name="longitude", type="float")
     * @Assert\NotBlank()
     * @Assert\Regex("/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/")
     */
    private $longitude;

    /**
     * @var string
     *
     * @ORM\Column(name="oiseau", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $oiseau;

    /**
     * @var string
     *
     * @ORM\Column(name="observateur", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $observateur;

    /**
     * @var string
     *
     * @ORM\Column(name="valideur", type="string", length=255, nullable=true)
     */
    private $valideur;

    /**
     * @var string
     *
     * @ORM\Column(name="statut", type="string", length=255)
     */
    private $statut;

    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="observation_image", fileNameProperty="imageName")
     *
     * @var File
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @var string
     */
    private $imageName;

    /**
     * @ORM\Column(name="lastUpdate", type="bigint")
     */
    private $lastUpdate;

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
     *
     * @param $dateCreation
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
    public function getLastUpdate()
    {
        return $this->lastUpdate;
    }

    /**
     * Set dateCreation
     *
     * @param $dateUpdate
     * @return Observation
     */
    public function setLastUpdate($dateUpdate)
    {
        $this->lastUpdate = $dateUpdate;

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
     * @param float $latitude
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
     * @return float
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Set longitude
     *
     * @param float $longitude
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
     * @return float
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


    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the  update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File | \Symfony\Component\HttpFoundation\File\UploadedFile $image
     *
     * @return Observation
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

//        if ($image) {
//            // It is required that at least one field changes if you are using doctrine
//            // otherwise the event listeners won't be called and the file is lost
//            $this->dateCreation = new \DateTimeImmutable();
//        }

        return $this;
    }

    /**
     * @return File|null
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @param string $imageName
     *
     * @return Observation
     */
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getImageName()
    {
        return $this->imageName;
    }

    // CALLBACK
    /**
     * @ORM\PreUpdate
     */
    public function updateDate() {
        $this->setLastUpdate(time());
    }


}
