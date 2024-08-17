async function addMovie(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', document.querySelector('#title').value);
    formData.append('description', document.querySelector('#description').value);
    formData.append('release_year', document.querySelector('#release_year').value);
    formData.append('genre', document.querySelector('#genre').value);
    formData.append('mov_directors', document.querySelector('#mov_directors').value);
    formData.append('mov_cast', document.querySelector('#mov_cast').value);
    formData.append('image', document.querySelector('#image').files[0]);

    const response = await fetch('http://localhost:8080/addMovie', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Done! The values are inserted into the database.');
        document.querySelector('#addMovieForm').reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#addMovieForm');
    form.addEventListener('submit', addMovie);
});
