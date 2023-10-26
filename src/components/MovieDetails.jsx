import {useEffect, useState, useRef } from "react";
import StarRating from "./StarRating.jsx";
import Loader from "./Loader.jsx";
import { useKey } from "./useKey";

const KEY = "4f1aa1c9";   //API KEY

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }){

  const [movieDetail, setMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
  console.log(isWatched);

  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Director: director,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Actors: actors,
    Genre: genre,

  } = movieDetail;

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      poster,
      title,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecision: countRef.current,
    };

    onAddWatched(newMovie);
    onCloseMovie();
  }

  useKey('Escape', onCloseMovie);     // custom hook

  useEffect(function() {

    async function getMovieDetails(){
      setIsLoading(true);

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);

      const data = await res.json();
      console.log(data);
      setMovieDetail(data);
      setIsLoading(false);
    }

    getMovieDetails();

  }, [selectedId]);

  useEffect(function(){
    if(!title) return;
    document.title = `Movie | ${title}`;

    return function(){
      document.title = "usePopcorn";
    }
  }, [title]);

// updating the countRef
  useEffect(function(){
    if(userRating) {
      countRef.current = countRef.current + 1;
    }
  },
  [userRating]
  );

  return(
    <div className="details">

      {
        isLoading ?

          <Loader/>

          :

          <>

            <header>

              <button className="btn-back" onClick={onCloseMovie}>

                &larr;

              </button>

              <img src={poster} alt={`Poster of ${movieDetail} movie`}/>

              <div className="details-overview">

                <h2>{title}</h2>

                <p>{released} &bull; {runtime}</p>

                <p>{genre}</p>

                <p> <span>⭐</span> {imdbRating} IMDb rating</p>

              </div>

            </header>

            <section>

              <div className="rating">

                { !isWatched ?

                  <>

                    <StarRating onSetRating={setUserRating} maxRating={10} size={24}/>

                    {/* onSetRating here is a propType which will take a func. or a state  */}

                    {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>}

                  </>

                  :

                  <p>You rated this movie {watchedUserRating} ⭐</p>

                }

              </div>

              <p> <em>{plot}</em> </p>

              <p>Staring {actors}</p>

              <p>Directed by {director}</p>

            </section>

          </>
        }

    </div>
  );
}