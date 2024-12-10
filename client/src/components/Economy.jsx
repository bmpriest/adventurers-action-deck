import { useState, useEffect } from "react";

export default function Economy({ resources, setter }) {

  let initial = resources;



  function reset() {
    let resetted = [1, 2, 3];

    setter(resetted);
  }

  const populate = initial.map(val =>
    {switch(val) {
      case 1:
        return <div class="bg-info w-12 mask mask-circle"></div>;
      case 2:
        return <div class="bg-success w-12 mask mask-triangle-2"></div>;
      case 3:
        return <div class="bg-warning w-12 mask mask-star-2"></div>;
      case 10:
        return <div class="bg-base-300 w-12 mask mask-circle"></div>;
      case 20:
        return <div class="bg-base-300 w-12 mask mask-triangle-2"></div>;
      case 30:
        return <div class="bg-base-300 w-12 mask mask-star-2"></div>;
    }
  }

  )

  return (
    <>
        <div class="flex flex-row gap-10 content-center h-full">
          {populate}
          <div class="grow"></div>
          <div class="divider divider-horizontal"></div>
          <button class="btn btn-primary place-self-center" onClick={reset}>End Turn</button>
        </div>
    </>
  )
}