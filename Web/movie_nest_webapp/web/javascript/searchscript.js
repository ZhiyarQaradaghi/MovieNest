function searchMovie() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        document.getElementById('alert-container').innerHTML = '<div class="alert alert-warning">Please enter a search query.</div>';
        return;
    }

    fetch(`/searchmovie?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(movies => {
            const movieCardsContainer = document.getElementById('movieCardsBrowser');
            movieCardsContainer.innerHTML = '';

            movies.forEach(movie => {
                const imagePath = movie.image ? `/images/${movie.image}` : '/images/default_image.jpg';
                const safeParseJSON = (jsonString) => {
                    try {
                        const parsed = JSON.parse(jsonString);
                        if (Array.isArray(parsed)) return parsed;
                        return [];
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                        return [];
                    }
                };

                const directors = safeParseJSON(movie.directors).map(d => d.name).join(', ');
                const cast = safeParseJSON(movie.cast).map(c => c.name).join(', ');

                movieCardsContainer.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 text-center">
                            <img src="${imagePath}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover; cursor: pointer;" onclick="window.location.href='movie-details.html?movieId=${movie.id}'">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">Description: ${movie.description}</p>
                                <p class="card-text">Release Year: ${movie.release_year}</p>
                                <p class="card-text">Genre: ${movie.genre}</p>
                                <p class="card-text">Directors: ${directors}</p>
                                <p class="card-text">Cast: ${cast}</p>
                                <p class="card-text">Likes: <span id="likes-${movie.id}">${movie.likes}</span></p>
                                <button id="like-button-${movie.id}" class="btn btn-secondary">${movie.likes > 0 ? 'Unlike' : 'Like'}</button>
                                <button class="btn btn-primary add-to-library" data-movie-id="${movie.id}">Add to Library</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            movieCardsContainer.addEventListener('click', (event) => {
                if (event.target.matches('button[id^="like-button-"]')) {
                    toggleLike(event.target.id.split('-').pop());
                } else if (event.target.matches('button.add-to-library')) {
                    addToLibrary(event.target.getAttribute('data-movie-id'));
                }
            });
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            document.getElementById('alert-container').innerHTML = '<div class="alert alert-danger">An error occurred while searching for movies.</div>';
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
