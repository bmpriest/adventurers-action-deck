import { useState } from "react";

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(
    Math.random() * (maxFloored - minCeiled + 1) + minCeiled
  );
}

function rollDie(dice) {
  const [dieNum, dieType, dieBonus] = dice;
  let total = dieBonus;
  for (let i = 0; i < dieNum; i++) {
    total += getRandomIntInclusive(1, dieType);
  }
  return total;
}

export default function Buttons({
  action,
  character,
  updateChar,
  economy,
  setEconomy,
}) {
  const [results, setResults] = useState(0);
  const [picked, setPicked] = useState(0);
  const [hit, setHit] = useState({
    best: "",
    roll1: "",
    roll2: "",
    adv: false,
  });
  const [hitBonus, setHitBonus] = useState(0);
  const [damage, setDamage] = useState({
    diceNum: "",
    diceType: "",
    bonus: "",
    damageType: "",
  });

  function processAction(typ) {
    const data = [...economy];
    switch (typ) {
      case "std":
        if (data[0] === 1) data[0] = 10;
        else return false;
        break;
      case "bonus":
        if (data[1] === 2) data[1] = 20;
        else return false;
        break;
      case "react":
        if (data[2] === 3) data[2] = 30;
        else return false;
        break;
      case "multi":
      case "free":
        break;
    }
    setEconomy(data);
    return true;
  }

  function processResource(res) {
    const data = [...res];
    const charRes = [...(character.resources || [])];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < charRes.length; j++) {
        if (data[i].title === charRes[j].title) {
          if (data[i].bonus) {
            charRes[j] = {
              ...charRes[j],
              curValue: charRes[j].curValue + data[i].value,
            };
          } else {
            charRes[j] = {
              ...charRes[j],
              curValue: charRes[j].curValue - data[i].value,
            };
          }
        }
      }
    }
    updateChar({ resources: charRes });
  }

  function updateHit(value) {
    setHit((prev) => ({ ...prev, ...value }));
  }

  function toHitBonus() {
    const abilityBonus = character[`${action.attr}Bonus`] ?? 0;
    const prof = action.isProficient ? (character.proficiencyBonus ?? 0) : 0;
    return abilityBonus + prof;
  }

  function rollToHit() {
    processAction(action.type);
    if (action.useResource) processResource(action.resource);

    const d1 = getRandomIntInclusive(1, 20);
    const d2 = getRandomIntInclusive(1, 20);
    const bonus = toHitBonus();

    updateHit({ roll1: d1, roll2: d2 });

    let best;
    if (hit.adv) {
      best = (d1 >= d2 ? d1 : d2) + bonus;
    } else {
      best = d1 + bonus;
    }
    updateHit({ best: best });
    setHitBonus(bonus);
  }

  function toggleAdv(e) {
    setHit({ ...hit, adv: e.target.checked });
    if (e.target.checked) {
      document.getElementById("advDie").classList.remove("hidden");
    } else {
      document.getElementById("advDie").classList.add("hidden");
    }
  }

  function useBtn() {
    const modalId = "action_modal_" + action.id;
    document.getElementById(modalId).showModal();
  }

  function hitBtn() {
    if (processAction(action.type)) {
      if (action.useResource) processResource(action.resource);
    }
  }

  const totals = action.damage;
  const selections = totals.map((val, i) => (
    <option key={i} value={i}>
      {val.diceNum}d{val.diceType} + {val.bonus} {val.damageType}
    </option>
  ));

  function pickDmg(e) {
    const selected = action.damage[e.target.value];
    setPicked(selected);
    setDamage(selected);
  }

  function dmgDice() {
    const dmg = damage;
    const dice = new Array(Number(dmg.diceNum) || 0);

    for (let i = 0; i < dice.length; i++) {
      switch (String(dmg.diceType)) {
        case "20":
          dice[i] = (
            <div key={i} className="p-4 bg-accent text-accent-content mask mask-hexagon">
              20
            </div>
          );
          break;
        case "12":
          dice[i] = (
            <div key={i} className="p-4 bg-accent text-accent-content mask mask-decagon">
              12
            </div>
          );
          break;
        case "10":
          dice[i] = (
            <div key={i} className="p-4 bg-accent text-accent-content mask mask-hexagon-2">
              10
            </div>
          );
          break;
        case "8":
          dice[i] = (
            <div key={i} className="p-4 bg-accent text-accent-content mask mask-diamond">
              8
            </div>
          );
          break;
        case "6":
          dice[i] = (
            <div key={i} className="p-4 bg-accent text-accent-content mask mask-squircle">
              6
            </div>
          );
          break;
        case "4":
          dice[i] = (
            <div key={i} className="p-4 pb-2 bg-accent text-accent-content mask mask-triangle">
              4
            </div>
          );
          break;
      }
    }

    return (
      <>
        {dice}
        <div className="p-2 bg-accent text-accent-content mask mask-squircle">
          + {dmg.bonus}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={() => useBtn()}>
          Use!
        </button>
      </div>
      <dialog id={"action_modal_" + action.id} className="modal">
        <div className="modal-box gap-2">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div>
            <h3 className="font-bold text-lg">{action.title}!</h3>
          </div>
          <div className="grid grid-cols-4 grid-rows-6">
            <div className="row-start-1 col-start-1 text-lg">To hit:</div>
            <div className="row-start-2 row-span-2 col-start-1 font-bold text-xl text-center rounded-lg outline outline-2 ml-4 mr-4 mb-2">
              <div className="mt-6">{hit.best}</div>
            </div>
            <div className="row-start-1 col-start-3 row-span-2 place-content-center w-16 bg-accent mask mask-hexagon">
              <div
                id="hitDie"
                className="text-center text-accent-content font-bold text-xl"
              >
                {hit.roll1}
              </div>
            </div>
            <div
              id="advDie"
              className="row-start-1 col-start-4 row-span-2 place-content-center w-16 bg-accent mask mask-hexagon hidden"
            >
              <div className="text-center text-accent-content font-bold text-xl">
                {hit.roll2}
              </div>
            </div>
            <div
              id="toHitBonus"
              className="row-start-1 col-start-5 row-span-2 place-content-center w-16 bg-accent mask mask-squircle"
            >
              <div className="text-center text-accent-content font-bold text-xl">
                + {hitBonus}
              </div>
            </div>
            <div className="row-start-4 col-start-1 text-lg">Damage:</div>
            <div className="row-start-5 row-span-2 col-start-1 font-bold text-xl text-center rounded-lg outline outline-2 ml-4 mr-4 mb-2">
              <div className="mt-6">{results}</div>
            </div>
            <select
              className="row-start-4 col-start-2 col-end-5 select select-bordered"
              onChange={(e) => pickDmg(e)}
            >
              <option disabled value="1">
                Pick your damage
              </option>
              {selections}
            </select>
            <div className="flex flex-row flex-wrap row-start-5 row-end-7 col-start-2 col-end-5 gap-2 text-center items-center justify-center font-bold">
              {dmgDice()}
            </div>
          </div>
          <div className="card-actions flex justify-end items-center">
            <label className="label cursor-pointer grow">
              <span className="label-text">Advantage?</span>
              <input
                type="checkbox"
                className="toggle"
                name="hasAdvantage"
                id="hasAdvantage"
                value={hit.adv}
                onChange={(e) => toggleAdv(e)}
              />
            </label>
            <button
              className="btn btn-primary"
              onClick={() => rollToHit()}
            >
              Attack!
            </button>
            <button className="btn btn-secondary">Roll Damage!</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
