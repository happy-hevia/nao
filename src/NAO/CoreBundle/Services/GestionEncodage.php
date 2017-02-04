<?php
/**
 * Created by PhpStorm.
 * User: marcd
 * Date: 20/01/2017
 * Time: 22:36
 */

namespace NAO\CoreBundle\Services;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class GestionEncodage
{
    private $encoders;
    private $normalizers;
    private $serializer;

    public function __construct()
    {
        $this->encoders = array(new JsonEncoder());
        $this->normalizers = array(new ObjectNormalizer());

        $this->serializer = new Serializer($this->normalizers, $this->encoders);
    }

    public function json($object)
    {
        $jsonContent = $this->serializer->serialize($object, 'json');
        return $jsonContent;
    }
}
