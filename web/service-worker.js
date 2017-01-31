/**
 * Created by marcd on 31/01/2017.
 */
var CACHE_NAME = 'my-cache-v1';
this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                'observer',
                '',
                'mes_observations',
                'mon_compte',
                'mentions_legales',
                'cgu',
                'validations',
                'bundles/naocore/css/bootstrap.min.css',
                'bundles/naocore/css/awesomplete.css',
                'bundles/naocore/css/styles.css',
                'bundles/naocore/css/parsley.css',
                'bundles/naocore/file/test.json',
                'bundles/naocore/js/jquery.min.js',
                'bundles/naocore/js/bootstrap.min.js',
                'bundles/naocore/js/offline-js.js',
                'bundles/naocore/js/social.js',
                'bundles/naocore/js/bdd.js',
                'bundles/naocore/js/observations.js',
                'bundles/naocore/js/oiseau.js',
                'bundles/naocore/js/user.js',
                'bundles/naocore/js/main.js',
                'bundles/naocore/js/parsley.js',
                'bundles/naocore/js/parsley-fr.js',
                'bundles/naocore/js/gestionFormulaire.js',
                'bundles/naocore/js/listener.js',
                'bundles/naocore/js/page-compte.js',
                'bundles/naocore/js/page-mesObservations.js',
                'bundles/naocore/js/page-observer.js',
                'bundles/naocore/js/page-validation.js',
                'bundles/naocore/js/awesomplete.min.js',
                'bundles/naocore/js/connexion.js',
                'bundles/naocore/js/gps.js',
                'bundles/naocore/js/stupidtable.min.js',
                'bundles/naocore/images/v3.png',
                'bundles/naocore/images/v3-500.png',
                'bundles/naocore/images/internet_ok.png',
                'bundles/naocore/images/internet_ko.png',
                'bundles/naocore/images/sync_ok.png',
                'bundles/naocore/images/sync_ec.png',
                'bundles/naocore/images/sync_ko.png',
                'bundles/naocore/images/sync_todo.png',
                'bundles/naocore/images/facebook.png',
                'bundles/naocore/images/linkedin.png',
                'bundles/naocore/images/twitter.png',
                'bundles/naocore/images/google_plus.png',
                'bundles/naocore/fonts/glyphicons-halflings-regular.woff2',
                'bundles/naocore/fonts/glyphicons-halflings-regular.woff',
                'bundles/naocore/fonts/glyphicons-halflings-regular.ttf'
            ]);
        })
    );
});



this.addEventListener('fetch',function (event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
        );
});