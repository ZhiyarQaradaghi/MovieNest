async function showLibraryMovies() {
    try {
        const response = await fetch('http://localhost:8080/showlibrarymovies');
        const movies = await response.json();
        const moviesReversed = movies.filter(movie => movie.in_library === 1).reverse();
        const movieCardsContainer = document.querySelector('#movieCardsLibrary');
        movieCardsContainer.innerHTML = '';
        moviesReversed.forEach((movie, index) => {
            const imagePath = movie.image ? `http://localhost:8080/images/${movie.image}` : 'http://localhost:8080/images/default_image.jpg';

            if (index % 2 === 0) {
                movieCardsContainer.innerHTML += `<div class="row justify-content-center mb-4"></div>`;
            }
            const row = movieCardsContainer.querySelector('.row:last-child');
            row.innerHTML += `
                <div class="col-md-6 d-flex justify-content-center mb-4">
                    <div class="card h-100 text-center" style="width: 18rem;">
                        <img src="${imagePath}" class="card-img-top" alt="${movie.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">Description: ${movie.description}</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary view-details" onclick="window.location.href='movie-details.html?movieId=${movie.id}'">View Details</button>
                                <button class="btn btn-danger remove-movie" data-movie-id="${movie.id}">Remove from Library</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        document.querySelectorAll('.remove-movie').forEach(button => {
            button.addEventListener('click', async (event) => {
                const movieId = event.target.getAttribute('data-movie-id');
                await removeMovieFromLibrary(movieId);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', showLibraryMovies);

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

