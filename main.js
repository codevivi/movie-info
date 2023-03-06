"use strict";
const API_KEY = "?apikey=c9eedd0f";
const BASE_URL = "https://www.omdbapi.com/";
// const BASE_POSTER_URL = "http://img.omdbapi.com/";
let url = `${BASE_URL}${API_KEY}&s=titanic`;

async function fetchMovies(url) {
  const response = await fetch(url);
  console.log();
  const movies = await response.json();
  console.log(movies);
  return movies;
}
fetchMovies(url);
