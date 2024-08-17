async function fetchMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    
    if (!movieId) {
        return;
    }

    const response = await fetch(`http://localhost:8080/movies/${movieId}`);
    const movie = await response.json();

    const directors = JSON.parse(movie.directors).map(director => `
        <p>Name: ${director.name}</p>
        <p>Age: ${director.age}</p>
        <p>Location: ${director.location}</p>
    `).join('<hr>');

    const cast = JSON.parse(movie.cast).map(castMember => `
        <p>Name: ${castMember.name}</p>
        <p>Age: ${castMember.age}</p>
        <p>Location: ${castMember.location}</p>
    `).join('<hr>');

    document.querySelector('#movie-details').innerHTML = `
        <h1>${movie.title}</h1>
        <img src="http://localhost:8080/images/${movie.image}" class="movie-image" alt="${movie.title}">
        <p>Description: ${movie.description}</p>
        <p>Release Year: ${movie.release_year}</p>
        <p>Genre: ${movie.genre}</p>
        <h2>Directors:</h2>
        ${directors}
        <h2>Cast:</h2>
        ${cast}
    `;

    showComments(movieId);
}

async function addComment() {
    const comment = document.querySelector('#comment').value;
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    
    if (comment.trim() === '') {
        document.querySelector('#validate').style.display = 'block';
        return; 
    } else {
        document.querySelector('#validate').style.display = 'none';
    }

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

addEventListener("load", fetchMovieDetails);
