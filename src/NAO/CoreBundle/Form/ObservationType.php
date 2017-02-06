<?php

namespace NAO\CoreBundle\Form;

use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\StringType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;

class ObservationType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
//        Je défini bien l'ensemble des attributs de validation pour les différents champs du formulaire
        $builder->setAttribute('data-parsley-validate', 'zef')
            ->add('imageFile', FileType::class, array('label' => 'Image :', 'attr' => array(
        'required' => false)))
            ->add('observateur', HiddenType::class)
            ->add('dateCreation', HiddenType::class)
            ->add('lastUpdate', HiddenType::class)
            ->add('oiseau', TextType::class, array('label' => 'Oiseau (*):', 'attr' => array(
                'required' => 'required',
                'placeholder' => 'Selectionner une espèce',
                'data-parsley-species' => ''
            )))
            ->add('latitude', NumberType::class, array('label' => 'Latitude (*):', 'attr' => array(
                'required' => 'required',
                'data-parsley-pattern' => '^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$',
                'data-parsley-error-message' => 'Les Coordonnées sont incorrects'
            )))
            ->add('longitude', NumberType::class, array('label' => 'Longitude (*):', 'attr' => array(
                'required' => 'required',
                'data-parsley-pattern' => '^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$',
                'data-parsley-error-message' => 'Les Coordonnées sont incorrects'
            )))
            ->add('submit', SubmitType::class, array('label' => 'Ajouter', 'attr' => array('class' => "btn btn-success")));
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'NAO\CoreBundle\Entity\Observation',
            'compound' => true));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'nao_corebundle_observation';
    }


}
