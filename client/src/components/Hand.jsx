import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  
import Buttons from './Buttons'

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


export default function Hand({ character, updater, activeDeck, economy, setEconomy}) {
  let statBlock = buildChar(character)

  let myHand = activeDeck
  // console.log('printing active hand: ')
  // console.log(hand)
  // console.log(hand.length)
  let actionCards = [];

  function actionIcon(type) {
    switch(type) {
      case 'std':
        return <div class="bg-info w-8 mask mask-circle"></div>;
      case 'bonus':
        return <div class="bg-success w-8 mask mask-triangle-2"></div>;
      case 'react':
        return <div class="bg-warning w-8 mask mask-star-2"></div>;
      case 'multi':
        return <div class="bg-base-content w-8 mask mask-circle"></div>;
    }
  }

  function cardToHit(attr, isProficient) {
    if (isProficient) {
      return <>To hit: +{getBonus( Number(statBlock[attr]) ) + Number(statBlock.prof)} ({attr})</>
    } else {
      return <>To hit: +{getBonus( Number(statBlock[attr]) )} ({attr})</>
    }
  }

  function cardDamage(dmgs) {
    let totalDmg = []
    totalDmg = dmgs.map(dmg =>
      <div class="">
        Damage: {dmg.diceNum}d{dmg.diceType} + {dmg.bonus} {dmg.damageType}
      </div>
    )
    return <>{totalDmg}</>
  }

  function cardRes(ress) {
    let totalRes = []
    try {
      totalRes = ress.map(res =>
        <div class="">
          Resource: {res.title} {res.bonus} {res.value}
        </div>
      )
    } catch(err) {
      console.log('Could not print resources on card.')
    }
    return <>{totalRes}</>
  }

  if (myHand.length > 0) {
  actionCards = myHand.map(card =>
    <div class="card bg-neutral w-80 shadow-xl">
      <div class="card-body">
        <div class="flex">
          <h2 class="text-center grow card-title">{card.title}</h2>
          <div class="flex flex-row">
          {actionIcon(card.type)}
          <span class="material-icons">edit_square</span>
          <span class="material-icons">delete</span>
          </div>
        </div>
      <div class="">
        <div class="rounded bg-base-100 min-h-16 p-2">
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
      <div class="divider"></div>
      </div>
      <Buttons action={card} stats={statBlock} character={character} updater={updater} economy={economy} setEconomy={setEconomy}/>
  </div>
</div>)};

  return <>{actionCards}</>
}