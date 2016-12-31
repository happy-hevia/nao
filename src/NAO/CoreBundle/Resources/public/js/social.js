/**
 * Created by marcd on 31/12/2016.
 */
var toggleSocial = function() {
    if ($('.body_social__buttons').is(':visible')) {
        $('.body_social__buttons').hide();
        $('.body_social__clips_chevron').each(function() {
            $(this).text(">");
        });
    } else {
        $('.body_social__buttons').show();
        $('.body_social__clips_chevron').each(function() {
            $(this).text("<");
        });
    }
};

var initSocialEvent = function() {
    // Initialisation des URL correspondantes à la page courante
    $('.body_social__buttons_btn').each(function() {
        var href = $(this).attr("href");
        $(this).attr("href",href+document.location.href);
    });
    // Définition Evènements
    $('.body_social__clips').click(function() {
        toggleSocial();
    });
    // Par défault on masque les boutons de partage
    toggleSocial();
}