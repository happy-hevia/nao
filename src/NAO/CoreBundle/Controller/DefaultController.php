<?php

namespace NAO\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/test_base")
     */
    public function indexAction() // Utilisé seulement pour tester la définition de base.html.twig
    {
        return $this->render('NAOCoreBundle:Default:index.html.twig');
    }
}
