import { useRef } from "react";
import "./index.css";
import { useKey } from "./useKey";

export default function Search({ query, setQuery }) {

  const inputElement = useRef(null);  //usually set to null for DOM manipulation

  useKey("Enter", "Space", function(){
    if(document.activeElement === inputElement.current) return;
    inputElement.current.focus();
    setQuery("");
  });

  return(
    <input
      ref={inputElement}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}