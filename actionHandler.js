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

function getBonus(num) {
    // 14 = 14 - 10 = 4 / 2 = +2
    // 8 = 8 - 10 = -2 /2 = -1
    val = (num - 10) / 2
    return (val > 0) ? Math.floor(val) : Math.ceil(val);
}

function verboseDie(dice) {
    let dieNum = dice[0];
    let dieType = dice[1];
    let dieBonus = dice[2];
    let total = dieBonus;

    for (i = 0; i < dieNum; i++) {
        let result = getRandomIntInclusive(1, dieType);
        console.log(`Rolling d${dieType} #${i}... ${result}`);
        total += result;
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

// an action can be:
//  - a standard action
//  - a bonus action
//  - a reaction
//  - a free action
//  - or contain other actions.

// a player can perform one action, one bonus action (if possible), and a reaction per round
// an action typically consists of a player doing something, which may or may not involve a roll.

// a roll can be constructed as follows:
// 2d8 + 5 slashing
// [2, 8, 5, "slashing"]

// 2d8 + 5 slashing, 1d8 thunder
// [ [2, 8, 5, "slashing"], [1, 8, 0, "thunder"] ]

class Action {
    constructor(name, type, description, resource, skill, damage, dmgType) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.resource = resource;
        this.skill = skill;
        this.damage = damage;
        this.dmgType = dmgType;
    }

    performRoll() {
        let totals = [];

    }
}

let basicAttack = new Action("Longsword", "standard", "Attack with a longsword", null, "str", [1,8,5], "Slashing");

let daar = new Stats(20, 14, 16, 14, 12, 12, 120, 120, 0, 20, 2, 4, "Yes");

function actionDoer(character, action) {
    attr = action.skill;
    attrVal = character[attr];

    console.log("Attribute is " + attr);
    console.log("Character's attribute is " + attrVal);
    console.log(`Daar is performing ${action.name} with ${attr} of ${attrVal}:`)
    console.log(`Rolling to hit: d20 + ${character.prof}: ${rollDie([1,20,character.prof])}`)
    console.log(`Rolling for damage: ${action.damage[0]}d${action.damage[1]} + ${action.damage[2]} ${action.dmgType} damage.`);
    console.log(`    ${rollDie(action.damage)} ${action.dmgType} damage!`)
}



// const talking = Action("Talking", "Free", "Talking is always a free action.")

function main() {
    console.log("Here we go!");
    actionDoer(daar, basicAttack);
}

main();