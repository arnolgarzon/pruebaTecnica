import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '27f692fbf2de6808bd3243d9c33e070f'

  //Variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchkey] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [pageTitle, setPageTitle] = useState("POPULAR MOVIES");

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const { data: { results } } = await axios.get(`${API_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          sort_by: "popularity.desc",
        },
      });
      setMovies(results);
    };
    fetchPopularMovies();
  }, []);

  const fetchMovies = async (searchKey) => {
    if (searchKey) {
      setPageTitle(`Search results for "${searchKey}"`);
    } else {
      setPageTitle("POPULAR MOVIES");
    }
    const type = searchKey ? "search" : "discover";
    const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
  };

  const handleMovieClick = async (movieId) => {
    await fetchSelectedMovie(movieId);
  };

  //Funcion para obtener la informacion adicional de la pelicula
  const fetchSelectedMovie = async (movieId) => {
    const { data } = await axios.get(`${API_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    setSelectedMovie(data);
  };
    
  return (
    <div className='bg-black text-white'>
      <div className='scroll-ml-0.2 '>
      <input
        type="text"
        value={searchKey}
        onChange={(e) => setSearchkey(e.target.value)}
        className='text-black'
      />
      <button clasNames="bg-sky-500 hover:bg-sky-700 ..." onClick={() => fetchMovies(searchKey)}>Search</button>      
      </div>
      <div className='text-center'>
      <h1 className="text-4xl font-bold">{pageTitle}</h1>
      {Array.isArray(movies) ? (
        <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <span onClick={() => handleMovieClick(movie.id)}>{movie.title}</span>
            {selectedMovie && selectedMovie.id === movie.id && (
              <div>
                <p>Release Date: {selectedMovie.release_date}</p>
                <p>Overview: {selectedMovie.overview}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      
      ) : (
        <p>No movies to show</p>
      )}
      </div>
      
      </div>
  );
}

export default App;
