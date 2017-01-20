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
            $dateTimeObservation = new \DateTime();
            $dateTimeObservation = $dateTimeObservation->setTimestamp($observation['date'] / 1000);
            $utilisateur = $this->entityManager->getRepository("NAOCoreBundle:Observation")->findByDateCreation($dateTimeObservation);
//            Si l'observation existe on ignore
            if (isset($utilisateur[0]) && $utilisateur[0] != null) {
                continue;
            } else {
//                si elle n'existe pas alors je crée l'entité observation
                $observationEntitee = new Observation();
                $observationEntitee->setDateCreation($dateTimeObservation);
                $observationEntitee->setLatitude($observation['latitude']);
                $observationEntitee->setLongitude($observation['longitude']);
                $observationEntitee->setOiseau($observation['oiseauId']);
                $observationEntitee->setObservateur($observation['observateur']);
                $observationEntitee->setStatut($observation['state']);
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
//        récupération des observations envoyées
        $lastLocalUpdate = $request->request->get('lastUpdate');
        // On récupère toutes les observations dont la date de dernier update est supérieure à la dernière date de mise à jour de la base Locale
        $observationASynchroniser = $this->entityManager->getRepository("NAOCoreBundle:Observation")->getAllObservationsUpdatedAfterDate($lastLocalUpdate);

        return $observationASynchroniser;
    }

}
