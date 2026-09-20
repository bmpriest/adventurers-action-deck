import mongoose from "mongoose";

const { Schema } = mongoose;

// --- Sub-schemas ---

const classLevelSchema = new Schema(
  {
    class: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 20 },
  },
  { _id: false }
);

const damageSchema = new Schema(
  {
    diceNum: { type: Number, default: 0 },
    diceType: { type: Number, enum: [4, 6, 8, 10, 12, 20] },
    bonus: { type: Number, default: 0 },
    damageType: { type: String, default: "" },
  },
  { _id: false }
);

const resourceCostSchema = new Schema(
  {
    title: { type: String, default: "" },
    bonus: { type: Boolean, default: false },
    value: { type: Number, default: 0 },
  },
  { _id: false }
);

const actionCardSchema = new Schema(
  {
    title: { type: String, default: "" },
    type: {
      type: String,
      enum: ["std", "bonus", "react", "free", "multi"],
      default: "std",
    },
    description: { type: String, default: "" },
    attr: {
      type: String,
      enum: ["str", "dex", "con", "inte", "wis", "cha", ""],
      default: "",
    },
    useResource: { type: Boolean, default: false },
    resource: [resourceCostSchema],
    isAttack: { type: Boolean, default: false },
    damage: [damageSchema],
    isProficient: { type: Boolean, default: false },
  },
  { _id: false }
);

const resourceSchema = new Schema(
  {
    title: { type: String, default: "" },
    maxValue: { type: Number, default: 0 },
    curValue: { type: Number, default: 0 },
    number: { type: Boolean, default: false },
    shape: { type: String, default: "" },
  },
  { _id: false }
);

const SKILL_NAMES = [
  "acrobatics",
  "animalHandling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleightOfHand",
  "stealth",
  "survival",
];

// Which ability each skill keys off of
const SKILL_ABILITIES = {
  acrobatics: "dex",
  animalHandling: "wis",
  arcana: "inte",
  athletics: "str",
  deception: "cha",
  history: "inte",
  insight: "wis",
  intimidation: "cha",
  investigation: "inte",
  medicine: "wis",
  nature: "inte",
  perception: "wis",
  performance: "cha",
  persuasion: "cha",
  religion: "inte",
  sleightOfHand: "dex",
  stealth: "dex",
  survival: "wis",
};

const ABILITY_NAMES = ["str", "dex", "con", "inte", "wis", "cha"];

const skillProfSchema = new Schema(
  {
    proficient: { type: Boolean, default: false },
    expertise: { type: Boolean, default: false },
  },
  { _id: false }
);

// --- Main schema ---

const characterSchema = new Schema(
  {
    name: { type: String, required: true },
    classes: { type: [classLevelSchema], required: true },
    xp: { type: Number, default: 0 },
    race: { type: String, default: "" },
    background: { type: String, default: "" },

    // Source-of-truth ability scores (just the raw number)
    str: { type: Number, default: 10 },
    dex: { type: Number, default: 10 },
    con: { type: Number, default: 10 },
    inte: { type: Number, default: 10 },
    wis: { type: Number, default: 10 },
    cha: { type: Number, default: 10 },

    // HP
    maxHP: { type: Number, default: 10 },
    curHP: { type: Number, default: 10 },
    tempHP: { type: Number, default: 0 },

    // These could be derived in the future, but storing for now
    // since AC depends on armor, class features, spells, etc.
    ac: { type: Number, default: 10 },
    speed: { type: Number, default: 30 },
    hitDie: { type: String, default: "" },

    // Save proficiencies (just which ones — totals are derived)
    saveProficiencies: {
      str: { type: Boolean, default: false },
      dex: { type: Boolean, default: false },
      con: { type: Boolean, default: false },
      inte: { type: Boolean, default: false },
      wis: { type: Boolean, default: false },
      cha: { type: Boolean, default: false },
    },

    // Skill proficiencies (just prof/expertise flags — totals are derived)
    skills: {
      type: Map,
      of: skillProfSchema,
      default: () => {
        const defaults = {};
        for (const skill of SKILL_NAMES) {
          defaults[skill] = { proficient: false, expertise: false };
        }
        return defaults;
      },
    },

    // Action cards (the deck)
    deck: [actionCardSchema],

    // Resources (spell slots, rage charges, etc.)
    resources: [resourceSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Virtuals (derived values) ---

characterSchema.virtual("totalLevel").get(function () {
  return this.classes.reduce((sum, c) => sum + c.level, 0);
});

characterSchema.virtual("proficiencyBonus").get(function () {
  return Math.ceil(this.totalLevel / 4) + 1;
});

characterSchema.virtual("initiative").get(function () {
  return abilityBonus(this.dex);
});

// Ability bonuses
for (const ability of ABILITY_NAMES) {
  characterSchema.virtual(`${ability}Bonus`).get(function () {
    return abilityBonus(this[ability]);
  });
}

// Save totals
for (const ability of ABILITY_NAMES) {
  characterSchema.virtual(`${ability}Save`).get(function () {
    const bonus = abilityBonus(this[ability]);
    const prof = this.saveProficiencies?.[ability] ? this.proficiencyBonus : 0;
    return bonus + prof;
  });
}

// Skill totals
for (const skill of SKILL_NAMES) {
  characterSchema.virtual(`${skill}Total`).get(function () {
    const ability = SKILL_ABILITIES[skill];
    const bonus = abilityBonus(this[ability]);
    const skillData = this.skills?.get(skill);
    if (!skillData) return bonus;

    let prof = 0;
    if (skillData.expertise) {
      prof = this.proficiencyBonus * 2;
    } else if (skillData.proficient) {
      prof = this.proficiencyBonus;
    }
    return bonus + prof;
  });
}

function abilityBonus(score) {
  return Math.floor((score - 10) / 2);
}

const Character = mongoose.model("Character", characterSchema);

export { Character, SKILL_NAMES, SKILL_ABILITIES, ABILITY_NAMES };
