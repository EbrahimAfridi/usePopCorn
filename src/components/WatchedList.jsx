import "./index.css";
import WatchedMovie from "./WatchedMovie";


export default function WatchedList({ watched, onDeleteWatched }){
  return(
    <ul className="list">
      {watched.map((movie) => (
       <WatchedMovie onDeleteWatched={onDeleteWatched} movie={movie} key={movie.imdbID}/>
      ))}
    </ul>
  )
}