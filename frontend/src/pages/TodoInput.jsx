import { useEffect, useState } from "react";

const HandleClik = () => {
   const [IsNyala,  setIsNyala] = useState(0);

   useEffect (() => {
    document.title = `menghitnung: ${IsNyala}`;
   }, [IsNyala]);

   useEffect (() => {
    console.log("berhasil");
   }, []);

   const touchMe = () => {
    setIsNyala(e => e + 1)
   }

   return (
    <div>
      <p>
           hasil: {IsNyala}
      </p>

      <button onClick={touchMe}>
      Click Me
      </button>
    </div>
   )
}

export default HandleClik