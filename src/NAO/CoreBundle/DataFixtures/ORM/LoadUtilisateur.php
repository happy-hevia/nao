<?php

namespace NAO\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
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
        $particulier->setMdp(md5("particulier"));
        $particulier->setMdpConfirmation(md5("particulier"));
        $particulier->setDroit("particulier");
        $particulier->setMentions(true);
        $particulier->setPseudo("Boby");
        $particulier->setDateCreation(new \DateTime());

//        Création d'un naturaliste
        $naturaliste = new Utilisateur();
        $naturaliste->setPrenom("toto");
        $naturaliste->setNom("molox");
        $naturaliste->setemail("naturaliste@hotmail.fr");
        $naturaliste->setMdp(md5("naturaliste"));
        $naturaliste->setMdpConfirmation(md5("naturaliste"));
        $naturaliste->setDroit("naturaliste");
        $naturaliste->setMentions(true);
        $naturaliste->setPseudo("Totoff");
        $naturaliste->setDateCreation(new \DateTime());

//        Création d'un administrateur
        $administrateur = new Utilisateur();
        $administrateur->setPrenom("coco");
        $administrateur->setNom("asticot");
        $administrateur->setemail("administrateur@hotmail.fr");
        $administrateur->setMdp(md5("administrateur"));
        $administrateur->setMdpConfirmation(md5("administrateur"));
        $administrateur->setDroit("administrateur");
        $administrateur->setMentions(true);
        $administrateur->setPseudo("Cocotte");
        $administrateur->setDateCreation(new \DateTime());

//        Persist
        $manager->persist($particulier);
        $manager->persist($naturaliste);
        $manager->persist($administrateur);

//        Mise en place dans la bdd
        $manager->flush();
    }
}


