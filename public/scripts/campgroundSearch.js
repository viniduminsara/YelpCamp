document.addEventListener('DOMContentLoaded', function () {
    // Get the input element and campground cards
    const searchInput = document.getElementById('searchInput');
    const campgroundCards = document.querySelectorAll('.card');
    console.log(searchInput)
    console.log(campgroundCards)

    // Add an input event listener to the search input
    searchInput.addEventListener('input', function () {
        const searchText = this.value.toLowerCase();

        // Hide all campground cards
        campgroundCards.forEach(function (card) {
            card.style.display = 'none';
        });

        // Show only the cards that match the search text
        campgroundCards.forEach(function (card) {
            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const description = card.querySelector('.location').innerText.toLowerCase();

            if (title.includes(searchText) || description.includes(searchText)) {
                card.style.display = 'block';
            }
        });
    });
});