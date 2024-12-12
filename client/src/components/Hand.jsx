import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import Buttons from './Buttons'
import Card from './Card'

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

  for (i = 0; i < dieNum; i++) {
      total += getRandomIntInclusive(1, dieType);
  }

  return total;
}

class Stats {
  constructor(str, dex, con, inte, wis, cha, maxHP, curHP, tempHP, ac, init, prof, speed, hitDie) {
		this.str = str;
		this.dex = dex;
		this.con = con;
		this.inte = inte;
		this.wis = wis;
		this.cha = cha;
		this.maxHP = maxHP;
		this.curHP = curHP;
		this.tempHP = tempHP;
		this.ac = ac;
		this.init = init;
		this.prof = prof;
		this.speed = speed;
		this.hitDie = hitDie;
	}
}

function buildChar( character ) {
  return new Stats(
    character.str, 
    character.dex, 
    character.con, 
    character.inte, 
    character.wis, 
    character.cha, 
    character.maxHP,
    character.maxHP,
    0,
    character.ac,
    character.init,
    character.prof,
    character.speed,
    character.hitDie
  )
}

function getBonus(num) {
  // 14 = 14 - 10 = 4 / 2 = +2
  // 8 = 8 - 10 = -2 /2 = -1
  let val = (num - 10) / 2
  return (val > 0) ? Math.floor(val) : Math.ceil(val);
}


export default function Hand({ character, updateChar, activeDeck, updateDeck, economy, setEconomy}) {
  let statBlock = buildChar(character)

  let myHand = activeDeck
  // console.log('printing active hand: ')
  // console.log(hand)
  // console.log(hand.length)
  let actionCards = [];

  function removeCard(index) {
    let data = [...activeDeck];
    data.splice(index, 1);
    updateDeck(data, true);
  }

  function actionIcon(type) {
    switch(type) {
      case 'std':
        return <div className="bg-info w-8 mask mask-circle"></div>;
      case 'bonus':
        return <div className="bg-success w-8 mask mask-triangle-2"></div>;
      case 'react':
        return <div className="bg-warning w-8 mask mask-star-2"></div>;
      case 'free':
      case 'multi':
        return <div className="bg-base-content w-8 mask mask-circle"></div>;
    }
  }

  function cardToHit(attr, isProficient) {
    if (isProficient) {
      return <><div className="flex flex-row justify-between"><div>To hit:</div> <div>+{getBonus( Number(statBlock[attr]) ) + Number(statBlock.prof)} ({attr})</div></div></>
    } else {
      return <><div className="flex flex-row justify-between"><div>To hit:</div> <div>+{getBonus( Number(statBlock[attr]) )} ({attr})</div></div></>
    }
  }

  function cardDamage(dmgs) {
    let totalDmg = []
    totalDmg = dmgs.map((dmg, i) => {
      if (i == 0) {
        return (
        <div key={i} className="flex flex-row justify-between"> 
          <div>Damage:</div> 
          <div>{dmg.diceNum}d{dmg.diceType} + {dmg.bonus} {dmg.damageType} </div>
        </div>
        )
      } else {
        return <div key={i} className="flex justify-end">{dmg.diceNum}d{dmg.diceType} + {dmg.bonus} {dmg.damageType}</div>
      }
    })
    return <>{totalDmg}</>
  }

  function cardRes(ress) {
    let totalRes = []
    try {
      totalRes = ress.map((res, i) => {
        if (i == 0) {
          return (
          <div key={i} className="flex flex-row justify-between"> 
            <div>Resource:</div> 
            <div>{res.title} {res.bonus} {res.value}</div> 
          </div>
          )
        } else {
          return <div key={i} className="flex justify-end">  {res.title} {res.bonus} {res.value}</div>
        }
      })
    } catch(err) {
      console.log('Could not print resources on card.')
    }
    return <>{totalRes}</>
  }

  function editCard(index) {
    let cardId = 'modal_card_' + index
    document.getElementById(cardId).showModal()
  }

  if (myHand.length > 0) {
  actionCards = myHand.map(card =>
    <div key={card.id} className={card.id + " card bg-neutral w-80 shadow-xl flex flex-column "}>
      <div className="card-body justify-between pb-6">
        <div className="flex gap-2 pb-4">
          {actionIcon(card.type)}
          <h2 className="text-center grow card-title">{card.title}</h2>
          <div name="hidey" className="join hidden">
            <button className="join-item btn btn-square" onClick={() => editCard(card.id)}><span className="material-icons">edit_square</span></button>
            <button className="join-item btn btn-square" onClick={() => removeCard(card.id)}><span className="material-icons">delete</span></button>
          </div>
        </div>
        <div className="grow">
          <div className="rounded bg-base-100 min-h-16 p-2 ">
            {card.description}
          </div>
          <br></br>
          <div>
            {cardToHit(card.attr, card.isProficient)}
          </div>
          <div>
            {cardDamage(card.damage)}
          </div>
          <div>
            {cardRes(card.resource)}
          </div>
          {/* <p>DMG: {card.damage[0]}D{card.damage[1]} + {card.damage[2]} {card.dmgType}</p> */}
      </div>
      <div className="">
        <div className="divider"></div>
        <Buttons action={card} stats={statBlock} character={character} updateChar={updateChar} economy={economy} setEconomy={setEconomy}/>
      </div>
    </div>
    <div className="flex justify-between">
      <div className="pl-4 pb-4">
        {card.id}
      </div>
      <div className="pr-4 pb-2" hidden={!card.isAttack}>
        <span class="material-symbols-outlined" >swords</span>
      </div>
    </div>
  
    <Card id={card.id} deck={activeDeck} setter={updateDeck} resources={character.resource} blank={false}/>
  </div>)};

  return <>{actionCards}</>
}