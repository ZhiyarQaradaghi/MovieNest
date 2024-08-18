function loadMovieDetails() {
    const movieId = new URLSearchParams(window.location.search).get('movieId'); 

    if (!movieId) return;

    fetch(`/movies/${movieId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('movie-title').textContent = data.title || 'N/A';
            document.getElementById('movie-description').textContent = data.description || 'N/A';
            document.getElementById('movie-release-year').textContent = data.release_year || 'N/A';
            document.getElementById('movie-genre').textContent = data.genre || 'N/A';

            const movieImage = document.getElementById('movie-image');
            movieImage.src = data.image ? `http://localhost:8080/images/${data.image}` : 'http://localhost:8080/images/default-image.jpg'; 

            const directors = JSON.parse(data.directors || '[]');
            const cast = JSON.parse(data.cast || '[]');
            populateList('directors-list', directors);
            populateList('cast-list', cast);

            populateEditForm(data);
        })
        .catch(() => {});
}

function populateEditForm(data) {
    document.getElementById('movieTitle').value = data.title || '';
    document.getElementById('movieDescription').value = data.description || '';
    document.getElementById('movieReleaseYear').value = data.release_year || '';
    document.getElementById('movieGenre').value = data.genre || '';
    document.getElementById('movieId').value = data.id || '';
}

async function saveChanges() {
    const movieIdElement = document.getElementById('movieId');
    const titleElement = document.getElementById('movieTitle');
    const descriptionElement = document.getElementById('movieDescription');
    const releaseYearElement = document.getElementById('movieReleaseYear');
    const genreElement = document.getElementById('movieGenre');
    const movieId = movieIdElement.value;
    const title = titleElement.value;
    const description = descriptionElement.value;
    const releaseYear = releaseYearElement.value;
    const genre = genreElement.value;
    const existingMovieResponse = await fetch(`/movies/${movieId}`);
    const existingMovieData = await existingMovieResponse.json();
    const directors = existingMovieData.directors || '[]';
    const cast = existingMovieData.cast || '[]';
    const response = await fetch(`/movies/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title,
            description,
            release_year: releaseYear,
            genre,
            directors,
            cast 
        })
    });

    if (response.ok) {
        alert('Movie details updated successfully!');
        loadMovieDetails();
    } else {
        alert('Failed to update movie details');
    }
}

function populateList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ''; 

    if (Array.isArray(items) && items.length > 0) {
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} (Age: ${item.age}, Country: ${item.country})`;
            listElement.appendChild(listItem);
        });
    } else {
        listElement.textContent = 'No data available.';
    }
}

async function addComment() {
    const comment = document.querySelector('#comment').value;
    const movieId = new URLSearchParams(window.location.search).get('movieId');
    if (comment.trim() === '') {
        document.querySelector('#validate').style.display = 'block';
        return; 
    } 

    document.querySelector('#validate').style.display = 'none';
    const timestamp = new Date().toLocaleString();
    const commentWithTimestamp = `${timestamp}: ${comment}`;

    await fetch('http://localhost:8080/comment', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({ movieId, comment: commentWithTimestamp })
    });
    document.querySelector('#comment').value = '';
    showComments(movieId);
}

async function showComments(movieId) {
    const response = await fetch(`http://localhost:8080/comments/${movieId}`);
    const data = await response.json();

    const commentsHTML = data.comments.map(comment => {
        const [timestamp, ...commentText] = comment.split(': ');
        return `
            <div class="card text-center" style="margin: 25px;">
                <div class="card-body"> 
                    <p class="card-text">${commentText.join(': ')}</p>
                    <small class="text-muted">${timestamp}</small>
                </div>
            </div>
        `;
    }).join('');

    document.querySelector('#comments').innerHTML = commentsHTML;
}

document.getElementById('editMovieForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    saveChanges(); 
});

document.getElementById('submit-comment').addEventListener('click', addComment);

const movieId = new URLSearchParams(window.location.search).get('movieId');
if (movieId) {
    loadMovieDetails();
    showComments(movieId);
}
