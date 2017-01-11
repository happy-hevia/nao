<?php

namespace NAO\CoreBundle\Form;

use Symfony\Component\Form\Extension\Core\Type\StringType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UtilisateurType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
//        Je défini bien l'ensemble des attributs de validation pour les différents champs du formulaire

        $builder->setAttribute('data-parsley-validate', 'zef')
            ->add('prenom', TextType::class, array('label' => 'Prenom (*):', 'attr' => array(
                'required' => 'required',
                'minlength' => 2,
                'maxlength' => 26,
                'placeholder' => 'Prénom'
            )))
            ->add('nom', TextType::class, array('label' => 'Nom (*):', 'attr' => array(
                'required' => 'required',
                'minlength' => 2,
                'maxlength' => 26,
                'placeholder' => 'Nom'
            )))
            ->add('email', EmailType::class, array('label' => 'Adresse email (*):', 'attr' => array(
                'required' => 'required',
                'placeholder' => 'Adresse email'
            )))
            ->add('pseudo', TextType::class, array('label' => 'Pseudo (*):', 'attr' => array(
                'required' => 'required',
                'minlength' => 2,
                'maxlength' => 26,
                'placeholder' => 'Votre pseudo'
            )))
            ->add('mdp', PasswordType::class, array('label' => 'Mot de passe (*):', 'attr' => array(
                'required' => 'required',
                'minlength' => 2,
                'maxlength' => 26,
                'pattern' => "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,26}$",
                'data-parsley-error-message' => "Le mot de passe doit comporter au moins 8 caractères (1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial) .",
                'placeholder' => 'Mot de passe'
            )))
            ->add('mdpConfirmation', PasswordType::class, array('label' => 'Confirmation (*):', 'attr' => array(
                'required' => 'required',
                'minlength' => 8,
                'maxlength' => 26,
                'data-parsley-equalto' => "#nao_corebundle_utilisateur_mdp",
                'placeholder' => 'Confirmation'
    )))
            ->add('mentions', CheckboxType::class, array('label' => 'J\'accepte les conditions générales d\'utilisation du site', 'attr' => array(
                        'required' => 'required',
                )
                     ))
            ->add('submit', SubmitType::class, array('label' => 'créer'));
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array('data_class' => 'NAO\CoreBundle\Entity\Utilisateur'));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'nao_corebundle_utilisateur';
    }


}
