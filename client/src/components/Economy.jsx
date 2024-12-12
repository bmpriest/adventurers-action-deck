import { useState, useEffect } from "react";

export default function Economy({ resources, setter }) {

  let initial = resources;



  function reset() {
    let resetted = [1, 2, 3];

    setter(resetted);
  }

  const populate = initial.map((val, i) =>
    {switch(val) {
      case 1:
        return <div key={i} className="bg-info w-12 mask mask-circle"></div>;
      case 2:
        return <div key={i} className="bg-success w-12 mask mask-triangle-2"></div>;
      case 3:
        return <div key={i} className="bg-warning w-12 mask mask-star-2"></div>;
      case 10:
        return <div key={i} className="bg-base-300 w-12 mask mask-circle"></div>;
      case 20:
        return <div key={i} className="bg-base-300 w-12 mask mask-triangle-2"></div>;
      case 30:
        return <div key={i} className="bg-base-300 w-12 mask mask-star-2"></div>;
    }
  }

  )

  return (
    <>
        <div className="flex flex-row gap-4 content-center h-full">
          {populate}
          <div className="grow"></div>
          <div className="divider divider-horizontal"></div>
          <button className="btn btn-primary place-self-center" onClick={reset}>End Turn</button>
          {/* <button className="btn btn-circle w-24"><span className="material-icons">edit_square</span></button>
          <button className="material-icons">edit_square</button> */}
        </div>
    </>
  )
}