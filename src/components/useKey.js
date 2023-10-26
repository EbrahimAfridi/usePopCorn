import { useEffect } from "react";

export function useKey(key1, key2, action){

  //Esc key and Space key listener
  useEffect(function (){

    function callback(e){
      if(e.code.toLowerCase() === key1.toLowerCase() || e.code.toLowerCase() === key2.toLowerCase()){
       	action();
      }
		}

    document.addEventListener("keydown", callback)

    return function() {
      document.removeEventListener("keydown", callback);
    }

	}, [action, key1, key2])
}