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


const getUser = () => {
        $.get('http://localhost:8080/user')//request user groups form server
      .done((data,status,xhr)=>{
        
        data.Groups.forEach(group => {//generate buttons for user groups          
          $('#user-groups').append(
              `<div class="col-md-4 col-sm-6 portfolio-item">
                <a class="portfolio-link" data-toggle="modal" href="#show-route-modal" data-group="${group.id}">
                  <div class="portfolio-hover">
                    <div class="portfolio-hover-content">
                      <i class="fa fa-plus fa-3x"></i>
                    </div>
                  </div>
                  <img class="img-fluid" src="public/img/portfolio/event-02.jpg" alt="">
                </a>
                <div class="portfolio-caption">
                 <p class="text-muted">|${group.members} members|</p>
                </div>
              </div>`
            );
        });
      })
      .fail(err => $('#user-groups').html('<h3 class="section-subheading text-muted">Create custom groups!</h3>'));//no user, no groups D`:
}

//front end handshake
//and
//receive signature
//
const authenticate =(user) => {
  //console.log(user);

  $.post("http://localhost:8080/auth", user)//check login credentials with server
  .done(
    (data,status,xhr) => {
      $.ajaxSetup({ //set auth header for all subsequent ajax calls
        beforeSend: xhr => xhr.setRequestHeader("Authorization",`Bearer ${data.token}`)
      });
      localStorage.setItem('EHUserToken',data.token);
      $("#loginModal").modal('toggle');
      console.log(data.user);
      $('.def-nav').remove();//remove default navbar
        $.get("http://localhost:8080/user/nav")//load user navbar extention
        .done(      
          (data,status,xht) => {
              $('#mainNav_items').append(data);
              getUser();

        })      
    })
    .fail(xhr => console.log(JSON.parse(xhr.responseText).message)); 
}
//event listener for login button
$('#login_form').on('submit', event => {
  event.preventDefault();
      authenticate({email:$('#username').val(),password:$('#password').val()});
    });

