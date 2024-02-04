$(document).ready(function () {
    let page = 1;

    $('#loadMoreBtn').on('click', function () {
        page++;
        const loadMoreBtn = $(this);

        axios.get(`${campgroundId}/reviews/${page}`)
            .then(function (reviews) {
                for (let newReview of reviews.data.nextReviews) {

                    const time = calcTime(newReview.date);
                    $('#reviewsContainer').append(
                        `<div class="card mb-3">
                            <div class="card-body">
                                <p class="starability-result" data-rating="${newReview.rating}">
                                    Rated: ${newReview.rating} stars
                                </p>
                                <p>${newReview.body}</p>
                                <p class="card-title text-end text-muted"><small>${newReview.author.username} | ${time}`
                        // Fix the condition
                        + (newReview.author._id.toString() === currentUserId ?
                            `<form action="/campgrounds/${ campgroundId }/reviews/${ newReview._id.toString() }?_method=DELETE" method="post">
                                        <button class="btn btn-sm btn-danger" style="position: absolute; right: 2%; top: 10%;">Delete</button>
                            </form>` : '')
                        + `</div>
                        </div>`
                    );
                }
                if ($('#reviewsContainer .card').length >= campgroundCount) {
                    // If not, hide the button
                    loadMoreBtn.hide();
                }
            })
            .catch(function (err) {
                console.error(err);
            });
    });
});

function calcTime(date){
    const now = new Date();
    const diffMilliseconds = now - new Date(date);

    const days = Math.floor(diffMilliseconds / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diffMilliseconds / (60 * 60 * 1000)) % 24;
    const minutes = Math.floor(diffMilliseconds / (60 * 1000)) % 60;

    if (days === 0) {
        if (hours > 0) {
            return `${hours} hours ago`;
        } else if (minutes > 0) {
            return `${minutes} minutes ago`;
        } else {
            return 'Just now';
        }
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} months ago`;
    } else {
        const years = Math.floor(days / 365);
        return `${years} years ago`;
    }
}