<?php
/**
 * Created by PhpStorm.
 * User: Jérémie
 * Date: 11/01/2017
 * Time: 14:54
 */

namespace NAO\CoreBundle\Services;


use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use NAO\CoreBundle\Controller\ObservationController;
use NAO\CoreBundle\Entity\Observation;
use Symfony\Component\Config\Tests\Util\Validator;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\Validator\Validation;

class GestionSynchronisation
{
    private $formFactory;
    private $entityManager;
    private $validator;

    public function __construct(FormFactory $formFactory, EntityManager $entityManager, $validator)
    {
        $this->formFactory = $formFactory;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    public function gestionSynchronisationObservation($request)
    {
//        récupération des observations envoyées
        $observations = $request->request->get('observations');
//        Pour chaque observation
        foreach ($observations as $observation) {
//            Si l'observation existe déjà je l'ignore

            $dateTimeObservation = $observation['dateCreation'];
            $observationBdd = $this->entityManager->getRepository("NAOCoreBundle:Observation")->findByDateCreation($dateTimeObservation);
//            Si l'observation existe on la mets à jour
            if (isset($observationBdd[0]) && $observationBdd[0] != null) {
                $observationBdd[0]->setLastUpdate($observation['lastUpdate']);
                $observationBdd[0]->setStatut($observation['statut']);
                $observationBdd[0]->setValideur($observation['valideur']);
                if (!$this->entityManager->contains($observationBdd[0])) {
                    $this->entityManager->persist($observationBdd[0]);
                }
                continue;
            } else {
//                si elle n'existe pas alors je crée l'entité observation
                $observationEntitee = new Observation();
                $observationEntitee->setDateCreation($dateTimeObservation/1000);
                $observationEntitee->setLastUpdate($dateTimeObservation/1000);
                $observationEntitee->setLatitude($observation['latitude']);
                $observationEntitee->setLongitude($observation['longitude']);
                $observationEntitee->setOiseau($observation['oiseau']);
                $observationEntitee->setObservateur($observation['observateur']);
                $observationEntitee->setStatut($observation['statut']);
                $observationEntitee->setValideur($observation['valideur']);

//                ... et je la persist
                $this->entityManager->persist($observationEntitee);

            }

//            Je stocke tout dans la base de donnée
            $this->entityManager->flush();

        }
        return "true";
    }

    /**
     * @param $request
     * @return ArrayCollection
     */
    public function gestionSynchronisationObservationLocal($request)
    {
//        récupération des données de la requête
        $observationAEnvoyer = array();
        $collStatus = $request->request->get('status');
        // On récupère toutes les observations dont la date de dernier update est supérieure à la dernière date de mise à jour de la base Locale
        foreach ($collStatus as $status) {
            $observationASynchroniser = $this->entityManager->getRepository("NAOCoreBundle:Observation")->findByStatut($status);
            $observationAEnvoyer=array_merge($observationAEnvoyer, $observationASynchroniser);
        }
        return $observationAEnvoyer;
    }
}