import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Character() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    extra:"",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: "", position: "", extra: "", level: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
    <h3 className="text-lg font-semibold p-4">Create/Update Your Character</h3>
    <form
        onSubmit={onSubmit}
        className=""
      >
    <div className = "card card-bordered bg-neutral text-neutral-content"> 
      <div className="card-body">
        <div>
          <h2 className="card-title">
              Character Info
          </h2>
        </div>
        <div>
          <label
            htmlFor="name"
            className=""
          >
            Character Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className=""
            placeholder="First Last"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="level"
            className=""
          >
            Level
          </label>
          <input
            type="text"
            name="level"
            id="level"
            className=""
            placeholder="1"
            value={form.level}
            onChange={(e) => updateForm({ level: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="xp"
            className=""
          >
            Experience Points
          </label>
          <input
            type="text"
            name="xp"
            id="xp"
            className=""
            placeholder="0"
            value={form.xp}
            onChange={(e) => updateForm({ xp: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="class"
            className=""
          >
            Class
          </label>
          <input
            type="text"
            name="class"
            id="class"
            className=""
            placeholder="Class"
            value={form.class}
            onChange={(e) => updateForm({ class: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="race"
            className=""
          >
            Race
          </label>
          <input
            type="text"
            name="race"
            id="race"
            className=""
            placeholder="Race"
            value={form.race}
            onChange={(e) => updateForm({ race: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="background"
            className=""
          >
            Background
          </label>
          <input
            type="text"
            name="background"
            id="background"
            className=""
            placeholder="Background"
            value={form.background}
            onChange={(e) => updateForm({ background: e.target.value })}
          />
        </div>
        </div>

      </div>

      <br></br>

      <div className = "card card-bordered bg-neutral text-neutral-content"> 
        <div className="card-body">
          <div>
            <h2 className="card-title">
                Character Stats
            </h2>
          </div>
          <div>
            <label
              htmlFor="str"
              className=""
            >
              Strength
            </label>
            <input
              type="text"
              name="str"
              id="str"
              className=""
              placeholder="str"
              value={form.str}
              onChange={(e) => updateForm({ str: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="dex"
              className=""
            >
              Dexterity
            </label>
            <input
              type="text"
              name="dex"
              id="dex"
              className=""
              placeholder="dex"
              value={form.dex}
              onChange={(e) => updateForm({ dex: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="con"
              className=""
            >
              Constitution
            </label>
            <input
              type="text"
              name="con"
              id="con"
              className=""
              placeholder="con"
              value={form.con}
              onChange={(e) => updateForm({ con: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="inte"
              className=""
            >
              Intelligence
            </label>
            <input
              type="text"
              name="inte"
              id="inte"
              className=""
              placeholder="inte"
              value={form.inte}
              onChange={(e) => updateForm({ inte: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="wis"
              className=""
            >
              Wisdom
            </label>
            <input
              type="text"
              name="wis"
              id="wis"
              className=""
              placeholder="wis"
              value={form.wis}
              onChange={(e) => updateForm({ wis: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="cha"
              className=""
            >
              Charisma
            </label>
            <input
              type="text"
              name="cha"
              id="cha"
              className=""
              placeholder="cha"
              value={form.cha}
              onChange={(e) => updateForm({ cha: e.target.value })}
            />
          </div>

          <br></br>

          <div>
            <label
              htmlFor="maxHP"
              className=""
            >
              Maximum HP
            </label>
            <input
              type="text"
              name="maxHP"
              id="maxHP"
              className=""
              placeholder="maxHP"
              value={form.maxHP}
              onChange={(e) => updateForm({ maxHP: e.target.value })}
            />
          </div>

                    <div>
            <label
              htmlFor="ac"
              className=""
            >
              Armor Class
            </label>
            <input
              type="text"
              name="ac"
              id="ac"
              className=""
              placeholder="ac"
              value={form.ac}
              onChange={(e) => updateForm({ ac: e.target.value })}
            />
          </div>

                    <div>
            <label
              htmlFor="init"
              className=""
            >
              Initiative Bonus
            </label>
            <input
              type="text"
              name="init"
              id="init"
              className=""
              placeholder="init"
              value={form.init}
              onChange={(e) => updateForm({ init: e.target.value })}
            />
          </div>

                    <div>
            <label
              htmlFor="prof"
              className=""
            >
              Proficiency Bonus
            </label>
            <input
              type="text"
              name="prof"
              id="prof"
              className=""
              placeholder="prof"
              value={form.prof}
              onChange={(e) => updateForm({ prof: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="speed"
              className=""
            >
              Speed
            </label>
            <input
              type="text"
              name="speed"
              id="speed"
              className=""
              placeholder="speed"
              value={form.speed}
              onChange={(e) => updateForm({ speed: e.target.value })}
            />
          </div>      

          <div>
            <label
              htmlFor="hitDie"
              className=""
            >
              Hit Die
            </label>
            <input
              type="text"
              name="hitDie"
              id="hitDie"
              className=""
              placeholder="hitDie"
              value={form.hitDie}
              onChange={(e) => updateForm({ hitDie: e.target.value })}
            />
          </div>  

        </div>
      </div>

      <br></br>

      <div className = "card card-bordered bg-neutral text-neutral-content"> 
        <div className="card-body">
          <div>
            <h2 className="card-title">
                Character Saves
            </h2>
          </div>

          <div>
            <label
              htmlFor="strSav"
              className=""
            >
              Strength Save
            </label>
            <input
              type="text"
              name="strSav"
              id="strSav"
              className=""
              placeholder="strSav"
              value={form.strSav}
              onChange={(e) => updateForm({ strSav: e.target.value })}
            />
            <label htmlFor="strSavProf" className="">Proficient?</label>
            <input type="checkbox" name="strSavProf" id="strSavProf" className="" value={form.strSavProf} onChange={(e) => updateForm({ strSavProf: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="dexSav"
              className=""
            >
              Dexterity Save
            </label>
            <input
              type="text"
              name="dexSav"
              id="dexSav"
              className=""
              placeholder="dexSav"
              value={form.dexSav}
              onChange={(e) => updateForm({ dexSav: e.target.value })}
            />
                        <label htmlFor="dexSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="dexSavProf" id="dexSavProf" className="" value={form.dexSavProf} onChange={(e) => updateForm({ dexSavProf: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="conSav"
              className=""
            >
              Constitution Save
            </label>
            <input
              type="text"
              name="conSav"
              id="conSav"
              className=""
              placeholder="conSav"
              value={form.con}
              onChange={(e) => updateForm({ conSav: e.target.value })}
            />
                        <label htmlFor="conSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="conSavProf" id="conSavProf" className="" value={form.conSavProf} onChange={(e) => updateForm({ conSavProf: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="inteSav"
              className=""
            >
              Intelligence Save
            </label>
            <input
              type="text"
              name="inteSav"
              id="inteSav"
              className=""
              placeholder="inteSav"
              value={form.inte}
              onChange={(e) => updateForm({ inteSav: e.target.value })}
            />
                        <label htmlFor="inteSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="inteSavProf" id="inteSavProf" className="" value={form.inteSavProf} onChange={(e) => updateForm({ inteSavProf: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="wisSav"
              className=""
            >
              Wisdom Save
            </label>
            <input
              type="text"
              name="wisSav"
              id="wisSav"
              className=""
              placeholder="wisSav"
              value={form.wisSav}
              onChange={(e) => updateForm({ wisSav: e.target.value })}
            />
                        <label htmlFor="wisSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="wisSavProf" id="wisSavProf" className="" value={form.wisSavProf} onChange={(e) => updateForm({ wisSavProf: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="chaSav"
              className=""
            >
              Charisma Save
            </label>
            <input
              type="text"
              name="chaSav"
              id="chaSav"
              className=""
              placeholder="chaSav"
              value={form.chaSav}
              onChange={(e) => updateForm({ chaSav: e.target.value })}
            />
                        <label htmlFor="chaSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="chaSavProf" id="chaSavProf" className="" value={form.chaSavProf} onChange={(e) => updateForm({ chaSavProf: e.target.value })} />
          </div>
          
        </div>
      </div>

      <br></br>

      <div className = "card card-bordered bg-neutral text-neutral-content"> 
        <div className="card-body">
          <div>
            <h2 className="card-title">
                Character Skills
            </h2>
          </div>
          <div>
            <label
              htmlFor="acrobatics"
              className=""
            >
              Acrobatics
            </label>
            <input
              type="text"
              name="acrobatics"
              id="acrobatics"
              className=""
              placeholder="acrobatics"
              value={form.acrobatics}
              onChange={(e) => updateForm({ acrobatics: e.target.value })}
            />
            <label htmlFor="acrobaticsProf" className="">Proficient?</label>
            <input type="checkbox" name="acrobaticsProf" id="acrobaticsProf" className="" value={form.acrobaticsProf} onChange={(e) => updateForm({ acrobaticsProf: e.target.value })} />
            <label htmlFor="acrobaticsExper" className="">Expertise?</label>
            <input type="checkbox" name="acrobaticsExper" id="acrobaticsExper" className="" value={form.acrobaticsExper} onChange={(e) => updateForm({ acrobaticsExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="animalHandling"
              className=""
            >
              Animal Handling
            </label>
            <input
              type="text"
              name="animalHandling"
              id="animalHandling"
              className=""
              placeholder="animalHandling"
              value={form.animalHandling}
              onChange={(e) => updateForm({ animalHandling: e.target.value })}
            />
            <label htmlFor="animalHandlingProf" className="">Proficient?</label>
            <input type="checkbox" name="animalHandlingProf" id="animalHandlingProf" className="" value={form.animalHandlingProf} onChange={(e) => updateForm({ animalHandlingProf: e.target.value })} />
            <label htmlFor="animalHandlingExper" className="">Expertise?</label>
            <input type="checkbox" name="animalHandlingExper" id="animalHandlingExper" className="" value={form.animalHandlingExper} onChange={(e) => updateForm({ animalHandlingExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="arcana"
              className=""
            >
              Arcana
            </label>
            <input
              type="text"
              name="arcana"
              id="arcana"
              className=""
              placeholder="arcana"
              value={form.arcana}
              onChange={(e) => updateForm({ arcana: e.target.value })}
            />
            <label htmlFor="arcanaProf" className="">Proficient?</label>
            <input type="checkbox" name="arcanaProf" id="arcanaProf" className="" value={form.arcanaProf} onChange={(e) => updateForm({ arcanaProf: e.target.value })} />
            <label htmlFor="arcanaExper" className="">Expertise?</label>
            <input type="checkbox" name="arcanaExper" id="arcanaExper" className="" value={form.arcanaExper} onChange={(e) => updateForm({ arcanaExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="athletics"
              className=""
            >
              Athletics
            </label>
            <input
              type="text"
              name="athletics"
              id="athletics"
              className=""
              placeholder="athletics"
              value={form.athletics}
              onChange={(e) => updateForm({ athletics: e.target.value })}
            />
            <label htmlFor="athleticsProf" className="">Proficient?</label>
            <input type="checkbox" name="athleticsProf" id="athleticsProf" className="" value={form.athleticsProf} onChange={(e) => updateForm({ athleticsProf: e.target.value })} />
            <label htmlFor="athleticsExper" className="">Expertise?</label>
            <input type="checkbox" name="athleticsExper" id="athleticsExper" className="" value={form.athleticsExper} onChange={(e) => updateForm({ athleticsExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="deception"
              className=""
            >
              Deception
            </label>
            <input
              type="text"
              name="deception"
              id="deception"
              className=""
              placeholder="deception"
              value={form.deception}
              onChange={(e) => updateForm({ deception: e.target.value })}
            />
            <label htmlFor="deceptionProf" className="">Proficient?</label>
            <input type="checkbox" name="deceptionProf" id="deceptionProf" className="" value={form.deceptionProf} onChange={(e) => updateForm({ deceptionProf: e.target.value })} />
            <label htmlFor="deceptionExper" className="">Expertise?</label>
            <input type="checkbox" name="deceptionExper" id="deceptionExper" className="" value={form.deceptionExper} onChange={(e) => updateForm({ deceptionExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="herstory"
              className=""
            >
              History
            </label>
            <input
              type="text"
              name="herstory"
              id="herstory"
              className=""
              placeholder="herstory"
              value={form.herstory}
              onChange={(e) => updateForm({ herstory: e.target.value })}
            />
            <label htmlFor="herstoryProf" className="">Proficient?</label>
            <input type="checkbox" name="herstoryProf" id="herstoryProf" className="" value={form.herstoryProf} onChange={(e) => updateForm({ herstoryProf: e.target.value })} />
            <label htmlFor="herstoryExper" className="">Expertise?</label>
            <input type="checkbox" name="herstoryExper" id="herstoryExper" className="" value={form.herstoryExper} onChange={(e) => updateForm({ herstoryExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="insight"
              className=""
            >
              Insight
            </label>
            <input
              type="text"
              name="insight"
              id="insight"
              className=""
              placeholder="insight"
              value={form.insight}
              onChange={(e) => updateForm({ insight: e.target.value })}
            />
            <label htmlFor="insightProf" className="">Proficient?</label>
            <input type="checkbox" name="insightProf" id="insightProf" className="" value={form.insightProf} onChange={(e) => updateForm({ insightProf: e.target.value })} />
            <label htmlFor="insightExper" className="">Expertise?</label>
            <input type="checkbox" name="insightExper" id="insightExper" className="" value={form.insightExper} onChange={(e) => updateForm({ insightExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="intimidation"
              className=""
            >
              Intimidation
            </label>
            <input
              type="text"
              name="intimidation"
              id="intimidation"
              className=""
              placeholder="intimidation"
              value={form.intimidation}
              onChange={(e) => updateForm({ intimidation: e.target.value })}
            />
            <label htmlFor="intimidationProf" className="">Proficient?</label>
            <input type="checkbox" name="intimidationProf" id="intimidationProf" className="" value={form.intimidationProf} onChange={(e) => updateForm({ intimidationProf: e.target.value })} />
            <label htmlFor="intimidationExper" className="">Expertise?</label>
            <input type="checkbox" name="intimidationExper" id="intimidationExper" className="" value={form.intimidationExper} onChange={(e) => updateForm({ intimidationExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="investigation"
              className=""
            >
              Investigation
            </label>
            <input
              type="text"
              name="investigation"
              id="investigation"
              className=""
              placeholder="investigation"
              value={form.investigation}
              onChange={(e) => updateForm({ investigation: e.target.value })}
            />
            <label htmlFor="investigationProf" className="">Proficient?</label>
            <input type="checkbox" name="investigationProf" id="investigationProf" className="" value={form.investigationProf} onChange={(e) => updateForm({ investigationProf: e.target.value })} />
            <label htmlFor="investigationExper" className="">Expertise?</label>
            <input type="checkbox" name="investigationExper" id="investigationExper" className="" value={form.investigationExper} onChange={(e) => updateForm({ investigationExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="medicine"
              className=""
            >
              Medicine
            </label>
            <input
              type="text"
              name="medicine"
              id="medicine"
              className=""
              placeholder="medicine"
              value={form.medicine}
              onChange={(e) => updateForm({ medicine: e.target.value })}
            />
            <label htmlFor="medicineProf" className="">Proficient?</label>
            <input type="checkbox" name="medicineProf" id="medicineProf" className="" value={form.medicineProf} onChange={(e) => updateForm({ medicineProf: e.target.value })} />
            <label htmlFor="medicineExper" className="">Expertise?</label>
            <input type="checkbox" name="medicineExper" id="medicineExper" className="" value={form.medicineExper} onChange={(e) => updateForm({ medicineExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="nature"
              className=""
            >
              Nature
            </label>
            <input
              type="text"
              name="nature"
              id="nature"
              className=""
              placeholder="nature"
              value={form.nature}
              onChange={(e) => updateForm({ nature: e.target.value })}
            />
            <label htmlFor="natureProf" className="">Proficient?</label>
            <input type="checkbox" name="natureProf" id="natureProf" className="" value={form.natureProf} onChange={(e) => updateForm({ natureProf: e.target.value })} />
            <label htmlFor="natureExper" className="">Expertise?</label>
            <input type="checkbox" name="natureExper" id="natureExper" className="" value={form.natureExper} onChange={(e) => updateForm({ natureExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="perception"
              className=""
            >
              Perception
            </label>
            <input
              type="text"
              name="perception"
              id="perception"
              className=""
              placeholder="perception"
              value={form.perception}
              onChange={(e) => updateForm({ perception: e.target.value })}
            />
            <label htmlFor="perceptionProf" className="">Proficient?</label>
            <input type="checkbox" name="perceptionProf" id="perceptionProf" className="" value={form.perceptionProf} onChange={(e) => updateForm({ perceptionProf: e.target.value })} />
            <label htmlFor="perceptionExper" className="">Expertise?</label>
            <input type="checkbox" name="perceptionExper" id="perceptionExper" className="" value={form.perceptionExper} onChange={(e) => updateForm({ perceptionExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="performance"
              className=""
            >
              Performance
            </label>
            <input
              type="text"
              name="performance"
              id="performance"
              className=""
              placeholder="performance"
              value={form.performance}
              onChange={(e) => updateForm({ performance: e.target.value })}
            />
            <label htmlFor="performanceProf" className="">Proficient?</label>
            <input type="checkbox" name="performanceProf" id="performanceProf" className="" value={form.performanceProf} onChange={(e) => updateForm({ performanceProf: e.target.value })} />
            <label htmlFor="performanceExper" className="">Expertise?</label>
            <input type="checkbox" name="performanceExper" id="performanceExper" className="" value={form.aperformanceExper} onChange={(e) => updateForm({ performanceExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="persuasion"
              className=""
            >
              Persuasion
            </label>
            <input
              type="text"
              name="persuasion"
              id="persuasion"
              className=""
              placeholder="persuasion"
              value={form.persuasion}
              onChange={(e) => updateForm({ persuasion: e.target.value })}
            />
            <label htmlFor="persuasionProf" className="">Proficient?</label>
            <input type="checkbox" name="persuasionProf" id="persuasionProf" className="" value={form.persuasionProf} onChange={(e) => updateForm({ persuasionProf: e.target.value })} />
            <label htmlFor="persuasionExper" className="">Expertise?</label>
            <input type="checkbox" name="persuasionExper" id="persuasionExper" className="" value={form.persuasionExper} onChange={(e) => updateForm({ persuasionExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="religion"
              className=""
            >
              Religion
            </label>
            <input
              type="text"
              name="religion"
              id="religion"
              className=""
              placeholder="religion"
              value={form.religion}
              onChange={(e) => updateForm({ religion: e.target.value })}
            />
            <label htmlFor="religionProf" className="">Proficient?</label>
            <input type="checkbox" name="religionProf" id="religionProf" className="" value={form.religionProf} onChange={(e) => updateForm({ religionProf: e.target.value })} />
            <label htmlFor="religionExper" className="">Expertise?</label>
            <input type="checkbox" name="religionExper" id="religionExper" className="" value={form.religionExper} onChange={(e) => updateForm({ religionExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="sleight"
              className=""
            >
              Sleight of Hand
            </label>
            <input
              type="text"
              name="sleight"
              id="sleight"
              className=""
              placeholder="sleight"
              value={form.sleight}
              onChange={(e) => updateForm({ sleight: e.target.value })}
            />
            <label htmlFor="sleightProf" className="">Proficient?</label>
            <input type="checkbox" name="sleightProf" id="sleightProf" className="" value={form.sleightProf} onChange={(e) => updateForm({ sleightProf: e.target.value })} />
            <label htmlFor="sleightExper" className="">Expertise?</label>
            <input type="checkbox" name="sleightExper" id="sleightExper" className="" value={form.sleightExper} onChange={(e) => updateForm({ sleightExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="stealth"
              className=""
            >
              Stealth
            </label>
            <input
              type="text"
              name="stealth"
              id="stealth"
              className=""
              placeholder="stealth"
              value={form.stealth}
              onChange={(e) => updateForm({ stealth: e.target.value })}
            />
            <label htmlFor="stealthProf" className="">Proficient?</label>
            <input type="checkbox" name="stealthProf" id="stealthProf" className="" value={form.stealthProf} onChange={(e) => updateForm({ stealthProf: e.target.value })} />
            <label htmlFor="stealthExper" className="">Expertise?</label>
            <input type="checkbox" name="stealthExper" id="stealthExper" className="" value={form.stealthExper} onChange={(e) => updateForm({ stealthExper: e.target.value })} />
          </div>
          <div>
            <label
              htmlFor="survival"
              className=""
            >
              Survival
            </label>
            <input
              type="text"
              name="survival"
              id="survival"
              className=""
              placeholder="survival"
              value={form.survival}
              onChange={(e) => updateForm({ survival: e.target.value })}
            />
            <label htmlFor="survivalProf" className="">Proficient?</label>
            <input type="checkbox" name="survivalProf" id="survivalProf" className="" value={form.survivalProf} onChange={(e) => updateForm({ survivalProf: e.target.value })} />
            <label htmlFor="survivalExper" className="">Expertise?</label>
            <input type="checkbox" name="survivalExper" id="survivalExper" className="" value={form.survivalExper} onChange={(e) => updateForm({ survivalExper: e.target.value })} />
          </div>


        </div>
      </div>

      <br></br>

      <div className = "card card-bordered bg-neutral text-neutral-content"> 
        <div className="card-body">
          <div>
            <h2 className="card-title">
                Character Flavor Text
            </h2>
          </div>
        </div>
      </div>

      <br></br>

      <input
          type="submit"
          value="Save Character"
          className="btn btn-primary" />

    </form>
    </>
  );
}