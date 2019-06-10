var autocomplete;

// Important Stitch Info
const APP_ID = "week6challenge-eufie"; // Add your Stitch App ID here

const MDB_SERVICE = "mongodb-atlas"; // Add the name of your Atlas Service ("mongodb-atlas" is the default)
const {
  Stitch
} = stitch;

// Setup the connection between the frontend and MongoDB Stitch
const client = stitch.Stitch.initializeDefaultAppClient(APP_ID);
const coll = client.getServiceClient(stitch.RemoteMongoClient.factory, MDB_SERVICE)
  .db('mdbw')
  .collection('week6');


// Authenticate the client if they're not already logged in
// After login search for relevant properties and populate the table
client.auth.loginWithCredential(new stitch.AnonymousCredential())
  // Returns a promise that resolves to the authenticated user
  .then(user => {
    sendPayload();
    console.log(`successfully logged in with id: ${user.id}`)
  })
  .catch(err => console.error(`login failed with error: ${err}`))


async function sendPayload() {
  document.getElementById("form").addEventListener('submit', async function submit(e) {
    e.preventDefault();
    document.getElementById('loading').style.display = "block";
    const payload = {
      "name": document.getElementById("name").value,
      "email": document.getElementById("email").value,
      "location": {
        "country": document.getElementById("country").value,
        "city": document.getElementById("locality").value,
        "lat": document.getElementById("lat").value,
        "lng": document.getElementById("lng").value
      }
    }
    const {
      insertBody
    } = await coll.insertOne(payload);
    setTimeout(() => {
      document.getElementById('step-animation').style.display = "block";
    }, 3000);
  });
}


var placeSearch, autocomplete;

var componentForm = {
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'), {
      types: ['geocode']
    });

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component', 'geometry']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    const addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      const val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
  const location = place.geometry.location;
  document.getElementById('lat').value = location.lat();
  document.getElementById('lng').value = location.lng();
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}