"use strict";
// const BASE_POSTER_URL = "httpp://img.omdbapi.com/";
const API_KEY = "?apikey=c9eedd0f";
const BASE_URL = "https://www.omdbapi.com/";
const form = document.getElementById("search-form");
const pagination = document.querySelector(".pagination");
const moviesEl = document.querySelector(".movies");
const errorEl = document.querySelector(".error-msg");
const movieErrorEl = document.querySelector(".movie-error-msg");
const yearInput = document.getElementById("year");
const typeInput = document.getElementById("type");
const searchInput = document.getElementById("search");
const searchResultsEl = document.querySelector(".search-results");
const movieInfoEl = document.querySelector(".movie-info");
const movieInfoElements = {
  img: document.querySelector(".movie-about img"),
  rating: document.querySelector(".movie-about .rating"),
  title: document.querySelector(".movie-about .title"),
  genre: document.querySelector(".movie-about .genre"),
  plot: document.querySelector(".movie-about .plot"),
  director: document.querySelector(".movie-about .director"),
};
form.addEventListener("submit", getMovies);

async function getMovies(event, pageNum = 1) {
  console.log(event);

  event.preventDefault();
  let data;
  //reset elements
  moviesEl.innerHTML = "";
  errorEl.textContent = "";
  pagination.innerHTML = "";

  //reset elements
  //check inputs and construct url
  let s = searchInput.value.trim();
  if (!s) {
    e.target.reset();
    return;
  }
  s = "&s=" + s.replace(" ", "+");
  let y = yearInput.value ? "&y=" + yearInput.value : "";
  let type = typeInput.value ? "&type=" + typeInput.value : "";
  let page = !pageNum ? "" : "&page=" + pageNum;

  //check inputs and construct url
  try {
    data = await fetchMovies(BASE_URL + API_KEY + s + y + type + page);
  } catch (e) {
    errorEl.textContent = "Application failed";
    console.log(e);
    return;
  }
  if (!data) {
    errorEl.textContent = "Nothing found";
    return;
  }
  //if data render everything
  console.log(data);
  let pages = Math.ceil(data.totalResults / 10);
  let totalResults = data.Search.forEach((item) => {
    moviesEl.appendChild(createMovieEl(item));
  });
  pagination.innerHTML = `
  <button aria-label="Previous page"  onclick="getMovies(event, ${pageNum - 1})" class="pagination-button ${!pageNum || pageNum === 1 ? "disabled" : ""}">
  <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>
</button>
<span class="pagination-button disabled active">${pageNum}/${pages}</span>

<button aria-label="Next page" onclick="getMovies(event, ${pageNum + 1})" class="pagination-button ${pageNum === pages ? "disabled" : ""}">
  <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
</button>
  `;
}

async function fetchMovies(url) {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Application failed");
  }
  console.log(response);
  const data = await response.json();
  if (data.Response === "False") {
    return false;
  }
  console.log(data);
  return data;
}

async function showMovieInfo(event) {
  console.log(event.target.dataset.id);
  let id = event.target.dataset.id;
  let data;

  searchResultsEl.classList.add("hidden");
  movieInfoEl.classList.remove("hidden");
  try {
    data = await fetchMovies(BASE_URL + API_KEY + "&i=" + id);
  } catch (e) {
    movieErrorEl.textContent = "Application failed";
    return;
  }
  if (!data) {
    movieErrorEl.textContent = "No more data about movie";
  }
  console.log(data);

  if (!data.Poster || data.Poster !== "N/A") {
    movieInfoElements.img.src = data.Poster;
    if (movieInfoElements.img.classList.contains("hidden")) {
      movieInfoElements.img.classList.remove("hidden");
    }
  } else {
    movieInfoElements.img.classList.add("hidden");
  }
  movieInfoElements.rating.textContent = data.imdbRating;
  movieInfoElements.title.textContent = data.Title;
  movieInfoElements.genre.textContent = data.Genre + " " + data.Type;
  movieInfoElements.plot.textContent = data.Plot;
  movieInfoElements.director.textContent = data.Director;
}
function backToSearch() {
  searchResultsEl.classList.remove("hidden");
  movieInfoEl.classList.add("hidden");
}
function createMovieEl(movie) {
  let div = document.createElement("div");
  div.setAttribute("onclick", "showMovieInfo(event)");
  div.setAttribute("data-id", movie.imdbID);
  div.setAttribute("tabindex", 0); //to make focusable with tab
  div.classList.add("movie");
  let p = document.createElement("p");
  p.classList.add("movie-year");
  let year = movie.Year.trim();
  year = year.endsWith("–") ? year.slice(0, -1) : year;
  let pText = document.createTextNode(year);
  p.appendChild(pText);
  div.appendChild(p);
  if (movie.Poster) {
    let picture = document.createElement("picture");
    picture.classList.add("movie-img");
    let source = document.createElement("source");
    source.setAttribute("srcset", movie.Poster !== "N/A" ? movie.Poster : "./assets/img/placeholder.jpg");
    picture.appendChild(source);
    let img = document.createElement("img");
    img.setAttribute("src", "./assets/img/placeholder.jpg");
    img.setAttribute("alt", movie.Title);
    picture.appendChild(img);
    div.appendChild(picture);
  }
  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(movie.Title);
  h3.classList.add("movie-title");
  h3.classList.add("title");
  h3.appendChild(h3Text);
  div.appendChild(h3);
  return div;
}
