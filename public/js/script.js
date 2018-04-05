($ => {
  "use strict";

  // Scroll using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(() => {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 54)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Close responsive menu when scroll trigger is clicked
  $('.js-scroll-trigger').click(() => {
    $('.navbar-collapse').collapse('hide');
  });

  // Use Bootstrap JS scrollspy with jQuery
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

  // Collapse Navbar
  let navbarCollapse = () => {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Hide navbar when modals trigger
  $('.portfolio-modal').on('show.bs.modal', e => {
    $(".navbar").addClass("d-none");
  })
  $('.portfolio-modal').on('hidden.bs.modal', e => {
    $(".navbar").removeClass("d-none");
  })
})(jQuery);


function createGroup(gname) {
  $.post("/create-group", gname, () => {console.log("success!")} );
}

//front end handshake
//
//Front end login receive signature
//
const authenticate =(user) => {

  let userToken = localStorage.getItem('EHUserToken');
  console.log(user);

  $.post("http://localhost:8080/auth",user)
  .done(
    (data,status,xhr) => {
      $.ajaxSetup({
        beforeSend: xhr => xhr.setRequestHeader("Authorization",`Bearer ${data.token}`)
      });
      localStorage.setItem('EHUserToken',data.token);
      console.log(data.user);
      $('.def-nav').remove();
       $.get("http://localhost:8080/user/nav")
            .done((data,status,xhr) => {
              $('#mainNav_items').append(data);
              googleMapInit();
            })
          })
      .fail(xhr => console.log(JSON.parse(xhr.responseText).message)); 
}

$('#login_form').on('submit', event => {
  event.preventDefault();
      authenticate({email:$('#username').val(),password:$('#password').val()});
    });

//
//google maps api for create group
//

// use the different category buttons to reload the map based on location types
googleMapInit = () =>{
  let markers = [];
  let placesArr = [];
  let routeMarkers = [];
  let routePlaces = [];
  let mapNum;

  $("#map-select").change(() => {
    if( markers[mapNum] === true && markers[mapNum].getAnimation() != null) {
      markers[mapNum].setAnimation(null);
    }
    var e = document.getElementById("map-select");
    mapNum = e.options[e.selectedIndex].value;
    console.log(markers[mapNum]);
    markers[mapNum].setAnimation(google.maps.Animation.BOUNCE);
  } );
  $("#routeAdd").on('click', () => {
    routeMarkers.push(markers[mapNum]);
    routePlaces.push(placesArr[mapNum]);
    console.log(routePlaces);
    initMap();
    console.log(routeMarkers);
    populateRoute();
    progressBar();
    routeCompleteCheck();
  })
  $("#createGroup").on('click', () => {
    createGroup("Cupcakes");
  })
  $("#create-group-button").on('click', () => initMap());
  $("#cafes").on('click', () => initMap('cafe'));
  $("#bar").on('click', () => initMap('bar'));
  $("#art_gallery").on('click', () => initMap('art_gallery'));
  $("#restaurant").on('click', () => initMap('restaurant'));
  $("#movie_theater").on('click', () => initMap('movie_theater'));
  $("#spa").on('click', () => initMap('spa'));
  $("#create_title_button").on("click", () => {
    console.log($('#group_title_input').val());

    $('#create-group-title').text($('#group_title_input').val());
  });

  var initMap = (category) => {
    markers = [];
    $(".placeInfo").remove();
    $("#place-list").text("");
              // Create the map.
              this.durham = { lat: 35.997, lng: -78.904 };
              map = new google.maps.Map(document.getElementById('map'), {
                center: durham,
                zoom: 15
              });
              // Create the places service.
              this.service = new google.maps.places.PlacesService(map);
              this.getNextPage = null;
              this.moreButton = document.getElementById('more');
              // Perform a nearby search.
              service.nearbySearch(
                { location: durham, radius: 1800, type: [category] },
                function (results, status, pagination) {
                  if (status !== 'OK') return;
                  createMarkers(results);
                });
            }

            function progressBar() {
              if (!$("#progOne").hasClass('done')) {
                $("#progOne").addClass("done");
                $("#progOne").removeClass("todo");
              } else if (!$("#progTwo").hasClass("done")) {
                $("#progTwo").addClass("done");
                $("#progTwo").removeClass("todo");
              } else if (!$("#progThree").hasClass("done")) {
                $("#progThree").addClass("done");
                $("#progThree").removeClass("todo");
              }
            }

            function routeCompleteCheck() {
              if ($("#progThree").hasClass("done")) {
                $("#routeAdd").toggle();
                $("#createGroup").toggle();
                console.log(routeMarkers);
              }
            }

            function toggleBounce(marker) {
              if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
              } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
              }
            }
            function populateRoute() {
              for (i = 0; i < routeMarkers.length; i++) {
                routeMarkers[i] = new google.maps.Marker({
                  position: routeMarkers[i].position,
                  map: map,
                  title: routeMarkers[i].title
                });
                routeMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
              };
            }

            var createMarkers = (places) => {
              this.bounds = new google.maps.LatLngBounds();
              this.placesList = document.getElementById('places');
              $('#map-select').empty()
              for (let i = 0 ; i<places.length ; i++) {
                let place = places[i];
                this.image = {
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25)
                };
                this.marker = new google.maps.Marker({
                  map: map,
                  icon: image,
                  title: place.name,
                  position: place.geometry.location
                });                  
                markers.push(marker);
                placesArr.push(place);
                populateRoute();                
                bounds.extend(place.geometry.location);

                logPlaceDetails(place.place_id);
                function logPlaceDetails(location) {
                  var service = new google.maps.places.PlacesService($("#placesInfo").get(0));
                  service.getDetails(
                  {
                    placeId: location
                  },
                  function(place, status) {
                    //console.log("Place details:", place);
                    $('#map-select')[0].options.add(new Option(place.name));
                    createInfoBox(place);
                  }
                  );
                }

                function createInfoBox(place) {
                  let photos = place.photos[0].getUrl({
                    maxWidth: 270,
                    maxHeight: 350
                  });
                  let placeInfoBox = ` 
                  <div class="card bg-light">
                  <div class="row">
                  <div class="col-md-4 container-fluid">
                  <img src="${photos}" class="w-100 img-responsive progress">
                  </div>
                  <div class="col-md-8 px-3">
                  <div class="card-block px-3">
                  <br>
                  <h2 class="card-title">${place.name}<span><a href="${place.website}" target="_blank" class="btn btn-sm btn-primary card-btn">More Info</a></span></h2>
                  <p class="card-text"><em>Google rating: ${place.rating}</em></p>
                  <h5 class="card-text">${place.formatted_address}</h5>
                  <h5 class="card-text">${place.formatted_phone_number}</h5>
                  <br>
                  </div>
                  </div>
                  </div>
                  </div>    
                  `;
                  $("#place-list").append(placeInfoBox);
                }
              }
              map.fitBounds(bounds);
            }
          }  
          $(document).ready(event =>{

            $(window).scrollTop(0);  
            let userToken = localStorage.getItem('EHUserToken');     
            $.ajaxSetup({
              beforeSend: xhr => xhr.setRequestHeader("Authorization",`Bearer ${userToken}`)
            });
            $.get("http://localhost:8080/user/nav")
            .done((data,status,xhr) => {
              $('#mainNav_items').append(data);
              googleMapInit();
            }).fail(xhr => {
              console.log(xhr.responseText.message);
              $.get('http://localhost:8080/nav')
              .done((data,status,xhr) => {
                $('#mainNav_items').append(data);
              });
            });    
            googleMapInit();
          });