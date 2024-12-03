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

// class Action {
//     constructor(name, type, description) {
//         this.name = name;
//         this.type = type;
//         this.description = description;
//     }

//     constructor(name, type, description, roll) {
//         this.name = name;
//         this.type = type;
//         this.description = description;
//         this.roll = roll;
//     }
// }

// const talking = Action("Talking", "Free", "Talking is always a free action.")

function main() {
    console.log("Here we go!");
    console.log("Rolling 2d8 + 5... ");
    console.log(verboseDie([4, 4, 4]));
}

main();