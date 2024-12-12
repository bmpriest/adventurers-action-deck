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

  function changeRes(title, newVal) {
    let copy = char.resource;
    for (let r of copy) {
      if (r.title == title) {r.curValue = newVal + 1}
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
  let assortment = 0
  if (char.resource !== undefined) { assortment = char.resource }


  if (assortment.length > 0) {
  render = assortment.map((resource, i) => {
    if (resource.number) {
      return (
        <div key={i} className="flex pb-2">
          <div className="grow">
          {resource.title} 
          </div>
          <div>{resource.curValue} / {resource.maxValue}</div>
        </div>
      )
    } else {
      return (
        <div key={i} className="flex flex-wrap items-center gap-2 mb-2">
          <div className="grow">
          {resource.title} 
          </div>
          <div className="rating flex flex-wrap">
            <input type="radio" name={resource.title + "-rating"} className="rating-hidden" checked={(resource.curValue <= 0)} onChange={() => changeRes(resource.title, -1)}/>
            {Array.from(Array(Number(resource.maxValue)), (e, i) => {
              return <input type="radio" name={resource.title + "-rating"} id={resource.title + "-" + (i+1)} className={"mask " + resource.shape} checked={valueCheck(resource.curValue, i)} key={i} onChange={() => changeRes(resource.title, i)}/>
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
    <div className="">
    {render}
    {/* <button className="btn btn-sm" onClick={setMax}>Reset Resources</button> */}
    </div>
  )
}