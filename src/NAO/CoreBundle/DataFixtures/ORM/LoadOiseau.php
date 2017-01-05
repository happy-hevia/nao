<?php

namespace NAO\CoreBundle\DataFixtures\ORM;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use NAO\CoreBundle\Entity\Oiseau;


/**
 * Created by PhpStorm.
 * User: marcd
 * Date: 05/01/2017
 * Time: 22:38
 */
class LoadOiseau implements FixtureInterface
{
    public function load(ObjectManager $manager) {
        // Charger les données à partir d'un fichier texte
        $fichierTaxref = fopen('C:\xampp\htdocs\nao\src\NAO\CoreBundle\DataFixtures\ORM\TAXREF_classe_AVES.txt','r');

        if ($fichierTaxref) {
            $titre = fgets($fichierTaxref,4096); // Lecture de la ligne de titre inutile
            while(($buffer = fgets($fichierTaxref,4096)) != false) {
                //$buffer contient une ligne
                // extraction des champs de valeur d'une espèce qui sont espacées par des tabulations uniquement
                $champsTaxRef = preg_split("/\t/",$buffer);


                $oiseau = new Oiseau();
                $oiseau->setOrdre($champsTaxRef[3]);
                $oiseau->setFamille($champsTaxRef[4]);
                $oiseau->setLbNom($champsTaxRef[12]);
                $oiseau->setNomComplet($champsTaxRef[14]);
                $oiseau->setNomCompletHtml($champsTaxRef[15]);
                $oiseau->setNomVern($champsTaxRef[17]);
                $oiseau->setNomVernEng($champsTaxRef[18]);

                $oiseau->setUsageKey("");

                $manager->persist($oiseau);
            }
            if (!feof($fichierTaxref)) {
                // échec fgets()
                echo "Erreur: fgets() a échoué\n";
            }
            fclose($fichierTaxref);
            $manager->flush();
        }
    }

}