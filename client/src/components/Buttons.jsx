import { useState, useEffect } from "react";
import PlaySpace from "./PlaySpace";



function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function rollDie(dice) {
  let dieNum = dice[0];
  let dieType = dice[1];
  let dieBonus = dice[2];
  let total = dieBonus;

  for (let i = 0; i < dieNum; i++) {
      total += getRandomIntInclusive(1, dieType);
  }

  return total;
}

function getBonus(num) {
  // 14 = 14 - 10 = 4 / 2 = +2
  // 8 = 8 - 10 = -2 /2 = -1
  let val = (num - 10) / 2
  return (val > 0) ? Math.floor(val) : Math.ceil(val);
}

export default function Buttons({ action, stats, character, updater, economy, setEconomy}) {
  const [results, setResults] = useState(0);
  const [picked, setPicked] = useState(0);
  const [hit, setHit] = useState({best: "", roll1: "", roll2: "", adv: false});
  const [hitBonus, setHitBonus] = useState(0);
  const [damage, setDamage] = useState({diceNum: "", diceType: "", bonus: "", damageType: ""})
  // const [damageDie, setDamageDie] = useState({id: "", d})

  function processAction(typ) {
    let data = [...economy]
    switch(typ) {
      case 'std':
        if (data[0] == 1) { data[0] = 10; } else {return false}
        break
      case 'bonus':
        if (data[1] == 2) { data[1] = 20; } else {return false}
        break
      case 'react':
        if (data[2] == 3) { data[2] = 30; } else {return false}
        break
      case 'multi':
      case 'free':
    }
    setEconomy(data);
    return true
  }

  function processResource(res) {
    let data = [...res]
    let charRes = character.resource
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < charRes.length; j++) {
        // console.log('From data: ' + data[i].title);
        // console.log('From charRes: ' + charRes[j].title)
        if (data[i].title == charRes[j].title) {
          // console.log('Match found at i:' + i + ' j:' + j)
          // console.log('Current value is: ' + charRes[j].curValue)
          if (data[i].bonus) 
            {charRes[j].curValue = charRes[j].curValue + data[i].value}
          else {
            {charRes[j].curValue = charRes[j].curValue - data[i].value}
          }
        }
      }
    }
    updater({ resource: charRes})
  }

  function updateHit(value) {
    return setHit((prev) => {
      return { ...prev, ...value };
    });
  }

  function toHitBonus() {
    if (isProficient) {
      return getBonus( Number(stats[action.attr]) ) + Number(character.prof);
    } else {
    return getBonus( Number(stats[action.attr]) )
  }}

  function rollToHit() {
    processAction(action.type)

    if (action.useResource) {processResource(action.resource)};
    let d1 = getRandomIntInclusive(1,20)
    let d2 = getRandomIntInclusive(1,20)
    let hitBonus = toHitBonus();
    
    // setHitBonus
    let best;
    // console.log('best is' + best)
    updateHit({roll1: d1, roll2: d2})
    if (hit.adv) {
      best = (d1 >= d2) ? d1 + hitBonus : d2 + hitBonus;
      } else {
      best = d1 + hitBonus;
    }
    updateHit({best: best})
    setHitBonus(hitBonus);
  }

  function toggleAdv(e) {
    setHit({...hit, adv: e.target.checked })
    if (e.target.checked) {
      document.getElementById('advDie').classList.remove('hidden');
    } else {
      document.getElementById('advDie').classList.add('hidden')
    }
  }

  function useBtn() {
    // console.log(action)
    let modalId = 'action_modal_' + action.id

    document.getElementById(modalId).showModal()
  }
  
  function hitBtn() {
    if (processAction(action.type)) {
      console.log('Valid action!')
      if (action.useResource) {processResource(action.resource)};
    } else {
      console.log('Invalid action!')
    }
  }

  
  let totals = action.damage
  const selections = totals.map((val, i) => {
    return (
    <option key={i} className="" value={i}> 
      {val.diceNum}d{val.diceType} + {val.bonus} {val.damageType}
    </option>
    )
  })
  // const populate = initial.map((val, i) =>
    // case 1:
    //     return <div key={i} className="bg-info w-12 mask mask-circle"></div>;

  const dmgSelections = () => {
 
    console.log('selections has been invoked!')
    let dmgs = damage
    
    let totalDmg = []
    totalDmg = dmgs.map((dmg, i) => {
        <option key={i} className="" value={i}> 
          {dmg.diceNum}d{dmg.diceType} + {dmg.bonus} {dmg.damageType}
        </option>
    }
  )
    return <>{totalDmg}</>
}
  
  function pickDmg(e) {
    let selected = action.damage[e.target.value]
    setPicked(selected)
    setDamage(selected)
  }
  
