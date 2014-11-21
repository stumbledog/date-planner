Map = function (id) {
    var map, cMarker, businessList = [], selectedBusiness, currentPath;
    var plan = new Planner();

    var categories = {};
    categories.cutlery = ["puertorican", "tours", "buffets", "cheesesteaks", "restaurants", "colombian", "cajun", "tapasmallplates", "german", "soulfood", "food_court", "spanish", "salad", "vietnamese", "ukrainian", "venezuelan", "irish", "portuguese", "persian", "mideastern", "tex-mex", "argentine", "steak", "gluten_free", "tapas", "gourmet", "cambodian", "indpak", "brazilian", "delis", "sushi", "chinese", "asianfusion", "belgian", "greek", "indpark", "cuban", "mexican", "ramen", "foodstands", "french", "sandwiches", "newamerican", "italian", "peruvian", "burgers", "dominican", "japanese", "pizza", "korean", "thai", "latin", "mediterranean", "gastropubs", "tradamerican", "diners", "bbq", "turkish", "seafood"];
    categories.glass = ["bars", "wine_bars", "lounges", "cocktailbars"];
    categories.coffee = ["bakeries", "coffee", "bagels", "cafes", "breakfast_brunch", "desserts", "vegan", "soup"];
    categories.truck = ["streetvendors", "halal", "foodtrucks"];
    categories.beer = ["pubs"];

    init();
    function init() {
        map = new L.Map(id, {zoomControl: false}).setView([40.75831, -73.99151], 17);
        new L.TileLayer(
                'http://{s}.tiles.mapbox.com/v3/osmbuildings.gm744p3p/{z}/{x}/{y}.png',
                {attribution: 'Map tiles &copy; <a href="http://mapbox.com">MapBox</a>', maxNativeZoom: 19, maxZoom: 21}
        ).addTo(map);

        /*
         var osmb = new OSMBuildings(map)
         .date(new Date(2014, 5, 15, 17, 30))
         .load();
         L.control.layers({}, {Buildings: osmb}).addTo(map);
         */
        addCurrentLocationMarker();
        initControl();
        initEventListener();
    }

    function initControl() {
        createSearchBox();
        createSearchResult();
        createTimeLine();
    }

    function createTimeLine() {
        var timeLine = L.control({position: 'bottomleft'});
        timeLine.onAdd = function () {
            this._div = L.DomUtil.create('div', 'timeline');
            var html = plan.getTimeLine();
            this._div.innerHTML = html;
            $(this._div).hover(function () {
                map.scrollWheelZoom.disable();
                map.dragging.disable();
                map.doubleClickZoom.disable();
            }, function () {
                map.scrollWheelZoom.enable();
                map.dragging.enable();
                map.doubleClickZoom.enable();
            });
            return this._div;
        };


        timeLine.addTo(map);
    }

    function createSearchBox() {
        var searchBox = L.control({position: 'topleft'});
        searchBox.onAdd = function () {
            this._div = L.DomUtil.create('div', 'searchBox');
            var html = '<div id="search-box" class="sky-form" novalidate="novalidate" style="border:none;">\
                            <label class="input" style="width:150px;display:inline-block;vertical-align:top;">\
                                <i class="icon-prepend fa fa-yelp" style="color:red;"></i>\
                                <input type="text" name="find" id="yelp-find" placeholder="Find">\
                                <b class="tooltip tooltip-bottom-right">Search term (e.g. "food", "restaurants")</b>\
                            </label>\
                            <label class="input" style="width:400px;display:inline-block;">\
                                <div class="input-group" style="width:100%;">\
                                    <i class="icon-prepend fa fa-map-marker" style="color:red;"></i>\
                                    <input type="text" name="address" id="google_input" placeholder="Near">\
                                    <b class="tooltip tooltip-bottom-right">Search address, city, state or zip</b>\
                                </div>\
                            </label>\
                        </div>';
            this._div.innerHTML = html;

            $(this._div).hover(function () {
                map.scrollWheelZoom.disable();
                map.dragging.disable();
                map.doubleClickZoom.disable();
            }, function () {
                map.scrollWheelZoom.enable();
                map.dragging.enable();
                map.doubleClickZoom.enable();
            });

            var autocompleteSource = [];
            $.each(categories, function (i, v) {
                autocompleteSource = autocompleteSource.concat(v);
            });

            $("#yelp-find", this._div).autocomplete({
                source: autocompleteSource
            });

            $("#yelp-find", this._div).keydown(function (e) {
                if (e.keyCode === 13) {
                    yelpBusinessSearch(cMarker._latlng.lat, cMarker._latlng.lng, 500, yelpDisplayResult);
                }
            });
            return this._div;
        };
        searchBox.addTo(map);
    }

    function createSearchResult() {
        var searchResult = L.control({position: 'topright'});
        searchResult.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'searchResult');
            var html = '<div style="border: 1px solid #aaa; background:rgba(255,255,255,0.8); height:100%;padding:10px;">\
                            <div class="headline headline-md no-margin"><h2>Search Result</h2></div>\
                            <div id="search-result" style="height:calc(100% - 40px); overflow-y:auto;"></div>\
                        </div>';
            this._div.innerHTML = html;
            $(this._div).hover(function () {
                map.scrollWheelZoom.disable();
                map.dragging.disable();
                map.doubleClickZoom.disable();
            }, function () {
                map.scrollWheelZoom.enable();
                map.dragging.enable();
                map.doubleClickZoom.enable();
            });
            return this._div;
        };
        searchResult.addTo(map);
    }

    function resetBusinessList(flag) {
        if (selectedBusiness) {
            if (flag) {
                $(selectedBusiness._path).remove();
            }else{
                currentPath._path.style.stroke = "blue";
                console.log(currentPath);
            }
            selectedBusiness = null;
        }
        for (var key in businessList) {
            map.removeLayer(businessList[key]);
        }
        businessList = [];
    }

    function yelpBusinessSearch(lat, lng, radius, callback) {
        $(cMarker._icon).addClass("current-location-icon-loading");
        var term = $("#yelp-find").val();
        $.post("yelp-search-businesses", {term: term, lat: lat, lng: lng, radius: radius}, function (res) {
            resetBusinessList(true);
            $("#search-result").html('');
            var data = $.parseJSON(res);
            $(cMarker._icon).removeClass("current-location-icon-loading");
            if (data.total > 0) {
                callback(data);
            } else {
                alert("No result found.");
            }
        });
    }

    function yelpDetail(id) {
        $.post("yelp-business-detail", {id: id}, function (res) {
            var data = $.parseJSON(res);
        });
    }

    function yelpDisplayResult(data) {
        data.businesses.forEach(function (item) {
            if (item.location.coordinate) {
                addBusiness(item);
            } else {
                var address = item.location.display_address.toString();
                new google.maps.Geocoder().geocode({"address": address}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        item.location.coordinate = {};
                        item.location.coordinate.latitude = results[0]["geometry"]["location"]["k"];
                        item.location.coordinate.longitude = results[0]["geometry"]["location"]["B"];
                        addBusiness(item);
                    }
                });
            }

            var distanceHTML = convertDistanceToHTML(item.distance);
            $("#search-result").append('<div class="inner-results yelp-search-result" data-id="' + item.id + '">\
                                        <h6 class="business-name no-margin"><a href="#">' + item.name + '<small>&nbsp;&nbsp;&nbsp;' + item.categories[0][0] + '&nbsp;&nbsp;&nbsp;' + distanceHTML + '</small></a></h6>\
                                        <ul class="no-margin list-inline down-ul" style="margin-top:-4px;">\
                                            <li><img src="' + item.rating_img_url_small + '"/></li>\
                                            <li><small>' + item.review_count + ' reviews</small></li>\
                                        </ul>\
                                        <ul class="no-margin list-inline down-ul" style="margin-top:-4px;">\
                                            <li><h6 class="no-margin"><small>' + item.location.display_address[0] + ', ' + item.location.display_address[1] + '</small></a></li>\
                                            <li class="no-padding"><h6 class="no-margin"><small>' + item.display_phone + ' </small></a></li>\
                                        </ul>\
                                    </div><hr style="margin:1px 0px;">');
        });
    }

    function convertDistanceToHTML(distance) {
        var mileDistance = (distance * 0.000621371), distanceHTML;
        if (mileDistance > 10) {
            distanceHTML = parseInt(mileDistance) + "&nbsp;miles";
        } else if (mileDistance > 1) {
            distanceHTML = mileDistance.toFixed(1) + "&nbsp;miles";
        } else {
            distanceHTML = mileDistance.toFixed(2) + "&nbsp;miles";
        }
        return distanceHTML;
    }

    function initEventListener() {
        googleSearch();
        $("#search-result").on('click', '.business-name', function (e) {
            var target = $(e.currentTarget).parent();
            var id = target.data('id');
            selectMarker(businessList[id]);
        });
        $(".leaflet-popup-pane").on('click', '.create-event', function (e) {
            createEvent(selectedBusiness);
            selectedBusiness.closePopup();
            map.setView(selectedBusiness.getLatLng());
            cMarker.setLatLng(selectedBusiness.getLatLng());
            resetBusinessList(false);
        });
    }

    function googleSearch() {
        var googleInput = document.getElementById("google_input");
        var autocomplete = new google.maps.places.Autocomplete(googleInput);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            if (place.geometry) {
                var currentPosition = new L.LatLng(place.geometry.location.k, place.geometry.location.B);
                map.setView(currentPosition);
                map.setZoom(16);
                cMarker.setLatLng(currentPosition);
                var keyword = $("#yelp-find").val();
                yelpBusinessSearch(currentPosition.lat, currentPosition.lng, 500, yelpDisplayResult);
            }
        });
        yelpBusinessSearch(cMarker.getLatLng().lat, cMarker.getLatLng().lng, 500, yelpDisplayResult);
    }

    function addBusiness(item) {
        item.categories = typeof item.categories === "undefined" ? [[''], ['']] : item.categories;
        var icon, category = item.categories[0][1];
        if ($.inArray(category, categories.cutlery) >= 0) {
            iconName = "cutlery";
        } else if ($.inArray(category, categories.glass) >= 0) {
            iconName = "glass";
        } else if ($.inArray(category, categories.coffee) >= 0) {
            iconName = "coffee";
        } else if ($.inArray(category, categories.truck) >= 0) {
            iconName = "truck";
        } else if ($.inArray(category, categories.beer) >= 0) {
            iconName = "beer";
        } else {
            console.log(category);
            iconName = "chevron-circle-down";
        }

        var coordinate = item.location.coordinate;
        var icon = L.AwesomeMarkers.icon({
            icon: iconName,
            prefix: 'fa',
            markerColor: 'red'
        });

        var marker = L.marker([coordinate.latitude, coordinate.longitude], {icon: icon}).addTo(map);
        var popup = new L.Popup({"closeOnClick": false});

        var distanceHTML = convertDistanceToHTML(item.distance);
        var content = ' <ul class="no-margin list-inline down-ul business-name">\
                            <li><i class=\"icon-2x color-brown fa fa-' + iconName + '"></i></li>\
                            <li><h5 class=\"heading-md\">' + item.name + '</h5></li>\
                            <li><h5 class=\"heading-md\"><small>' + item.categories[0][0] + '</small></h5></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><h6 class=\"heading-md distance\">' + distanceHTML + '</h6></li>\
                            <li><h6 class=\"heading-md duration\"></h6></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><img src="' + item.rating_img_url + '"/>' + item.review_count + ' reviews from <a href="' + item.url + '" target="_blank"><span class="color-red"><i class="color-red fa fa-yelp"></i> Yelp</li></span></a>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><h6 class="heading-md">' + item.location.display_address[0] + ', ' + item.location.display_address[1] + '</a></li>\
                            <li><h6 class="heading-md">' + item.display_phone + ' </a></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><h6 class=\"heading-md\"><img src="' + item.image_url + '" style="float:left;margin:0px 5px 5px 0px;">' + item.snippet_text + '</h6></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><button class="btn-u btn-u-dark-blue create-event" type="button"><i class="fa fa-calendar"></i> Create event</button></li>\
                        </ul>';
        popup.setContent(content);
        marker.bindPopup(popup);
        marker.item = item;
        businessList[item.id] = marker;
        marker.on('click', function (e) {
            selectMarker(marker);
        });
    }

    function selectMarker(marker) {
        if (selectedBusiness) {
            $(selectedBusiness._icon).removeClass('selectedMark');
            $(selectedBusiness._path).remove();
        }

        selectedBusiness = marker;
        map.setView(selectedBusiness.getLatLng());
        $(selectedBusiness._icon).addClass('selectedMark');

        if (!selectedBusiness._popup._isOpen) {
            selectedBusiness.openPopup();
        }

        var origin = plan.getLastEvent() || cMarker;

        getPath(origin._latlng, selectedBusiness._latlng, function (latlngs, duration) {
            currentPath = L.polyline(latlngs, {color: '#cc0000'}).addTo(map);
            selectedBusiness._path = currentPath._path;
            selectedBusiness.duration = duration;
            $(selectedBusiness._popup._container).find(".duration").html(duration);
        });
    }

    function getPath(origin, destination, callback) {
        var directionsService = new google.maps.DirectionsService();
        var request = makeRequest(origin.lat, origin.lng, destination.lat, destination.lng);
        directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                var latlngs = [];
                result.routes[0].overview_path.forEach(function (item) {
                    latlngs.push(L.latLng(item.k, item.B));
                });
                var duration = result.routes[0].legs[0].duration.text + " on foot";
                callback(latlngs, duration);
            }
        });
    }

    function addCurrentLocationMarker() {
        var myIcon = L.divIcon({className: 'current-location-icon', iconSize: L.point(21, 30), html: "<i class='fa fa-child' id='current-location-icon' style='font-size:30px;'></i>"});
        var center = map.getCenter();
        cMarker = L.marker([center.lat, center.lng], {icon: myIcon, draggable: true, zIndexOffset: 10000}).addTo(map);
        var popup = new L.Popup();
        popup.setContent('Drag me to search around me!');
        cMarker.bindPopup(popup);
        cMarker.openPopup();

        popup._container.style['margin-bottom'] = "30px";
        cMarker.on('dragend', function (e) {
            yelpBusinessSearch(cMarker._latlng.lat, cMarker._latlng.lng, 500, yelpDisplayResult);
        });
    }

    function makeRequest(start_lat, start_long, end_lat, end_long) {
        var start = new google.maps.LatLng(start_lat, start_long);
        var end = new google.maps.LatLng(end_lat, end_long);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        };
        return request;
    }

    function createEvent(item) {
        // TODO: add modal
        plan.saveEvent(item);
        //console.log(item);
        //console.log(plan.getEvent());
        //var tiemLineHtml = plan.getTimeLine();
        //$(".timeline").html(tiemLineHtml);
        addEventMarker(item.item);
    }

    function addEventMarker(item) {
        /*        var path = selectedBusiness._path.cloneNode(true);
         item._path = path;
         $(".leaflet-overlay-pane").append(item._path);
         console.log(selectedBusiness._path);*/
        item.categories = typeof item.categories === "undefined" ? [[''], ['']] : item.categories;
        var icon, category = item.categories[0][1];
        if ($.inArray(category, categories.cutlery) >= 0) {
            iconName = "cutlery";
        } else if ($.inArray(category, categories.glass) >= 0) {
            iconName = "glass";
        } else if ($.inArray(category, categories.coffee) >= 0) {
            iconName = "coffee";
        } else if ($.inArray(category, categories.truck) >= 0) {
            iconName = "truck";
        } else if ($.inArray(category, categories.beer) >= 0) {
            iconName = "beer";
        } else {
            console.log(category);
            iconName = "chevron-circle-down";
        }

        var coordinate = item.location.coordinate;
        var icon = L.AwesomeMarkers.icon({
            icon: iconName,
            prefix: 'fa',
            markerColor: 'cadetblue'
        });

        var marker = L.marker([coordinate.latitude, coordinate.longitude], {icon: icon}).addTo(map);
        var popup = new L.Popup({"closeOnClick": false});

        var distanceHTML = convertDistanceToHTML(item.distance);
        var content = ' <ul class="no-margin list-inline down-ul business-name">\
                            <li><i class=\"icon-2x color-brown fa fa-' + iconName + '"></i></li>\
                            <li><h5 class=\"heading-md\">' + item.name + '</h5></li>\
                            <li><h5 class=\"heading-md\"><small>' + item.categories[0][0] + '</small></h5></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><h6 class=\"heading-md distance\">' + distanceHTML + '</h6></li>\
                            <li><h6 class=\"heading-md duration\"></h6></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><img src="' + item.rating_img_url + '"/>' + item.review_count + ' reviews from <a href="' + item.url + '" target="_blank"><span class="color-red"><i class="color-red fa fa-yelp"></i> Yelp</li></span></a>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><h6 class="heading-md">' + item.location.display_address[0] + ', ' + item.location.display_address[1] + '</a></li>\
                            <li><h6 class="heading-md">' + item.display_phone + ' </a></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><h6 class=\"heading-md\"><img src="' + item.image_url + '" style="float:left;margin:0px 5px 5px 0px;">' + item.snippet_text + '</h6></li>\
                        </ul>\
                        <ul class="no-margin list-inline down-ul">\
                            <li><button class="btn-u btn-u-dark-blue create-event" type="button"><i class="fa fa-calendar"></i> Remove event</button></li>\
                        </ul>';
        popup.setContent(content);
        marker.bindPopup(popup);
        marker.item = item;
        marker.on('click', function (e) {
            selectMarker(marker);
        });
    }
};