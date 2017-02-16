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
        $message="";
        foreach ($observations as $observation) {
            $dateTimeObservation = $observation['dateCreation'];
            $observateur=$observation['observateur'];
            $observationBdd = $this->entityManager->getRepository("NAOCoreBundle:Observation")->findByDateCreationEtObservateur($dateTimeObservation,$observateur);
//            Si l'observation existe on la mets à jour
            if (isset($observationBdd[0]) && $observationBdd[0] != null) {
                $message+="Observation existante (".$observationBdd[0]->getId().")<br>";
                $observationBdd[0]->setLastUpdate($observation['lastUpdate']);
                $observationBdd[0]->setStatut($observation['statut']);
                $observationBdd[0]->setValideur($observation['valideur']);
                $this->entityManager->persist($observationBdd[0]);
            } else {
//                si elle n'existe pas alors je crée l'entité observation
                $message+="Observation inexistante (".$observation['oiseau'].")";
                $observationEntitee = new Observation();
                $observationEntitee->setDateCreation($dateTimeObservation);
                $observationEntitee->setLastUpdate($dateTimeObservation);
                $observationEntitee->setLatitude($observation['latitude']);
                $observationEntitee->setLongitude($observation['longitude']);
                $observationEntitee->setOiseau($observation['oiseau']);
                $observationEntitee->setObservateur($observateur);
                $observationEntitee->setStatut($observation['statut']);
                $observationEntitee->setValideur($observation['valideur']);

//                ... et je la persist
                $this->entityManager->persist($observationEntitee);
            }
        }
        //            Je stocke tout dans la base de donnée
        $this->entityManager->flush();
        return ["true",$message];
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