//
//google maps api for create group
//
googleMapInit = () => {
  //allocate resources
  let markers = [];
  let placesArr = [];
  let routeMarkers = [];
  let routePlaces = [];
  let categoryName;
  let mapNum;
  let startLoc = "";
  let secondLoc = "";
  let lastLoc = "";
  let completeRoute = "";

  //on change, gets the value from the selected location and makes the marker bounce to show the user where it is
  $("#map-select").change(() => {
    if (markers[mapNum] === true && markers[mapNum].getAnimation() != null) {
      markers[mapNum].setAnimation(null);
    }
    var e = document.getElementById("map-select");
    mapNum = e.options[e.selectedIndex].value;
    console.log(markers[mapNum]);
    markers[mapNum].setAnimation(google.maps.Animation.BOUNCE);
  });

  // Adds the user's chosen location as a bouncing red marker so they can see their previously chosen locations.  Also increases progress bar and checks if route is complete to toggle the 'Create Route' button
  $("#routeAdd").on("click", () => {
    $(categoryName).toggle();
    routeMarkers.push(markers[mapNum]);
    routePlaces.push(placesArr[mapNum]);
    console.log("places array: " + JSON.stringify(placesArr[mapNum]));
    routeLocations();
    initMap();
    console.log("route markers: " + routeMarkers);
    populateRoute();
    progressBar();
    routeCompleteCheck();
  });
  
  //stringifies the locations with & delimeter for eb route storage
  $("#openRouteModal").on('click', () => {
    resetProgress();
    completeRoute = startLoc + "&";
    completeRoute += secondLoc + "&";
    completeRoute += lastLoc;
    console.log(completeRoute);
    displayRoute(startLoc, secondLoc, lastLoc);
  })

  // Allows the user to Create a Group, pushing the route to the database and allowing others to search for and join the group.
  $("#createGroup").on("click", () => {
    createGroup("Cupcakes");
  });

  // initializes the map so it is visible when the modal pops up
  $("#create-group-button").on("click", () => initMap());

  // these do google Places search around the downtown area based on the location type the user chooses.  categoryName is saved so the category button is toggled off if the user chooses a location from that group (so they can't choose from the same category twice)
  $("#cafes").on("click", () => {
    categoryName = "#cafes";
    initMap("cafe");
  });
  $("#bar").on("click", () => {
    categoryName = "#bar";
    initMap("bar");
  });
  $("#art_gallery").on("click", () => {
    categoryName = "#art_gallery";
    initMap("art_gallery");
  });
  $("#restaurant").on("click", () => {
    categoryName = "#restaurant";
    initMap("restaurant");
  });
  $("#movie_theater").on("click", () => {
    categoryName = "#movie_theater";
    initMap("movie_theater");
  });
  $("#spa").on("click", () => {
    categoryName = "#spa";
    initMap("spa");
  });

  // allows the User to name their group and display the title above the map
  $("#create_title_button").on("click", () => {
    console.log($("#group_title_input").val());

    $("#create-group-title").text($("#group_title_input").val());
  });

  //this initializes the google map and sets the marker in downtown durham
  var initMap = category => {
    // clears these variables/elements so they can be repopulated based on the location categories when the user changes them
    placesArr = [];
    markers = [];
    $(".placeInfo").remove();
    $("#place-list").text("");

    // Create the map.
    this.durham = { lat: 35.997, lng: -78.904 };
    map = new google.maps.Map(document.getElementById("map"), {
      center: durham,
      zoom: 15
    });

    // Create the places service.
    this.service = new google.maps.places.PlacesService(map);

    // Perform a nearby search.
    service.nearbySearch(
      {
        location: durham,
        radius: 1800,
        type: [category]
      },
      function(results, status, pagination) {
        if (status !== "OK") return;
        createMarkers(results);
      }
    );
  };

  // creates the markers for the google map
  var createMarkers = places => {
    this.bounds = new google.maps.LatLngBounds();
    this.placesList = document.getElementById("places");
    //empties select drop-down so it can be repopulated appropriately
    $("#map-select").empty();
    $("#map-select").append($("<option>", { id: 'map-select-title', text: "Select a location!", selected: true, disabled: true }));
    // loops through all the found locations in the category and creates appropriate icon
    for (let i = 0, place; (place = places[i]); i++) {
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
      // markers and their place objects are then pushed to arrays in the same order the map-select drop-down is populated so the value can be used to link the correct marker/place
      markers.push(marker);
      populateRoute();
      bounds.extend(place.geometry.location);

      //google Places Details API is used to get more specific information on each location in the loop
      logPlaceDetails(place.place_id);
    }
    map.fitBounds(bounds);
  };

  //Uses the google Places Details API to get more detailed information and passes it into createInfoBox function to build divs with specific info for each place
  function logPlaceDetails(location) {
    var service = new google.maps.places.PlacesService($("#placesInfo").get(0));
    service.getDetails(
      {
        placeId: location
      },
      function(place, status) {
        console.log("Place details:", place);
        //see comment above createInfoBox function
        createInfoBox(place);
      }
    );
  }

  // Takes the google Places Details object and parses out useful information and builds a card for each location in the loop.  Card div is then pushed to the DOM
  function createInfoBox(place) {
    placesArr.push(place);
    $("#map-select").append($("<option>", { value: i, text: place.name }));
    let photos = place.photos[0].getUrl({ maxWidth: 270, maxHeight: 350 });
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
    $("#route-place-list").append(placeInfoBox);
  }

  //updates progress bar [WRITE A MORE CONCISE FUNCTION WHEN YOU HAVE TIME!]
  function progressBar() {
    if (!$("#progOne").hasClass("done")) {
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

  // resets the classes for the progress bar
  function resetProgress() {
    $("#progOne").addClass("todo");
    $("#progOne").removeClass("done"); 
    $("#progTwo").addClass("todo");
    $("#progTwo").removeClass("done"); 
    $("#progThree").addClass("todo");
    $("#progThree").removeClass("done"); 
  }

  //checks if route is complete based on progress bar, then toggles the two buttons so 'Create Route' button appears if appropriate
  function routeCompleteCheck() {
    if ($("#progThree").hasClass("done")) {
      $("#routeAdd").toggle();
      $("#openRouteModal").toggle();
      console.log(routeMarkers);
    }
  }

  // keeps track of the user's previously chosen location markers and repopulates the map with them whenever the user switches categories
  function populateRoute() {
    for (i = 0; i < routeMarkers.length; i++) {
      routeMarkers[i] = new google.maps.Marker({
        position: routeMarkers[i].position,
        map: map,
        title: routeMarkers[i].title
      });
      routeMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  // stores the name and address of the user's selected locations to be used in google map's route directions and pushed to the database for route information
  function routeLocations() {
    if(startLoc === "") {
      startLoc = placesArr[mapNum].name;
      startLoc += ", ";
      startLoc += placesArr[mapNum].formatted_address;
      console.log("Start Location: " + startLoc);
    } else if (secondLoc === "") {
      secondLoc = placesArr[mapNum].name;
      secondLoc += ", ";
      secondLoc += placesArr[mapNum].formatted_address;
      console.log("Middle Location: " + secondLoc);
    } else if (lastLoc === "") {
      lastLoc = placesArr[mapNum].name;
      lastLoc += ", ";
      lastLoc += placesArr[mapNum].formatted_address;
      console.log("Last Location: " + lastLoc);
    }
  }
  

  function displayRoute(firstLocation, secondLocation, lastLocation) {
    //Create the directions services
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    this.durham = { lat: 35.997, lng: -78.904 };
    routemap = new google.maps.Map(document.getElementById("routemap"), {
      center: durham,
      zoom: 15
    });
    $("#route-place-list").text("");
    directionsDisplay.setMap(routemap);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    calculateAndDisplayRoute(directionsService, directionsDisplay, firstLocation, secondLocation, lastLocation);

  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay, firstLocation, secondLocation, lastLocation) {
    directionsService.route(
      {
        origin: firstLocation,
        destination: secondLocation,
        waypoints: [
          {
            location: lastLocation,
            stopover: true
          }
        ],
        travelMode: "WALKING"
      },
      function(response, status) {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
          console.log(response);
          logPlaceDetails(response.geocoded_waypoints[0].place_id);
          logPlaceDetails(response.geocoded_waypoints[1].place_id);
          logPlaceDetails(response.geocoded_waypoints[2].place_id);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  
  
};                 
$(document).ready(event =>{
    //on window load
    $(window).scrollTop(0);  
    let userToken = localStorage.getItem('EHUserToken');//check if user is logged in    
    $.ajaxSetup({//if they are logged in, set auth header for all ajax calls
      beforeSend: xhr => xhr.setRequestHeader("Authorization",`Bearer ${userToken}`)
    });
    $.get("http://localhost:8080/user/nav")//try to load user nav extention to front end
    .done((data,status,xhr) => {
      $('#mainNav_items').append(data);
      getUser();
    }).fail(xhr => {
      $('#user-groups').html('<h3 class="section-subheading text-muted">Become a User and create custom groups!</h3>')
      //console.log(xhr.responseText.message);
      $.get('http://localhost:8080/nav')//load regular (non-user) navbar extensions
      .done((data,status,xhr) => { //console.log(data);
        $('#mainNav_items').append(data);//
      })
      .fail(err => console.log(err));
    });
    googleMapInit();
  });