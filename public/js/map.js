
            mapboxgl.accessToken = mapToken;
              const map = new mapboxgl.Map({
                  container: 'map', // container ID
                  style: "mapbox://styles/mapbox/streets-v11",
                  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                  zoom: 10 // starting zoom
              });


              console.log(coordinates);
          // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color:'black'})
    .setLngLat(coordinates)
    .addTo(map);
