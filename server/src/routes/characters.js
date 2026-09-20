import { Hono } from "hono";
import { z } from "zod";
import mongoose from "mongoose";
import { Character } from "../models/character.js";

const characters = new Hono();

// --- Zod schemas ---

const damageSchema = z.object({
  diceNum: z.coerce.number().optional().default(0),
  diceType: z.coerce.number().optional(),
  bonus: z.coerce.number().optional().default(0),
  damageType: z.string().optional().default(""),
});

const resourceCostSchema = z.object({
  title: z.string().optional().default(""),
  bonus: z.boolean().optional().default(false),
  value: z.coerce.number().optional().default(0),
});

const actionCardSchema = z.object({
  title: z.string().optional().default(""),
  type: z
    .enum(["std", "bonus", "react", "free", "multi"])
    .optional()
    .default("std"),
  description: z.string().optional().default(""),
  attr: z
    .enum(["str", "dex", "con", "inte", "wis", "cha", ""])
    .optional()
    .default(""),
  useResource: z.boolean().optional().default(false),
  resource: z.array(resourceCostSchema).optional().default([]),
  isAttack: z.boolean().optional().default(false),
  damage: z.array(damageSchema).optional().default([]),
  isProficient: z.boolean().optional().default(false),
});

const resourceSchema = z.object({
  title: z.string().optional().default(""),
  maxValue: z.coerce.number().optional().default(0),
  curValue: z.coerce.number().optional().default(0),
  number: z.boolean().optional().default(false),
  shape: z.string().optional().default(""),
});

const classLevelSchema = z.object({
  class: z.string(),
  level: z.coerce.number().min(1).max(20),
});

const skillProfSchema = z.object({
  proficient: z.boolean().optional().default(false),
  expertise: z.boolean().optional().default(false),
});

const createCharacterSchema = z.object({
  name: z.string().min(1),
  classes: z.array(classLevelSchema).min(1),
  xp: z.coerce.number().optional().default(0),
  race: z.string().optional().default(""),
  background: z.string().optional().default(""),
  str: z.coerce.number().optional().default(10),
  dex: z.coerce.number().optional().default(10),
  con: z.coerce.number().optional().default(10),
  inte: z.coerce.number().optional().default(10),
  wis: z.coerce.number().optional().default(10),
  cha: z.coerce.number().optional().default(10),
  maxHP: z.coerce.number().optional().default(10),
  curHP: z.coerce.number().optional().default(10),
  tempHP: z.coerce.number().optional().default(0),
  ac: z.coerce.number().optional().default(10),
  speed: z.coerce.number().optional().default(30),
  hitDie: z.string().optional().default(""),
  saveProficiencies: z
    .object({
      str: z.boolean().optional().default(false),
      dex: z.boolean().optional().default(false),
      con: z.boolean().optional().default(false),
      inte: z.boolean().optional().default(false),
      wis: z.boolean().optional().default(false),
      cha: z.boolean().optional().default(false),
    })
    .optional(),
  skills: z.record(z.string(), skillProfSchema).optional(),
  deck: z.array(actionCardSchema).optional().default([]),
  resources: z.array(resourceSchema).optional().default([]),
});

const updateCharacterSchema = createCharacterSchema.partial();

// --- Helpers ---

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { ok: false, error: result.error.flatten() };
  }
  return { ok: true, data: result.data };
}

