<?php

namespace NAO\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use NAO\CoreBundle\Entity\Oiseau;
use NAO\CoreBundle\Entity\Utilisateur;


/**
 * Permet de remplir la table Utilisateur pour les tests
 * User: marcd
 * Date: 05/01/2017
 * Time: 22:38
 */
class LoadUtilisateur implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
//        Création d'un particulier
        $particulier = new Utilisateur();
        $particulier->setPrenom("bob");
        $particulier->setNom("tesx");
        $particulier->setemail("particulier@hotmail.fr");
        $particulier->setMdp("particulier");
        $particulier->setDroit("particulier");

//        Création d'un naturaliste
        $naturaliste = new Utilisateur();
        $naturaliste->setPrenom("toto");
        $naturaliste->setNom("molox");
        $naturaliste->setemail("naturaliste@hotmail.fr");
        $naturaliste->setMdp("naturaliste");
        $naturaliste->setDroit("naturaliste");

//        Création d'un administrateur
        $administrateur = new Utilisateur();
        $administrateur->setPrenom("coco");
        $administrateur->setNom("asticot");
        $administrateur->setemail("administrateur@hotmail.fr");
        $administrateur->setMdp("administrateur");
        $administrateur->setDroit("administrateur");

//        Persist
        $manager->persist($particulier);
        $manager->persist($naturaliste);
        $manager->persist($administrateur);

//        Mise en place dans la bdd
        $manager->flush();
    }
}


