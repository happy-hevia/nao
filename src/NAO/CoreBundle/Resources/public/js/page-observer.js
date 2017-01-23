/**
 * Created by marcd on 17/01/2017.
 */
var normal = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
});

var map = L.map('mapid', {
    center: [46.935261, 2.779541],
    zoom: 5,
    layers: normal
});


oiseauStorage.loadAll();
activationDescriptionEspece();
fillTabObserver();
affichageInformationObservation();
gestionCarte();
gestionCheckboxAvalider();
gestionFormulaireTri();


$("#onglet_espece").click(function () {
    //On récupère le nom de l'espèce dans le span form-observation__espece
    var espece = $("#form-observation__espece").text();
    // On récupère l'image et on lui change le href et sa description alt
    $("#espece-image__").attr("src", oiseauStorage.getImage500300(espece)).attr("alt", espece).click(function () {
        // Sur click sur l'image et si la connexion est Ok on ouvre l'image source
        if (Connexion.isConnected()) {
            window.open(oiseauStorage.storeData[espece].image);
        }
    });
    // On met son nom et sa description
    $("#espece-nom__").text(espece);
    $("#espece-description__").html(oiseauStorage.storeData[espece].description);
});

/**
 * Rempli le tableau des observations sur la page Observer
 */
function fillTabObserver() {
    observationStorage.getAll();
    var observations = observationStorage.coll;

    var tableContent;
    for (var observation in observations) {
        var distance = "inconnu";
        tableContent = tableContent + "<tr class='ligne-observation' data-state='" + observations[observation].statut + "' data-oiseau='" +  cleanClassName(observations[observation].oiseau) + "' ><td data-id='" + observations[observation].id + "'>" + observations[observation].oiseau + " - " + observations[observation].observateur + "</td >" +
            "<td >" + observations[observation].latitude + ", " + observations[observation].longitude + "</td >" +
            "<td class='cellule-distance' data-latitude='" + observations[observation].latitude + "' data-longitude ='" + observations[observation].longitude + "'>" + distance + "</td ></tr>";
    }

    $('#emplacement__ligne').append(tableContent);

    var $table = $("#tableau-observation").stupidtable();
    var $th_to_sort = $table.find("thead th").eq(2);

    // j'actualise la distance entre l'observation et moi toute les 5 sec
    setInterval(function () {
        $('.cellule-distance').each(function () {
            // Si la localisation est possible, j'actualise la position du marqueur
            var distance;
            if (gpsCoords == null) {
                distance = "inconnu"
            } else {
                var distanceKM = Localisation.distance(gpsCoords.latitude, gpsCoords.longitude, $(this).data('latitude'), $(this).data('longitude'));
                distance = Math.round(distanceKM * 1000) + "m";
            }
            $(this).text(distance);
        });

        $th_to_sort.stupidsort('asc');
    }, 5000);


}

/**
 * Permet d'afficher la modal avec les informations de l'espèce quand l'internaute clique sur le nom de l'espèce
 */
function affichageInformationObservation() {
    $('#emplacement__ligne td:first-of-type').click(function () {
        //    On récupère les informations de l'observation
        observationStorage.getAll();
        var observations = observationStorage.coll;
        var observation = observationStorage.getById($(this).data('id'));

        //    On récupère la date de l'observation
        var dateObservation = new Date(observation.dateCreation);
        var moisTab = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var annee = dateObservation.getFullYear();
        var mois = moisTab[dateObservation.getMonth()];
        var jours = dateObservation.getDate();
        var dateFormatee = jours + " " + mois + " " + annee;

        //    On l'affiche dans la modal
        $('#form-observation__latitude').val(observation.latitude);
        $('#form-observation__longitude').val(observation.longitude);
        $('#form-observation__espece').text(observation.oiseau);
        $('#form-observation__date').text(dateFormatee);


        //    ouvre la modal information sur l'observation
        $('#modal-observation').modal('show');
    })
}


function gestionCarte() {
    // Importation des layouts et ajout du module layout


    var transport = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; Thunderforest.com. Data &copy; CC-BY-SA OpenStreetMap contributors',
        maxZoom: 18
    });

    var velo = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
        attribution: '&copy; Thunderforest.com. Data &copy; CC-BY-SA OpenStreetMap contributors',
        maxZoom: 18
    });

    mapLink =
        '<a href="http://www.esri.com/">Esri</a>';
    wholink =
        'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    var aerien = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; ' + mapLink + ', ' + wholink,
        maxZoom: 18
    });


    var baseMaps = {
        "transport": transport,
        "vélo": velo,
        "aerien": aerien,
        "normal": normal
    };


// Initialisation des layers

    L.control.layers(baseMaps).addTo(map);


    var positionActuelle = L.icon({
        iconUrl: 'http://localhost/nao/web/bundles/naocore/images/marker-bleue.png',
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    });

    afficheMarker();

