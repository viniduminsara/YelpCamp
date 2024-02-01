$(document).ready(function () {
    let page = 1;

    $('#loadMoreBtn').on('click', function () {
        page++;
        const loadMoreBtn = $(this);

        axios.get(`${campgroundId}/reviews/${page}`)
            .then(function (reviews) {
                for (let newReview of reviews.data.nextReviews) {
                    $('#reviewsContainer').append(
                        `<div class="card mb-3">
                            <div class="card-body">
                                <h6 class="card-title">${newReview.author.username}</h6>
                                <p class="starability-result" data-rating="${newReview.rating}">
                                    Rated: ${newReview.rating} stars
                                </p>
                                <p class="text-muted">${newReview.body}</p>`
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
