// onChangeSearch()

// api: http://www.omdbapi.com/?apikey=e404cb6f&

let allMovies = [];

function onChangeSearch(event) {
  allMovies = [];
  const query = event.target.value;
  const mainTitle = document.querySelector(".main__title");
  mainTitle.textContent = `Search results for "${query}"`;
  if (query.trim() === "") {
    mainTitle.textContent = "Search for a movie";
    const moviesList = document.querySelector(".movies__list");
    moviesList.innerHTML = `Please enter a search term.`;
    return;
  }
  const moviesList = document.querySelector(".movies__list");
  if (allMovies.length === 0) {
    moviesList.innerHTML = `
                <div class="movies__loading--spinner">
                <i class="fas fa-spinner"></i>
            </div>
    `;
    moviesList.classList.add("movies__loading");
  }
  setTimeout(() => {
    fetchMovies(query);
    moviesList.classList.remove("movies__loading");
  }, 1000);
}

// filtering movies

async function filterMovies(event) {
  const filterValue = event.target.value;
  if (allMovies.length === 0) {
    const moviesList = document.querySelector(".movies__list");
    moviesList.innerHTML = `No movies to filter. Please perform a search first.`;
  }

  let sortedMovies = [...allMovies];

  if (filterValue === "A TO Z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filterValue === "Z TO A") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (filterValue === "NEWEST TO OLDEST") {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (filterValue === "OLDEST TO NEWEST") {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  displayMovies(sortedMovies);
}

async function fetchMovies(query) {
  const movies = await fetch(
    `https://www.omdbapi.com/?apikey=e404cb6f&s=${query}`,
  );
  const moviesData = await movies.json();
  allMovies = moviesData.Search;
  displayMovies(allMovies);
}

function displayMovies(movies) {
  const moviesList = document.querySelector(".movies__list");
  const movieHTML = movies.map((movie) => renderMovieCard(movie)).join("");
  moviesList.innerHTML = movieHTML;
}

function renderMovieCard(movie) {
  return `
    <div class="movie-card">
                <img class="movie-card__poster" src="${movie.Poster}" alt="Movie Poster">
                <div class="movie-card__info">
                    <h3 class="movie-card__title">${movie.Title}</h3>
                    <p class="movie-card__year">${movie.Year}</p>
                    <p class="movie-card__type">${movie.Type}</p>
                </div>
            </div>`;
}

// Attach search handlers for the input and form submit (Enter key)
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

if (searchInput && searchForm) {
  searchInput.addEventListener("input", onChangeSearch);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onChangeSearch({ target: searchInput });
    }
    else if (searchInput.value.trim() === "") {
      const moviesList = document.querySelector(".movies__list");
      moviesList.innerHTML = `Please enter a search term.`;
    }
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (searchInput.value.trim() !== "") {
      onChangeSearch({ target: searchInput });
    }else {
      const moviesList = document.querySelector(".movies__list");
      moviesList.innerHTML = `Please enter a search term.`;
    }
  });
}

