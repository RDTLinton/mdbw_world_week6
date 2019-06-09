// // QUERY PARAMETERS
// API_KEY = 'AIzaSyDa5l1n8MG5D51XzExY9O65kUjBNW3BNEw';
// OUTPUT_TYPE = 'json'
// INPUT_TYPE = 'textquery'
// FIELDS = 'name,rating';


// document.getElementById("submit").addEventListener('click', function submit(e){
//     e.preventDefault();
//     console.log("blah");
// });

// function search(){
//     // get search text from input element
//     var searchText = document.getElementById("searchText").value;

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log(this.responseText);
//             var response = JSON.parse(this.responseText)
//             console.log(response.candidates);
//         }
//     };
//     // perform AJAX request on google places API with query parameters defined above
//     xhttp.open("GET", "https://maps.googleapis.com/maps/api/place/findplacefromtext/"+OUTPUT_TYPE+
//             "?key="+API_KEY+
//             "&fields="+FIELDS+
//             "&inputtype="+INPUT_TYPE+
//             "&input="+searchText, true);
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhttp.send();
// }

var placeSearch, autocomplete;

var componentForm = {
//   street_number: 'short_name',
//   route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'), {types: ['geocode']});

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
      autocomplete.setBounds(circle.getBounds());
    });
  }
}