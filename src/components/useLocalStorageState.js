import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key){
    // using a callback function as an initial state
    const [value, setValue] = useState(function() {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState ;
    });

    // localStorage effect
    useEffect(function(){
        localStorage.setItem(key, JSON.stringify(value));
    },[value, key]
    );

    return [value, setValue];
}

// here key was "watched" before but we wanted to make it resuable so insted of hardcoded "watched" 
// we passed it via arguments