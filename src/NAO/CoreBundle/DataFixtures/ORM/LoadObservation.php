<?php
/**
 * Created by PhpStorm.
 * User: marcd
 * Date: 17/01/2017
 * Time: 22:31
 */

namespace NAO\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use NAO\CoreBundle\Entity\Observation;


/**
 * Permet de remplir la table Observation pour les tests
 * User: marcd
 * Date: 17/01/2017
 * Time: 22:32
 */
class LoadObservation implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $obs1 = new Observation();
        $obs1->setDateCreation(new \DateTime);
        $obs1->setLatitude(47.5);
        $obs1->setLongitude(1.35);
        $obs1->setOiseau("Strix Linnaeus, 1758");
        $obs1->setObservateur("particulier@hotmail.fr");
        $obs1->setStatut("toValidate");

        $obs2 = new Observation();
        $obs2->setDateCreation(new \DateTime);
        $obs2->setLatitude(49.5);
        $obs2->setLongitude(-1.35);
        $obs2->setOiseau("Bubo bubo (Linnaeus, 1758)");
        $obs2->setObservateur("particulier@hotmail.fr");
        $obs2->setStatut("inValidated");

        $obs3 = new Observation();
        $obs3->setDateCreation(new \DateTime);
        $obs3->setLatitude(-49.5);
        $obs3->setLongitude(1.35);
        $obs3->setOiseau("Pygoscelis adeliae (Hombron & Jacquinot, 1841)");
        $obs3->setObservateur("particulier@hotmail.fr");
        $obs3->setStatut("validated");

        //        Persist
        $manager->persist($obs1);
        $manager->persist($obs2);
        $manager->persist($obs3);

//        Mise en place dans la bdd
        $manager->flush();
    }
}