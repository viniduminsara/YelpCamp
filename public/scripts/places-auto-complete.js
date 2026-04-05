mapboxgl.accessToken = mapbox_token;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [80.6, 6.9], // Initial center [lng, lat]
    zoom: 7
});

let marker; // Variable to hold the marker
let debounceTimeout; // Timeout for debouncing input

// 3. Select the autocomplete input and results container
const autocompleteInput = document.getElementById('location');
const resultsContainer = document.getElementById('search-results');

// 4. Listen to input changes on the search field
autocompleteInput.addEventListener('input', (e) => {
    const query = e.target.value;

    if (debounceTimeout) clearTimeout(debounceTimeout); // Clear the previous timer

    debounceTimeout = setTimeout(async () => {
        if (query.length < 3) {
            resultsContainer.innerHTML = ''; // Clear results if query is too short
            return;
        }

        // 5. Fetch data from the Mapbox Places API
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=5`);
        const data = await response.json();
        const places = data.features;

        // 6. Display the suggestions in the results container
        resultsContainer.innerHTML = ''; // Clear previous results
        places.forEach(place => {
            const resultItem = document.createElement('li');
            resultItem.classList.add('list-group-item', 'list-group-item-action');
            resultItem.textContent = place.place_name;
            resultsContainer.appendChild(resultItem);

            // 7. Add a click event to move the map to the selected place
            resultItem.addEventListener('click', () => {
                const [lng, lat] = place.center;

                // Move map to the selected location
                map.flyTo({
                    center: [lng, lat],
                    zoom: 14
                });

                // If a marker exists, remove it
                if (marker) marker.remove();

                // Add a marker at the selected location
                marker = new mapboxgl.Marker()
                    .setLngLat([lng, lat])
                    .addTo(map);

                // Clear results and input
                resultsContainer.innerHTML = '';
                autocompleteInput.value = place.place_name;
            });
        });
    }, 500);
});

const imageInput = document.getElementById('image');
const previewContainer = document.getElementById('preview-container');

imageInput.addEventListener('change', function(event) {
    // Clear previous previews
    previewContainer.innerHTML = '';

    const files = event.target.files; // Get all selected files
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return; // Skip non-image files

        const reader = new FileReader();
        reader.onload = function(e) {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-lg-4', 'col-md-6', 'col-sm-12', 'mb-2'); // Responsive Bootstrap grid

            const img = document.createElement('img');
            img.src = e.target.result; // Set image source to file data
            img.classList.add('img-thumbnail', 'w-100', 'h-auto'); // Bootstrap classes for responsive images

            colDiv.appendChild(img);
            previewContainer.appendChild(colDiv);
        };

        reader.readAsDataURL(file); // Read the file as a Data URL
    });
});


