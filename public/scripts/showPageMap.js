mapboxgl.accessToken = mapbox_token;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

const marker = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ 
            offset: 25,
            closebtn: false
        })
            .setHTML(
                `<h5>${campground.title}</h5><p>${campground.location}</p>`
            )
    )
    .addTo(map);

const markerDiv = marker.getElement();

markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
markerDiv.addEventListener('mouseleave', () => marker.togglePopup());