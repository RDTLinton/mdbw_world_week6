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
        let emailParam = ((window.location.href).split('='))[1];
        const res = await coll.find({email:emailParam}).toArray();

        await getWeather(res[0].weather.city, res[0].weather['forecasted-week']);
        await getItiniary(res[0].name, res[0].email, res[0].flightData.from, res[0].flightData.to, res[0].flightData.airline, res[0].airport.outboundpartialdate, res[0].flightData.cost, res[0].flightData.currency);  
        await getDirections(res[0].direction.start, res[0].direction.end);
    }
    
    async function getWeather(city, weather) {
        
        for(i in weather){
            
               
            let celsius = ((weather[i].apparentTemperatureHigh+weather[i].apparentTemperatureHigh)/2);
            //console.log(celsius);
            let farenheit = (celsius * 1.8) + 32;

            let location = city;
            let iteration = (i).toString()
            let parent = '.weather-box-'+iteration;
            let utcSeconds = weather[i].time;
            let d = new Date(0)
            d.setUTCSeconds(utcSeconds);
            let days = (d.toString()).split('23:00:00')

            $(parent).find('.weather-location').html(location);
            $(parent).find('.temp').html(Math.floor(celsius));
            $(parent).find('.weather-description').html(weather[i].summary);
            $(parent).find('.weather-day').html(days[0]);
            $(parent).find('.weatherType').attr('id', weather[i].icon);
            $(parent).find('.row2').on('click', function () {
                if ($(parent).find('.temp').html() == (Math.floor(celsius))) {
                    $(parent).find('.temp').html(Math.floor(farenheit));
                    $(parent).find('.temp-type').html('°F');

                } else {
                    $(parent).find('.temp').html(Math.floor(celsius));
                    $(parent).find('.temp-type').html('°C');
                }
            });

        }
        
        //SETTING UP THE ICON 
        let icons = new Skycons({
            "color": "white"
        });

        icons.set("clear", Skycons.CLEAR_DAY);
        icons.set("clear-night", Skycons.CLEAR_NIGHT);
        icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
        icons.set("cloudy", Skycons.CLOUDY);
        icons.set("rain", Skycons.RAIN);
        icons.set("sleet", Skycons.SLEET);
        icons.set("snow", Skycons.SNOW);
        icons.set("wind", Skycons.WIND);
        icons.set("fog", Skycons.FOG);
        icons.play();
    }

    async function getItiniary(name, email, departure, arrival,airline, date, cost, currency) {
        $('#name').html(name);
        $('#email').html(email);
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