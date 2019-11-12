const addMovieModal = document.getElementById("add-modal");
const startAddMovieButton = document.querySelector("header button");
const backdrop = document.getElementById("backdrop");
const cancelAddMovieButton = document.querySelector(
  ".modal__actions .btn.btn--passive "
);
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll("input");
const entryTextSection = document.getElementById('entry-text')
const deleteMovieModal = document.getElementById('delete-modal');
const fetchButton = document.querySelector('header .btn')


let movies = []

const updateUI = () => {
    if(movies.length === 0) {
        entryTextSection.style.display = 'block';
    } else {
        entryTextSection.style.display = 'none';
    }
}

const closeMovieDeletionModal = () => {
    toggleBackdrop();
    deleteMovieModal.classList.remove('visible');
}

const deleteMovie = (id) => {
    let movieIndex = 0;
    for(let movie of movies) {
        if(movie.id === id) break;
        movieIndex++;
    }
    movies.splice(movieIndex, 1);
    const listRoot = document.getElementById('movie-list');
    listRoot.children[movieIndex].remove();
    closeMovieDeletionModal();
}

const deleteMovieHandler = (id) => {
    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
    const cancelDeletionButton = deleteMovieModal.querySelector('.btn--passive');
    let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

    confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true))

    confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

    // confirmAddMovieButton.removeEventListener('click')
    confirmDeletionButton.removeEventListener('click', closeMovieDeletionModal )
    cancelDeletionButton.addEventListener('click', closeMovieDeletionModal);
    confirmDeletionButton.addEventListener('click', deleteMovie.bind(null, id))
}

const storeMovie = (id, title, imageUrl, rating) => {
    const movie = {
        id, 
        title,
        imageUrl, 
        rating
    }
    let storedMovies = JSON.parse(localStorage.getItem('movies'));
    if(!storedMovies) {
        storedMovies = [movie]
    } else {
        const foundMovie =  storedMovies.find(movie => movie.id === id)
        if(foundMovie) return alert('Movie is already stored.')
        storedMovies = [ ...storedMovies, movie ]
    }
    localStorage.setItem('movies', JSON.stringify(storedMovies))
    alert('Movie was stored successfully...')
}

const renderNewMovieElement = (id, title, imageUrl, rating) => {
    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element';
    newMovieElement.innerHTML = `
        <div class="movie-element__image">
            <img src="${imageUrl}" alt="${title}" />
        </div>
        <div class="movie-element__info">
            <h2> ${title} </h2>
            <p> ${rating} / 5 star </p>
        </div>
        <div class="movie-element__buttons">
            <button class="btn btn--passive"> Store Movie </button>
            <button class="btn btn--danger"> Delete Movie </button>
        </div>
    `;
    newMovieElement.querySelector(".movie-element__buttons .btn.btn--danger").addEventListener('click', deleteMovieHandler.bind(null, id));
    newMovieElement.querySelector(".movie-element__buttons .btn.btn--passive").addEventListener('click', storeMovie.bind(null, id, title, imageUrl, rating ) )
    const listRoot = document.getElementById('movie-list');
    listRoot.appendChild(newMovieElement);
}

const clearMovieInput = () => {
    for(const userInput of userInputs) {
        userInput.value = '';
    }
}

const showMovieModal = () => {
  addMovieModal.classList.add("visible");
  toggleBackdrop();
};

const toggleBackdrop = () => {
  backdrop.classList.toggle("visible");
};

const cancelAddMovieHandler = () => {
  closeMovieModal();
  toggleBackdrop();
  clearMovieInput()
};

const closeMovieModal = () => {
    addMovieModal.classList.remove('visible');
}

const backdropClickHandler = () => {
  closeMovieModal();
  closeMovieDeletionModal();
  clearMovieInput();
};


const addMovieHandler = () => {
  const titleValue = userInputs[0].value;
  const imageUrlValue = userInputs[1].value;
  const ratingValue = userInputs[2].value;

  if (
    titleValue.trim() === "" ||
    imageUrlValue.trim() === "" ||
    ratingValue.trim() === "" ||
    +ratingValue < 1 ||
    +ratingValue > 5
  ) {
      alert('Please enter valid values (rating between 1 and 5)')
      return;
  }
  
  const newMovie = {
      id: Math.random().toString(),
      title: titleValue,
      image: imageUrlValue,
      rating: ratingValue
  }

  movies.push(newMovie)
  console.log(movies);
  closeMovieModal();
  clearMovieInput();
  toggleBackdrop();
  renderNewMovieElement(newMovie.id, newMovie.title, newMovie.image, newMovie.rating);
  updateUI()
};

const fetchMoviesHandler = () => {
    const fetchMovies =  JSON.parse(localStorage.getItem('movies'));
    if(!fetchMovies) return alert('No movies found') 
    movies = [...fetchMovies];
    
}

startAddMovieButton.addEventListener("click", showMovieModal);
backdrop.addEventListener("click", backdropClickHandler);
cancelAddMovieButton.addEventListener("click", cancelAddMovieHandler);
confirmAddMovieButton.addEventListener("click", addMovieHandler);
fetchButton.addEventListener('click', fetchMoviesHandler)