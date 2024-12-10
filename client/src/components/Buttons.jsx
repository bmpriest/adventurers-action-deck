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
  const [result, setResult] = useState(0);

  let skillBonus = getBonus( Number(stats[action.attr]) ) + Number(character.prof)

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

  function rollToHit() {

  }

  function rollDmg() {

  }
  
  function useBtn() {
    if (processAction(action.type)) {
      console.log('Valid action!')
      if (action.useResource) {processResource(action.resource)};
    } else {
      console.log('Invalid action!')
    }


    // document.getElementById('my_modal_1').showModal()
  }

  function rollBtn() {
    document.getElementById('my_modal_2').showModal()
  }

  return (
    <>
    <div class ="card-actions justify-end">
      <button class="btn btn-primary" onClick={useBtn}>Attack!</button>
      <button class="btn btn-secondary" onClick={rollBtn}>Roll Damage!</button>
    </div>
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{action.name}!</h3>
        <p className="py-4">Rolled a {result} to attack!</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{action.name}!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
    </>
  )
}