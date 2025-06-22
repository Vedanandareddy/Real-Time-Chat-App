import { create } from "zustand";


export const  useThemeStore=create((set)=>({
    theme:localStorage.getItem("chat-theme")|| "cupcake", // checking if there is theme set in the localstorage else go with default light
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme)
        set({theme})
    }
}))


// this makes the theme persist even after a refresh or a logout 