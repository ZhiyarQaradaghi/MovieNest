function searchMovie() {
    const query = document.getElementById('searchInput').value;

    if (query.trim() === '') {
        document.getElementById('alert-container').innerHTML = '<div class="alert alert-warning" role="alert">Please enter a search query.</div>';
        return;
    }

    fetch(`/searchmovie?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(movies => {
            const movieCards = movies.map(movie => `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="/images/${movie.image}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.description}</p>
                            <a href="movie-details.html?id=${movie.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            `).join('');

            document.getElementById('movieCardsBrowser').innerHTML = movieCards;
        });
}

const searchForm = document.getElementById('search-form');
const searchButton = document.getElementById('searchButton');

if (searchForm) {
    searchForm.onsubmit = function (event) {
        event.preventDefault();
        searchMovie();
    };
}

if (searchButton) {
    searchButton.onclick = function () {
        searchMovie();
    };
}
