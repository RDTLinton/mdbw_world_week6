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
        const res = await coll.find({email:'saspect.io@gmail.com'}).toArray();
        console.log(res);  

        await getWeather(res[0].location.lat, res[0].location.lng);
        await getItiniary(res[0].flightData.from, res[0].flightData.to, res[0].flightData.airline, res[0].airport.outboundpartialdate, res[0].flightData.cost, res[0].flightData.currency);  
        await getDirections(res[0].direction.start, res[0].direction.end);
    }
    
    async function getWeather(lat, long) {
        
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
    }

    async function getItiniary(departure, arrival,airline, date, cost, currency) {
        $('#depature-location').html(departure);
        $('#arrival-location').html(arrival);
        $('#airline').html(airline);
        $('#date').html(date);
        $('#cost').html('$ '+cost);
        $('#currency').html(currency);
    }

    async function getDirections(ORIGIN, DESTINATION) {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 40.6976701, lng: -74.2598758}
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