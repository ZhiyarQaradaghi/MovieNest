async function showLibraryMovies() {
    const response = await fetch('http://localhost:8080/showlibrarymovies');
    const movies = await response.json();
    const moviesReversed = movies.filter(movie => movie.in_library === 1).reverse();
    document.getElementById('movieCardsLibrary').innerHTML = '';

    moviesReversed.forEach(movie => {
        const imagePath = movie.image ? `http://localhost:8080/images/${movie.image}` : 'http://localhost:8080/images/default_image.jpg';
        const directors = JSON.parse(movie.directors).map(director => director.name).join(', ');
        const cast = JSON.parse(movie.cast).map(castMember => castMember.name).join(', ');

        document.getElementById('movieCardsLibrary').innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 text-center">
                    <img src="${imagePath}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">Description: ${movie.description}</p>
                        <p class="card-text">Release Year: ${movie.release_year}</p>
                        <p class="card-text">Genre: ${movie.genre}</p>
                        <p class="card-text">Directors: ${directors}</p>
                        <p class="card-text">Cast: ${cast}</p>
                        <button class="btn btn-primary edit-movie" data-movie-id="${movie.id}">Edit Movie Details</button>
                        <button class="btn btn-danger remove-movie" data-movie-id="${movie.id}">Remove from Library</button>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.edit-movie').forEach(button => {
        button.addEventListener('click', async (event) => {
            const movieId = event.target.getAttribute('data-movie-id');
            await loadMovieDetails(movieId);
        });
    });

    document.querySelectorAll('.remove-movie').forEach(button => {
        button.addEventListener('click', async (event) => {
            const movieId = event.target.getAttribute('data-movie-id');
            await removeMovieFromLibrary(movieId);
        });
    });
}

async function loadMovieDetails(movieId) {
    const response = await fetch(`http://localhost:8080/movies/${movieId}`);
    const movie = await response.json();

    document.getElementById('movieTitle').value = movie.title;
    document.getElementById('movieDescription').value = movie.description;
    document.getElementById('movieReleaseYear').value = movie.release_year;
    document.getElementById('movieGenre').value = movie.genre;
    document.getElementById('editMovieDirectors').value = JSON.parse(movie.directors).map(director => director.name).join(', ');
    document.getElementById('editMovieCast').value = JSON.parse(movie.cast).map(castMember => castMember.name).join(', ');
    document.getElementById('movieId').value = movie.id;

    new bootstrap.Modal(document.getElementById('editMovieModal')).show();
}

async function updateMovie() {
    const movieId = document.getElementById('movieId').value;

    await fetch(`http://localhost:8080/movies/${movieId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: document.getElementById('movieTitle').value,
            description: document.getElementById('movieDescription').value,
            release_year: document.getElementById('movieReleaseYear').value,
            genre: document.getElementById('movieGenre').value,
            directors: document.getElementById('editMovieDirectors').value.split(',').map(name => ({ name })),
            cast: document.getElementById('editMovieCast').value.split(',').map(name => ({ name }))
        })
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal'));
    modal.hide();
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    showLibraryMovies();
    
    document.getElementById('saveChangesBtn').addEventListener('click', async () => {
        await updateMovie();
    });
});

async function removeMovieFromLibrary(movieId) {
    const response = await fetch(`http://localhost:8080/removefromlibrary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieId })
    });

    if (response.ok) {
        location.reload(); 
    }
}