// Transform the old flat client format into the new structured format.
function transformLegacyBody(body) {
  const transformed = { ...body };

  // class + level -> classes
  if (body.class !== undefined && body.level !== undefined && !body.classes) {
    transformed.classes = [
      { class: body.class, level: Number(body.level) || 1 },
    ];
    delete transformed.class;
    delete transformed.level;
  }

  // Flat save fields -> saveProficiencies
  const saveAbilities = ["str", "dex", "con", "inte", "wis", "cha"];
  if (!body.saveProficiencies) {
    const saveProfs = {};
    let hasSaveFields = false;
    for (const ab of saveAbilities) {
      const profKey = `${ab}SavProf`;
      if (body[profKey] !== undefined) {
        saveProfs[ab] = !!body[profKey];
        hasSaveFields = true;
      }
      delete transformed[`${ab}Sav`];
      delete transformed[`${ab}SavProf`];
    }
    if (hasSaveFields) {
      transformed.saveProficiencies = saveProfs;
    }
  }

  // Flat skill fields -> skills map
  const skillKeys = [
    "acrobatics", "animalHandling", "arcana", "athletics", "deception",
    "herstory", "insight", "intimidation", "investigation", "medicine",
    "nature", "perception", "performance", "persuasion", "religion",
    "sleight", "stealth", "survival",
  ];
  const skillRenames = { herstory: "history", sleight: "sleightOfHand" };
  if (!body.skills) {
    const skills = {};
    let hasSkillFields = false;
    for (const sk of skillKeys) {
      const profKey = `${sk}Prof`;
      const experKey = `${sk}Exper`;
      if (body[profKey] !== undefined || body[experKey] !== undefined) {
        const newName = skillRenames[sk] || sk;
        skills[newName] = {
          proficient: !!body[profKey],
          expertise: !!body[experKey],
        };
        hasSkillFields = true;
      }
      delete transformed[sk];
      delete transformed[profKey];
      delete transformed[experKey];
    }
    if (hasSkillFields) {
      transformed.skills = skills;
    }
  }

  // resource -> resources (rename)
  if (body.resource !== undefined && !body.resources) {
    transformed.resources = Array.isArray(body.resource) ? body.resource : [];
    delete transformed.resource;
  }

  // deck: old client sends "" when empty, or an object instead of array
  if (body.deck === "" || (body.deck && typeof body.deck !== "object")) {
    transformed.deck = [];
  } else if (body.deck && !Array.isArray(body.deck)) {
    transformed.deck = Object.values(body.deck);
  }

  return transformed;
}

function isLegacyFormat(body) {
  return (
    body.class !== undefined ||
    body.strSavProf !== undefined ||
    body.acrobaticsProf !== undefined ||
    body.resource !== undefined
  );
}

async function parseBody(c, schema) {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return { ok: false, error: { message: "Invalid JSON body" } };
  }
  if (isLegacyFormat(body)) {
    body = transformLegacyBody(body);
  }
  return validate(schema, body);
}

// --- Routes ---

// List all characters
characters.get("/", async (c) => {
  const results = await Character.find({});
  return c.json(results);
});

// Get a single character
characters.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!isValidObjectId(id)) {
    return c.json({ error: "Invalid character ID" }, 400);
  }
  const character = await Character.findById(id);
  if (!character) {
    return c.json({ error: "Character not found" }, 404);
  }
  return c.json(character);
});

// Create a character
characters.post("/", async (c) => {
  const parsed = await parseBody(c, createCharacterSchema);
  if (!parsed.ok) {
    return c.json({ error: parsed.error }, 400);
  }
  const character = await Character.create(parsed.data);
  return c.json(character, 201);
});

// Update a character
characters.patch("/:id", async (c) => {
  const id = c.req.param("id");
  if (!isValidObjectId(id)) {
    return c.json({ error: "Invalid character ID" }, 400);
  }
  const parsed = await parseBody(c, updateCharacterSchema);
  if (!parsed.ok) {
    return c.json({ error: parsed.error }, 400);
  }
  const character = await Character.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  });
  if (!character) {
    return c.json({ error: "Character not found" }, 404);
  }
  return c.json(character);
});

// Delete a character
characters.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!isValidObjectId(id)) {
    return c.json({ error: "Invalid character ID" }, 400);
  }
  const character = await Character.findByIdAndDelete(id);
  if (!character) {
    return c.json({ error: "Character not found" }, 404);
  }
  return c.json({ message: "Character deleted" });
});

export default characters;