//    affichage du marqueur pour la position actuelle

    //Je créée le marqueur à une position fictive sans l'ajouter à la carte
    var marker = L.marker([42, 42], {icon: positionActuelle});
    var markerInMap = false;
    setInterval(function () {
        // Si la localisation est possible, j'actualise la position du marqueur
        if (gpsCoords != null) {
            marker.setLatLng([gpsCoords.latitude, gpsCoords.longitude]).update();
        }

        // si le marqueur n'a pas été ajouté à la carte, je l'ajoute
        if (!markerInMap && gpsCoords != null) {
            marker.addTo(map);
            markerInMap = true;
        }

    }, 2000);


    // alert qui s'affiche lorsque j'appuie sur le bouton ajouter une observation et qui indique ce qui faut faire
    var alertAjout = '<div class="alert alert-info alert-dismissible fade in text-center" id="position-alert" role="alert" style="z-index: 1022;position: relative;top: 0;left: 0; padding: 26px 10px;""> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true" style="position : relative; left: -40px">×</span></button> <strong>Double clic</strong> sur la carte pour positionner l\'observation !</div>';


// ajoute une alert lors du clic sur le bouton et active le positionnement du lieu
    $('.bouton-ajouter-observation').click(function () {
        $('#mapid').append(alertAjout);


        map.once('dblclick', afficheModalAjout);

        // annule l'événement du double clic lors de la fermeture de l'alert
        $('#position-alert').on('closed.bs.alert', function () {
            map.off('dblclick', afficheModalAjout);
        })

    });
}

function onclick(observation) {
// Lors du clic sur le marcker j'affiche la popup avec les informations associés à l'observation
    //    On récupère la date de l'observation
    var dateObservation = new Date(observation.dateCreation);
    var moisTab = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var annee = dateObservation.getFullYear();
    var mois = moisTab[dateObservation.getMonth()];
    var jours = dateObservation.getDate();
    var dateFormatee = jours + " " + mois + " " + annee;

    //    On l'affiche dans la modal
    $('#form-observation__latitude').val(observation.latitude);
    $('#form-observation__longitude').val(observation.longitude);
    $('#form-observation__espece').text(observation.oiseau);
    $('#form-observation__date').text(dateFormatee);


    //    ouvre la modal information sur l'observation
    $('#modal-observation').modal('show');

}

function afficheMarker() {
    // Création des icones des markers

    var observationValide = L.icon({
        iconUrl: "http://localhost/nao/web/bundles/naocore/images/marker-vert.png",
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    });
    var observationAValider = L.icon({
        iconUrl: 'http://localhost/nao/web/bundles/naocore/images/marker-jaune.png',
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    });

// gestion des markers
    var markerArray = [];

    observationStorage.getAll();
    var observations = observationStorage.coll;

    var dataArray = [];
    for (var o in observations) {
        dataArray.push(observations[o]);
    }

    // cette fonction permet d'activer la fonctionnalité de closure pour chacun des listeners appele les bonnes informations de la modale
    dataArray.forEach(function (observation) {
        var marker;
        if (observation.statut == "toValidate") {
            marker = L.marker([observation.latitude, observation.longitude], {icon: observationAValider}).on('click', function () {
                onclick(observation);
            }).addTo(map);
            $(marker._icon).addClass(cleanClassName(observation.oiseau));
        } else if (observation.statut == "validated") {
            marker = L.marker([observation.latitude, observation.longitude], {icon: observationValide}).on('click', function () {
                onclick(observation);
            }).addTo(map);
            $(marker._icon).addClass(cleanClassName(observation.oiseau));
        }
        markerArray.push(marker);
    });
}


function afficheModalAjout(e) {

    $('#nao_corebundle_observation_latitude').val(e.latlng.lat);
    $('#nao_corebundle_observation_longitude').val(e.latlng.lng);
    $('#modal-addObservation').modal('show');

    // ferme l'alert
    $("#position-alert").alert('close');
}

function gestionCheckboxAvalider() {
    $('#checkbox-observation-a-valider').change(function () {
        if (!this.checked) {
            $('img[src="http://localhost/nao/web/bundles/naocore/images/marker-jaune.png"]').fadeOut('slow');
            $('.ligne-observation[data-state="toValidate"]').fadeOut('slow');
        } else {
            $('img[src="http://localhost/nao/web/bundles/naocore/images/marker-jaune.png"]').fadeIn('slow');
            $('.ligne-observation[data-state="toValidate"]').fadeIn('slow');
        }
    });
}

function gestionFormulaireTri() {
    $('#form-tri-observation').submit(function (e) {
        // j'annule le comportement par défaut
        e.preventDefault();

        var valeurChampEspece = $('#form-tri-observation__espece').val();

        if (valeurChampEspece == "") {
            $('.leaflet-marker-icon').fadeIn('slow');

            $('.ligne-observation').fadeIn('slow');
        } else {
            $('.leaflet-marker-icon').fadeOut('slow');
            $('.' + cleanClassName(valeurChampEspece)).fadeIn('slow');

            $('.ligne-observation').fadeOut('slow');
            $('.ligne-observation[data-oiseau="' + cleanClassName(valeurChampEspece) + '"]').fadeIn('slow');
        }

    })
}

function cleanClassName(className) {
    return className.replace(/[^A-Z0-9]/ig, "-");
}
