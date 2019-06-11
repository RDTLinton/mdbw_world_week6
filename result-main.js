(function () {

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
        
        console.log(`successfully logged in with id: ${user.id}`)
        searchAndBuild()
    })
    .catch(err => console.error(`login failed with error: ${err}`))

    async function searchAndBuild(){
        const location = await coll.find().asArray();
        console.log(location);  
        // const airport = await coll.find({"_id":"5cfebd39c9ced91f76b48c52"}, {"projections": {"airport":1}}).toArray();
        // console.log(airport);
        // const weather = await coll.find({"_id":"5cfebd39c9ced91f76b48c52"}, {"projections": {"weather":1}}).toArray();
        // console.log(weather);
        // const direction = await coll.find({"_id":"5cfebd39c9ced91f76b48c52"}, {"projections": {"direction":1}}).toArray();
        // console.log(direction);

        await getItiniary();
        await getWeather();
        await getDirections();
    }
    
    async function getItiniary() {

    }
    async function getWeather() {
        let lat;
        let long;
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(async function (position) {

                lat = position.coords.latitude;
                long = position.coords.longitude;

                let api = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + long + '';

                $.getJSON(api, function (res) {

                    let celsius = res.main.temp;
                    let farenheit = (celsius * 1.8) + 32;

                    let location = res.name;



                    $('.weather-location').html(location);
                    $('.temp').html(Math.floor(celsius));
                    $('.weather-description').html(res.weather[0].description);
                    $('.weatherType').attr('id', res.weather[0].main);
                    $('.row2').on('click', function () {
                        if ($('.temp').html() == (Math.floor(celsius))) {
                            $('.temp').html(Math.floor(farenheit));
                            $('.temp-type').html('°F');

                        } else {
                            $('.temp').html(Math.floor(celsius));
                            $('.temp-type').html('°C');
                        }
                    });


                    //SETTING UP THE ICON 
                    let icons = new Skycons({
                        "color": "white"
                    });

                    icons.set("Clear", Skycons.CLEAR_DAY);
                    icons.set("Clear-night", Skycons.CLEAR_NIGHT);
                    icons.set("Partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
                    icons.set("Partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
                    icons.set("Clouds", Skycons.CLOUDY);
                    icons.set("Rain", Skycons.RAIN);
                    icons.set("Sleet", Skycons.SLEET);
                    icons.set("Snow", Skycons.SNOW);
                    icons.set("Wind", Skycons.WIND);
                    icons.set("Fog", Skycons.FOG);
                    icons.play();

                });
            });
        }
    }
    async function getDirections() {
        let ORIGIN = 'st louis, mo';
        let DESTINATION = 'chicago, il';
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65}
        });
        directionsDisplay.setMap(map);

        // var onChangeHandler = function() {
        //     calculateAndDisplayRoute(directionsService, directionsDisplay);
        // };
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        // document.getElementById('start').addEventListener('change', onChangeHandler);
        // document.getElementById('end').addEventListener('change', onChangeHandler);
    
        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            directionsService.route({
                // origin: document.getElementById('start').value,
                // destination: document.getElementById('end').value,
                origin: ORIGIN,
                destination: DESTINATION,
                travelMode: 'DRIVING'
            }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
            });
        }
    }



})();