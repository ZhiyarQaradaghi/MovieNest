async function showMovies() {
    const response = await fetch('http://localhost:8080/movies');
    const movies = await response.json();
    const moviesReversed = movies.reverse();
    const movieCardsContainer = document.querySelector('#movieCardsBrowser');
    
    movieCardsContainer.innerHTML = '';

    moviesReversed.forEach(movie => {
        const imagePath = movie.image ? `http://localhost:8080/images/${movie.image}` : 'http://localhost:8080/images/default_image.jpg';

        movieCardsContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 text-center">
                    <img src="${imagePath}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover; cursor: pointer;" onclick="window.location.href='movie-details.html?movieId=${movie.id}'">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">Description: ${movie.description}</p>
                        <p class="card-text">Likes: <span id="likes-${movie.id}">${movie.likes}</span></p>
                        <button id="like-button-${movie.id}" class="btn btn-secondary">${movie.likes > 0 ? 'Unlike' : 'Like'}</button>
                        <button class="btn btn-primary add-to-library" data-movie-id="${movie.id}">Add to Library</button>
                    </div>
                </div>
            </div>
        `;
    });

    movieCardsContainer.addEventListener('click', (event) => {
        if (event.target && event.target.matches('button[id^="like-button-"]')) {
            const movieId = event.target.id.split('-').pop();
            toggleLike(movieId);
        }
    });

    movieCardsContainer.addEventListener('click', (event) => {
        if (event.target && event.target.matches('button.add-to-library')) {
            const movieId = event.target.getAttribute('data-movie-id');
            addToLibrary(movieId);
        }
    });
}



async function toggleLike(movieId) {
    const response = await fetch(`http://localhost:8080/toggleLike/${movieId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    document.querySelector(`#likes-${movieId}`).textContent = data.likes;
    const likeButton = document.querySelector(`#like-button-${movieId}`);
    likeButton.textContent = data.likes > 0 ? 'Unlike' : 'Like';
}

async function addToLibrary(movieId) {
    const response = await fetch('http://localhost:8080/addmovietolibrary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
    });

    if (response.ok) {
        alert('Movie added to your library!');
    }
}

window.addEventListener('load', () => {
    showMovies();
});
