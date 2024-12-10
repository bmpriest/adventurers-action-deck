import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      level: req.body.level,
      xp: req.body.xp,
      class: req.body.class,
      race: req.body.race,
      background: req.body.background,
      str: req.body.str,
      dex: req.body.dex,
      con: req.body.con,
      inte: req.body.inte,
      wis: req.body.wis,
      cha: req.body.cha,
      maxHP: req.body.maxHP,
      curHP: req.body.curHP,
      ac: req.body.ac,
      init: req.body.init,
      prof: req.body.prof,
      speed: req.body.speed,
      hitDie: req.body.hitDie,
      strSav: req.body.strSav,
      strSavProf: req.body.strSavProf,
      dexSav: req.body.dexSav,
      dexSavProf: req.body.dexSavProf,
      conSav: req.body.conSav,
      conSavProf: req.body.conSavProf,
      inteSav: req.body.inteSav,
      inteSavProf: req.body.inteSavProf,
      wisSav: req.body.wisSav,
      wisSavProf: req.body.wisSavProf,
      chaSav: req.body.chaSav,
      chaSavProf: req.body.chaSavProf,
      acrobatics: req.body.acrobatics,
      acrobaticsProf: req.body.acrobaticsProf,
      acrobaticsExper: req.body.acrobaticsExper,
      animalHandling: req.body.animalHandling,
      animalHandlingProf: req.body.animalHandlingProf,
      animalHandlingExper: req.body.animalHandlingExper,
      arcana: req.body.arcana,
      arcanaProf: req.body.arcanaProf,
      arcanaExper: req.body.arcanaExper,
      athletics: req.body.athletics,
      athleticsProf: req.body.athleticsProf,
      athleticsExper: req.body.athleticsExper,
      deception: req.body.deception,
      deceptionProf: req.body.deceptionProf,
      deceptionExper: req.body.deceptionExper,
      herstory: req.body.herstory,
      herstoryProf: req.body.herstoryProf,
      herstoryExper: req.body.herstoryProf,
      insight: req.body.insight,
      insightProf: req.body.insightProf,
      insightExper: req.body.insightExper,
      intimidation: req.body.intimidation,
      intimidationProf: req.body.intimidationProf,
      intimidationExper: req.body.intimidationExper,
      investigation: req.body.investigation,
      investigationProf: req.body.investigationProf,
      investigationExper: req.body.investigationExper,
      medicine: req.body.medicine,
      medicineProf: req.body.medicineProf,
      medicineExper: req.body.medicineExper,
      nature: req.body.nature,
      natureProf: req.body.natureProf,
      natureExper: req.body.natureExper,
      perception: req.body.perception,
      perceptionProf: req.body.perceptionProf,
      perceptionExper: req.body.perceptionExper,
      performance: req.body.performance,
      performanceProf: req.body.performanceProf,
      performanceExper: req.body.performanceExper,
      persuasion: req.body.persuasion,
      persuasionProf: req.body.persuasionProf,
      persuasionExper : req.body.persuasionExper,
      religion: req.body.religion,
      religionProf: req.body.religionProf,
      religionExper: req.body.religionExper,
      sleight: req.body.sleight,
      sleightProf: req.body.sleightProf,
      sleightExper: req.body.sleightExper,
      stealth: req.body.stealth,
      stealthProf: req.body.stealthProf,
      stealthExper: req.body.stealthExper,
      survival: req.body.survival,
      survivalExper: req.body.survivalExper,
      survivalProf: req.body.survivalProf,
      deck: req.body.deck,
      resource: req.body.resource
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        level: req.body.level,
        xp: req.body.xp,
        class: req.body.class,
        race: req.body.race,
        background: req.body.background,
        str: req.body.str,
        dex: req.body.dex,
        con: req.body.con,
        inte: req.body.inte,
        wis: req.body.wis,
        cha: req.body.cha,
        maxHP: req.body.maxHP,
        curHP: req.body.curHP,
        ac: req.body.ac,
        init: req.body.init,
        prof: req.body.prof,
        speed: req.body.speed,
        hitDie: req.body.hitDie,
        strSav: req.body.strSav,
        strSavProf: req.body.strSavProf,
        dexSav: req.body.dexSav,
        dexSavProf: req.body.dexSavProf,
        conSav: req.body.conSav,
        conSavProf: req.body.conSavProf,
        inteSav: req.body.inteSav,
        inteSavProf: req.body.inteSavProf,
        wisSav: req.body.wisSav,
        wisSavProf: req.body.wisSavProf,
        chaSav: req.body.chaSav,
        chaSavProf: req.body.chaSavProf,
        acrobatics: req.body.acrobatics,
        acrobaticsProf: req.body.acrobaticsProf,
        acrobaticsExper: req.body.acrobaticsExper,
        animalHandling: req.body.animalHandling,
        animalHandlingProf: req.body.animalHandlingProf,
        animalHandlingExper: req.body.animalHandlingExper,
        arcana: req.body.arcana,
        arcanaProf: req.body.arcanaProf,
        arcanaExper: req.body.arcanaExper,
        athletics: req.body.athletics,
        athleticsProf: req.body.athleticsProf,
        athleticsExper: req.body.athleticsExper,
        deception: req.body.deception,
        deceptionProf: req.body.deceptionProf,
        deceptionExper: req.body.deceptionExper,
        herstory: req.body.herstory,
        herstoryProf: req.body.herstoryProf,
        herstoryExper: req.body.herstoryProf,
        insight: req.body.insight,
        insightProf: req.body.insightProf,
        insightExper: req.body.insightExper,
        intimidation: req.body.intimidation,
        intimidationProf: req.body.intimidationProf,
        intimidationExper: req.body.intimidationExper,
        investigation: req.body.investigation,
        investigationProf: req.body.investigationProf,
        investigationExper: req.body.investigationExper,
        medicine: req.body.medicine,
        medicineProf: req.body.medicineProf,
        medicineExper: req.body.medicineExper,
        nature: req.body.nature,
        natureProf: req.body.natureProf,
        natureExper: req.body.natureExper,
        perception: req.body.perception,
        perceptionProf: req.body.perceptionProf,
        perceptionExper: req.body.perceptionExper,
        performance: req.body.performance,
        performanceProf: req.body.performanceProf,
        performanceExper: req.body.performanceExper,
        persuasion: req.body.persuasion,
        persuasionProf: req.body.persuasionProf,
        persuasionExper : req.body.persuasionExper,
        religion: req.body.religion,
        religionProf: req.body.religionProf,
        religionExper: req.body.religionExper,
        sleight: req.body.sleight,
        sleightProf: req.body.sleightProf,
        sleightExper: req.body.sleightExper,
        stealth: req.body.stealth,
        stealthProf: req.body.stealthProf,
        stealthExper: req.body.stealthExper,
        survival: req.body.survival,
        survivalExper: req.body.survivalExper,
        survivalProf: req.body.survivalProf,
        deck: req.body.deck,
        resource: req.body.resource
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;