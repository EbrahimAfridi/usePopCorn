import Navbar from "./Navbar";
import Main from "./Main";
import "./index.css";
import Search from "./Search.jsx";
import NumResult from "./NumResult.jsx";
import {useEffect, useState} from "react";
import MovieList from "./MovieList.jsx";
import Box from "./Box.jsx";
import WatchedSummary from "./WatchedSummary.jsx";
import WatchedList from "./WatchedList.jsx";
import Loader from "./Loader.jsx";
import MovieDetails from "./MovieDetails.jsx";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "4f1aa1c9";   //API KEY

export default function PopCorn() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectId(id){
    setSelectedId((selectedId) => id === selectedId ? null : id);
  }

  function handleCloseMovie(){
    setSelectedId(null);
  }

  function handleAddWatched(movies){
    setWatched((watched) => [...watched, movies]);
  }

  function handleDeleteWatched(id) {
    console.log(watched);
    setWatched(watched => watched.filter((movie) => movie.imdbID !== id));
  //  filter means remove the one which satisfies the condition
    console.log("delete");
    console.log(watched);
  }

  //fetching API
  useEffect(function(){

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {signal: controller.signal});

        if(!res.ok) throw new Error("Something went wrong while fetching :( ");

        const data = await res.json();
        if(data.Response === "False") throw new Error("Movie not found");     // error message for movie not found

        setMovies(data.Search);
        setIsLoading(false);
      }
      catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError"){
            setError(err.message)
          }
      }
      finally {
        setIsLoading(false);
      }
    }

    if(query.length < 3){
      setMovies([]);
      setError("");
      return;
    }

    handleCloseMovie();
    fetchMovies();

    return function(){
      controller.abort();
    }

  }, [query]);

  return (
    <>

      {/*Component Composition NavBar and NumResult*/}
      <Navbar>
        <Search query={query} setQuery={setQuery}/>
        <NumResult movies={movies}/>
      </Navbar>

      {/*Component Composition ListBox and MovieList*/}
      <Main>
        <Box>
          {!isLoading && !error && <MovieList onSelectMovie={handleSelectId} movies={movies}/> }
          {isLoading && <Loader/>}
          {error && <ErrorMessage message={error}/>}
        </Box>

        <Box>
          {
            selectedId ?
              <MovieDetails watched={watched} onAddWatched={handleAddWatched} onCloseMovie={handleCloseMovie} selectedId={selectedId}/>
              :
              <>
                <WatchedSummary watched={watched}/>
                <WatchedList onDeleteWatched={handleDeleteWatched} watched={watched} />
              </>
          }
        </Box>
      </Main>

    </>
  );
}

function ErrorMessage({ message }){
  return(
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}