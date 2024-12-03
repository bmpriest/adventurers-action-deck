//  class Action {
//	constructor(name, type, description, damage,
// }

// level is passed as a nested array [[<classname>, <classLevel>]] ?
// stats, saves, skills, proficiencies, classFeatures, flavor are all passed as objects
// inventory, spells, actions should be arrays of the aforesaid types.
class Character {
	constructor(name, level, exp, classes, background, race, stats, saves, skills, proficiencies, classFeatures, flavor, inventory, spells, actions) {
		this.name = name;
		this.level = level;
		this.exp = exp;
		this.classes = classes;
		this.background = background;
		this.race = race;
		this.stats = stats;
		this.saves = saves;
		this.skills = skills;
		this.proficiencies = proficiencies;
		this.classFeatures = classFeatures;
		this.flavor = flavor;
		this.inventory = inventory;
		this.feats = feats;
		this.spells = spells;
		this.actions = actions;
	}
}

class Race {
	constructor(name, features) {
		this.name = name;
		this.features = [];
	}
}

// six principle stats are passed as two item arrays: [value, bonus] so a str of 20 would be [20, 5]
// speed is a single item array, [30] for 30 feet. additional types (flying, burrowing, etc.) can be added
// hitDie is a nested array with die type and number, so [[d8, 10]]. additional die types are as such [[d8, 10], [d12, 2]]
//   consider making hitDie a map
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

// map or array with value and whether or not character is proficient [9, TRUE]
class Saves {
	constructor(str, dex, con, inte, wis, cha,) {
		this.str = str;
		this.dex = dex;
		this.con = con;
		this.inte = inte;
		this.wis = wis;
		this.cha = cha;
	}
}

class Skill{
	constructor(name, prof, exper, total) {
		this.name = name;
		this.prof = prof;
		this.exper = exper;
		this.total = total;
}
}

class Skills {
	constructor(acrobatics, animalHandling, arcana, athletics, deception, herstory, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleight, stealth, survival) {
		this.acrobatics = acrobatics;
		this.animalHandling = animalHandling;
		this.arcana = arcana;
		this.athletics = athletics;
		this.deception = deception;
		this.herstory = herstory;
		this.insight = insight;
		this.intimidation = intimidation;
		this.investigation = investigation;
		this.medicine = medicine;
		this.nature = nature;
		this.perception = perception;
		this.performance = performance;
		this.persuasion = persuasion;
		this.religion = religion;
		this.sleight = sleight;
		this.stealth = stealth;
		this.survival = survival;
	}
}


class Flavor {
	constructor(traits, ideals, bonds, flaws, backgroundFeature) {
		this.traits = traits;
		this.ideals = bonds;
		this.flaws = flaws;
		this.backgroundFeature = backgroundFeature;
	}
}

class Item {
	constructor(name, quantity, weight, price, description, consumable, actions) {
		this.name = name;
		this.quantity = quantity;
		this.weight = weight;
		this.price = price;
		this.description = description;
		this.consumable = consumable;
		this.actions = actions;
	}
}

class Inventory {
	constructor(cp, sp, ep, gp, pp, items) {
		this.cp = cp;
		this.sp = sp;
		this.ep = ep;
		this.gp = gp;
		this.pp = pp;
		this.items = items;
	}
}

class Feat {
	constructor(name, descriptions, actions) {
		this.name = name;
		this.description = description;
		this.actions = actions;
	}
}