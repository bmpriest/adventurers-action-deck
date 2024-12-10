import { useState, useEffect } from "react";



export default function Resources({ char, setter }) {
  // console.log('char resource is: ')
  // console.log(char.resource)

  function setMax() {
    let copy = char.resource;
    for (let i = 0; i < copy.length; i++) {
      copy[i].curValue = copy[i].maxValue;
    }
    setter(copy)
  }

  function valueCheck(cV, i) {
    // i starts at 0 for the 'first' so on up to maxValue - 1
    if (cV <= 0) {
      return false;
    } else {
      return (cV == (i + 1))
    }
  }
  let render = ''

  try {
  let assortment = char.resource

  if (assortment.length > 0) {
  render = assortment.map(resource => {
    if (resource.number) {
      return (
        <div class="flex pb-2">
          <div class="grow">
          {resource.title} 
          </div>
          <div>{resource.curValue} / {resource.maxValue}</div>
        </div>
      )
    } else {
      return (
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <div class="grow">
          {resource.title} 
          </div>
          <div class="rating flex flex-wrap">
            <input type="radio" name={resource.title + "-rating"} class="rating-hidden" checked={(resource.curValue <= 0)}/>
            {Array.from(Array(Number(resource.maxValue)), (e, i) => {
              return <input type="radio" name={resource.title + "-rating"} id={resource.title + "-" + (i+1)} class={"mask " + resource.shape} checked={valueCheck(resource.curValue, i)} key={i} />
            })}
          </div>
        </div>
      )
    }
  })
  }
  }
  catch(err) {
    console.error(err);
}

  return (
    <div class="">
    {render}
    <button class="btn btn-sm" onClick={setMax}>Reset Resources</button>
    </div>
  )
}