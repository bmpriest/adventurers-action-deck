import { useState } from "react";

export default function Resources({ char, setter }) {
  function setMax() {
    const copy = (char.resources || []).map((r) => ({
      ...r,
      curValue: r.maxValue,
    }));
    setter({ resources: copy });
  }

  function changeRes(title, newVal) {
    const copy = (char.resources || []).map((r) => {
      if (r.title === title) {
        return { ...r, curValue: newVal + 1 };
      }
      return r;
    });
    setter({ resources: copy });
  }

  function valueCheck(cV, i) {
    if (cV <= 0) return false;
    return cV === i + 1;
  }

  const resources = char.resources || [];

  if (resources.length === 0) return <div></div>;

  const render = resources.map((resource, i) => {
    if (resource.number) {
      return (
        <div key={i} className="flex pb-2">
          <div className="grow">{resource.title}</div>
          <div>
            {resource.curValue} / {resource.maxValue}
          </div>
        </div>
      );
    }
    return (
      <div key={i} className="flex flex-wrap items-center gap-2 mb-2">
        <div className="grow">{resource.title}</div>
        <div className="rating flex flex-wrap">
          <input
            type="radio"
            name={resource.title + "-rating"}
            className="rating-hidden"
            checked={resource.curValue <= 0}
            onChange={() => changeRes(resource.title, -1)}
          />
          {Array.from(Array(Number(resource.maxValue) || 0), (_, idx) => (
            <input
              type="radio"
              name={resource.title + "-rating"}
              id={resource.title + "-" + (idx + 1)}
              className={"mask " + resource.shape}
              checked={valueCheck(resource.curValue, idx)}
              key={idx}
              onChange={() => changeRes(resource.title, idx)}
            />
          ))}
        </div>
      </div>
    );
  });

  return <div>{render}</div>;
}