function dmgDice() {
    let dmg = damage
    console.log('here\'s dmg: ')
    console.log(dmg.diceNum)
    console.log(dmg.diceType)
    let dice = new Array( Number(dmg.diceNum) )

    for (let i = 0; i < dice.length; i++) {  
      switch(dmg.diceType) {
        case '20':
           dice[i] = <div className="p-4 bg-accent text-accent-content mask mask-hexagon">20</div>;
           break;
        case '12':
          dice[i] = <div className="p-4 bg-accent text-accent-content mask mask-decagon">12</div>;
          break;
        case '10':
          dice[i] = <div className="p-4 bg-accent text-accent-content mask mask-hexagon-2">10</div>;
          break;
        case '8':
          dice[i] = <div className="p-4 bg-accent text-accent-content mask mask-diamond">8</div>;
          break;
        case '6':
          dice[i] = <div className="p-4 bg-accent text-accent-content mask mask-squircle">6</div>;
          break;
        case '4':
          dice[i] = <div className="p-4 pb-2 bg-accent text-accent-content mask mask-triangle">4</div>;
          break;
      }
    }
   
    return (
      <>
      {dice}
      <div className="p-2 bg-accent text-accent-content mask mask-squircle">+ {dmg.bonus}</div>
      </>
    )
  
}


  return (
    <>
    <div className="flex justify-end"><button className="btn btn-primary" onClick={()=> useBtn()}>Use!</button></div>
    <dialog id={"action_modal_" + action.id} className="modal">
      <div className="modal-box gap-2">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="">
          <h3 className="font-bold text-lg">{action.title}!</h3>
        </div>
        <div className="grid grid-cols-4 grid-rows-6">
          <div className="row-start-1 col-start-1 text-lg">
            To hit:
          </div>
          <div className="row-start-2 row-span-2 col-start-1 font-bold text-xl text-center rounded-lg outline outline-2 ml-4 mr-4 mb-2">
            <div className="mt-6">{hit.best}</div>
          </div>
          <div className="row-start-1 col-start-3 row-span-2 place-content-center w-16 bg-accent mask mask-hexagon">
            <div id="hitDie" className="text-center text-accent-content font-bold text-xl">
              {hit.roll1}
            </div>
          </div>
          <div id="advDie" className="row-start-1 col-start-4 row-span-2 place-content-center w-16 bg-accent mask mask-hexagon hidden">
            <div className="text-center text-accent-content font-bold text-xl">
              {hit.roll2}
            </div>
          </div>
          <div id="toHitBonus" className="row-start-1 col-start-5 row-span-2 place-content-center w-16 bg-accent mask mask-squircle">
            <div className="text-center text-accent-content font-bold text-xl">
              + {hitBonus}
            </div>
          </div>
          <div className="row-start-4 col-start-1 text-lg">
            Damage:
          </div>
          <div className="row-start-5 row-span-2 col-start-1 font-bold text-xl text-center rounded-lg outline outline-2 ml-4 mr-4 mb-2">
            <div className="mt-6">{results}</div>
          </div>
          <select class="row-start-4 col-start-2 col-end-5 select select-bordered" onChange={(e) => pickDmg(e)}>
            <option disabled value="1">Pick your damage</option>
            {selections}
          </select>
          <div className="flex flex-row flex-wrap row-start-5 row-end-7 col-start-2 col-end-5 gap-2 text-center items-center justify-center font-bold">
            {dmgDice()}

          </div>



        </div>
        <div className="card-actions flex justify-end items-center">
          <label class="label cursor-pointer grow">
            <span class="label-text">Advantage?</span>
            <input 
              type="checkbox" 
              className="toggle" 
              name="hasAdvantage"
              id="hasAdvantage"
              value={hit.adv}
              onChange={(e) => toggleAdv(e)}
              
            />
          </label>
          <button className="btn btn-primary" onClick={() => rollToHit()}>Attack!</button>
          <button className="btn btn-secondary" onClick={() => console.log(action.damage)}>Roll Damage!</button>
        </div>
      </div>
    </dialog>
    </>
  )
}