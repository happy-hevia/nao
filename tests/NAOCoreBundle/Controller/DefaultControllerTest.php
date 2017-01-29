<?php

namespace NAO\CoreBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    private $client;

    protected function setUp()
    {
        $client = static::createClient();
        $this->client = $client;
    }


    public function testObserver()
    {

        // accède à la page observer
        $crawler = $this->client->request('GET', '/');

        // succès
        $this->assertTrue($this->client->getResponse()->isSuccessful());


        //        Barre de menu
        $this->assertEquals(
            5,
            $crawler->filter('.navbar-nav > li')->count()
        );

        $this->assertEquals(
            5,
            $crawler->filter('.dropdown-menu > li')->count()
        );


//         Contenu principal

        $this->assertEquals(
            1,
            $crawler->filter('#form-tri-observation__espece')->count()
        );

        $this->assertEquals(
            1,
            $crawler->filter('#checkbox-observation-a-valider')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#mapid')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#btn-ajouter-observation')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#emplacement__ligne')->count()
        );



//        Modal

        $this->assertEquals(
            1,
            $crawler->filter('#modal-addObservation')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#modal-login')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#modal-sign-up')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#modal-observation')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#modal-description')->count()
        );

        //        lien footer fonctionne

        $link = $crawler->filter('#footer__cgu')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());

        $link = $crawler->filter('#footer__mentions')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());


    }


    public function testMesObservations()
    {

        // accède à la page observer
        $crawler = $this->client->request('GET', '/mes_observations');

        // succès
        $this->assertTrue($this->client->getResponse()->isSuccessful());


        //        Barre de menu
        $this->assertEquals(
            5,
            $crawler->filter('.navbar-nav > li')->count()
        );

        $this->assertEquals(
            5,
            $crawler->filter('.dropdown-menu > li')->count()
        );


//         Contenu principal

        $this->assertEquals(
            1,
            $crawler->filter('#mesObservation_table__')->count()
        );


        //        lien footer fonctionne

        $link = $crawler->filter('#footer__cgu')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());

        $link = $crawler->filter('#footer__mentions')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());


    }

    public function testObservationsAValider()
    {

        // accède à la page observer
        $crawler = $this->client->request('GET', '/validations');

        // succès
        $this->assertTrue($this->client->getResponse()->isSuccessful());


        //        Barre de menu
        $this->assertEquals(
            5,
            $crawler->filter('.navbar-nav > li')->count()
        );

        $this->assertEquals(
            5,
            $crawler->filter('.dropdown-menu > li')->count()
        );


//         Contenu principal

        $this->assertEquals(
            1,
            $crawler->filter('#observationsAValider_table__')->count()
        );


        //        lien footer fonctionne

        $link = $crawler->filter('#footer__cgu')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());

        $link = $crawler->filter('#footer__mentions')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());


    }

    public function testMonCompte()
    {

        // accède à la page observer
        $crawler = $this->client->request('GET', '/mon_compte');

        // succès
        $this->assertTrue($this->client->getResponse()->isSuccessful());


        //        Barre de menu
        $this->assertEquals(
            5,
            $crawler->filter('.navbar-nav > li')->count()
        );

        $this->assertEquals(
            5,
            $crawler->filter('.dropdown-menu > li')->count()
        );


//         Contenu principal

        $this->assertEquals(
            1,
            $crawler->filter('#date-inscription__data')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#nom__data')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#prenom__data')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#email__data')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#pseudo__data')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#form-change')->count()
        );


        //        lien footer fonctionne

        $link = $crawler->filter('#footer__cgu')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());

        $link = $crawler->filter('#footer__mentions')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());


    }

    public function testAdmin()
    {

        // accède à la page observer
        $crawler = $this->client->request('GET', '/admin');

        // succès
        $this->assertTrue($this->client->getResponse()->isSuccessful());


        //        Barre de menu
        $this->assertEquals(
            5,
            $crawler->filter('.navbar-nav > li')->count()
        );

        $this->assertEquals(
            5,
            $crawler->filter('.dropdown-menu > li')->count()
        );


//         Contenu principal

        $this->assertEquals(
            1,
            $crawler->filter('#form-recherche-utilisateur__email')->count()
        );
        $this->assertEquals(
            1,
            $crawler->filter('#emplacement__recherche-utilisateur')->count()
        );


        //        lien footer fonctionne

        $link = $crawler->filter('#footer__cgu')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());

        $link = $crawler->filter('#footer__mentions')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());


    }

    public function testConfirmerMail()
    {

        // accède à la page observer
        $crawler = $this->client->request('GET', '/utilisateur/confirmer-mail/jazfeiofjazeo');

        // succès
        $this->assertTrue($this->client->getResponse()->isSuccessful());


        //        Barre de menu
        $this->assertEquals(
            5,
            $crawler->filter('.navbar-nav > li')->count()
        );

        $this->assertEquals(
            5,
            $crawler->filter('.dropdown-menu > li')->count()
        );


//         Contenu principal

        $this->assertEquals(
            1,
            $crawler->filter('.alert-danger')->count()
        );


        //        lien footer fonctionne

        $link = $crawler->filter('#footer__cgu')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());

        $link = $crawler->filter('#footer__mentions')->link();
        $crawler = $this->client->click($link);
        $this->assertTrue($this->client->getResponse()->isSuccessful());


    }
}
