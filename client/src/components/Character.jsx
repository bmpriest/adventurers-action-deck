import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Character() {
  const [form, setForm] = useState({
    name: "",
    level: "",
    xp: "",
    class: "",
    race: "",
    background: "",
    str: "",
    dex: "",
    con: "",
    inte: "",
    wis: "",
    cha: "",
    maxHP: "",
    ac: "",
    init: "",
    prof: "",
    speed: "",
    hitDie: "",
    strSav: "",
    strSavProf: "",
    dexSav: "",
    dexSavProf: "",
    conSav: "",
    conSavProf: "",
    inteSav: "",
    inteSavProf: "",
    wisSav: "",
    wisSavProf: "",
    chaSav: "",
    chaSavProf: "",
    acrobatics: "",
    acrobaticsProf: "",
    acrobaticsExper: "",
		animalHandling: "",
		animalHandlingProf: "",
		animalHandlingExper: "",
		arcana: "",
    arcanaProf: "",
    arcanaExper: "",
		athletics: "",
    athleticsProf: "",
    athleticsExper: "",
		deception: "",
    deceptionProf: "",
    deceptionExper: "",
		herstory: "",
    herstoryProf: "",
    herstoryExper: "",
		insight: "",
    insightProf: "",
    insightExper: "",
		intimidation: "",
    intimidationProf: "",
    intimidationExper: "",
		investigation: "",
    investigationProf: "",
    investigationExper: "",
		medicine: "",
    medicineProf: "",
    medicineExper: "",
		nature: "",
    natureProf: "",
    natureExper: "",
		perception: "",
    perceptionProf: "",
    perceptionExper: "",
		performance: "",
    performanceProf: "",
    performanceExper: "",
		persuasion: "",
		persuasionProf: "",
		persuasionExper : "",
		religion: "",
    religionProf: "",
    religionExper: "",
		sleight: "",
    sleightProf: "",
    sleightExper: "",
		stealth: "",
    stealthProf: "",
    stealthExper: "",
		survival: "",
    survivalExper: "",
    survivalProf: "",
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
            class="input input-bordered flex items-center gap-2 w-auto"
          >
            Character Name
          <input
            type="text"
            name="name"
            id="name"
            class="grow text-right"
            placeholder="First Last"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            />
            </label>
        </div>
        <div>
          <label
            htmlFor="level"
            class="input input-bordered flex items-center gap-2 w-auto"
          >
            Level
          <input
            type="number"
            name="level"
            id="level"
            class="grow text-right"
            placeholder="1"
            value={form.level}
            onChange={(e) => updateForm({ level: e.target.value })}
            />
            </label>
        </div>
        <div>
          <label
            htmlFor="xp"
            class="input input-bordered flex items-center gap-2 w-auto"
          >
            Experience Points
          <input
            type="number"
            name="xp"
            id="xp"
            class="grow text-right"
            placeholder="0"
            value={form.xp}
            onChange={(e) => updateForm({ xp: e.target.value })}
            />
            </label>
        </div>
        <div>
          <label
            htmlFor="class"
            class="input input-bordered flex items-center gap-2 w-auto"
          >
            Class
          <input
            type="text"
            name="class"
            id="class"
            class="grow text-right"
            placeholder="Class"
            value={form.class}
            onChange={(e) => updateForm({ class: e.target.value })}
            />
            </label>
        </div>
        <div>
          <label
            htmlFor="race"
            class="input input-bordered flex items-center gap-2 w-auto"
          >
            Race
          <input
            type="text"
            name="race"
            id="race"
            class="grow text-right"
            placeholder="Race"
            value={form.race}
            onChange={(e) => updateForm({ race: e.target.value })}
            />
            </label>
        </div>
        <div>
          <label
            htmlFor="background"
            class="input input-bordered flex items-center gap-2 w-auto"
          >
            Background
          <input
            type="text"
            name="background"
            id="background"
            class="grow text-right"
            placeholder="Background"
            value={form.background}
            onChange={(e) => updateForm({ background: e.target.value })}
            />
            </label>
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
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Strength
            <input
              type="number"
              name="str"
              id="str"
              className="grow text-right"
              placeholder="str"
              value={form.str}
              onChange={(e) => updateForm({ str: e.target.value })}
              />
              </label>
          </div>
          <div>
            <label
              htmlFor="dex"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Dexterity
            <input
              type="number"
              name="dex"
              id="dex"
              className="grow text-right"
              placeholder="dex"
              value={form.dex}
              onChange={(e) => updateForm({ dex: e.target.value })}
              />
              </label>
          </div>
          <div>
            <label
              htmlFor="con"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Constitution
            <input
              type="number"
              name="con"
              id="con"
              className="grow text-right"
              placeholder="con"
              value={form.con}
              onChange={(e) => updateForm({ con: e.target.value })}
              />
              </label>
          </div>
          <div>
            <label
              htmlFor="inte"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Intelligence
            <input
              type="number"
              name="inte"
              id="inte"
              className="grow text-right"
              placeholder="inte"
              value={form.inte}
              onChange={(e) => updateForm({ inte: e.target.value })}
              />
              </label>
          </div>
          <div>
            <label
              htmlFor="wis"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Wisdom
            <input
              type="number"
              name="wis"
              id="wis"
              className="grow text-right"
              placeholder="wis"
              value={form.wis}
              onChange={(e) => updateForm({ wis: e.target.value })}
              />
              </label>
          </div>
          <div>
            <label
              htmlFor="cha"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Charisma
            <input
              type="number"
              name="cha"
              id="cha"
              className="grow text-right"
              placeholder="cha"
              value={form.cha}
              onChange={(e) => updateForm({ cha: e.target.value })}
              />
              </label>
          </div>

          <br></br>

          <div>
            <label
              htmlFor="maxHP"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Maximum HP
            <input
              type="number"
              name="maxHP"
              id="maxHP"
              className="grow text-right"
              placeholder="maxHP"
              value={form.maxHP}
              onChange={(e) => updateForm({ maxHP: e.target.value })}
              />
              </label>
          </div>

                    <div>
            <label
              htmlFor="ac"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Armor Class
            <input
              type="number"
              name="ac"
              id="ac"
              className="grow text-right"
              placeholder="ac"
              value={form.ac}
              onChange={(e) => updateForm({ ac: e.target.value })}
              />
              </label>
          </div>

                    <div>
            <label
              htmlFor="init"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Initiative Bonus
            <input
              type="number"
              name="init"
              id="init"
              className="grow text-right"
              placeholder="init"
              value={form.init}
              onChange={(e) => updateForm({ init: e.target.value })}
              />
              </label>
          </div>

                    <div>
            <label
              htmlFor="prof"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Proficiency Bonus
            <input
              type="number"
              name="prof"
              id="prof"
              className="grow text-right"
              placeholder="prof"
              value={form.prof}
              onChange={(e) => updateForm({ prof: e.target.value })}
              />
              </label>
          </div>

          <div>
            <label
              htmlFor="speed"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Speed
            <input
              type="text"
              name="speed"
              id="speed"
              className="grow text-right"
              placeholder="speed"
              value={form.speed}
              onChange={(e) => updateForm({ speed: e.target.value })}
              />
              </label>
          </div>      

          <div>
            <label
              htmlFor="hitDie"
              class="input input-bordered flex items-center gap-2 w-auto"

            >
              Hit Die
            <input
              type="text"
              name="hitDie"
              id="hitDie"
              className="grow text-right"
              placeholder="hitDie"
              value={form.hitDie}
              onChange={(e) => updateForm({ hitDie: e.target.value })}
              />
              </label>
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
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Strength Save
            <input
              type="number"
              name="strSav"
              id="strSav"
              className="grow text-right"
              placeholder="strSav"
              value={form.strSav}
              onChange={(e) => updateForm({ strSav: e.target.value })}
              />
              <div class="divider divider-horizontal"></div>
            <label htmlFor="strSavProf" className="">Proficient?</label>
            <input type="checkbox" name="strSavProf" id="strSavProf" className="" checked={form.strSavProf} onChange={(e) => updateForm({ strSavProf: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="dexSav"
          class="input input-bordered flex items-center gap-2 w-auto"
            >
              Dexterity Save
            <input
              type="number"
              name="dexSav"
              id="dexSav"
              className="grow text-right"
              placeholder="dexSav"
              value={form.dexSav}
              onChange={(e) => updateForm({ dexSav: e.target.value })}
              />
              <div class="divider divider-horizontal"></div>
                        <label htmlFor="dexSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="dexSavProf" id="dexSavProf" className="" checked={form.dexSavProf} onChange={(e) => updateForm({ dexSavProf: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="conSav"
          class="input input-bordered flex items-center gap-2 w-auto"
            >
              Constitution Save
            <input
              type="number"
              name="conSav"
              id="conSav"
              className="grow text-right"
              placeholder="conSav"
              value={form.conSav}
              onChange={(e) => updateForm({ conSav: e.target.value })}
              />
            <div class="divider divider-horizontal"></div>
                        <label htmlFor="conSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="conSavProf" id="conSavProf" className="" checked={form.conSavProf} onChange={(e) => updateForm({ conSavProf: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="inteSav"
                        class="input input-bordered flex items-center gap-2 w-auto"
            >
              Intelligence Save
            <input
              type="number"
              name="inteSav"
              id="inteSav"
              className="grow text-right"
              placeholder="inteSav"
              value={form.inteSav}
              onChange={(e) => updateForm({ inteSav: e.target.value })}
              />
            <div class="divider divider-horizontal"></div>
                        <label htmlFor="inteSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="inteSavProf" id="inteSavProf" className="" checked={form.inteSavProf} onChange={(e) => updateForm({ inteSavProf: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="wisSav"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Wisdom Save
            <input
              type="number"
              name="wisSav"
              id="wisSav"
              className="grow text-right"
              placeholder="wisSav"
              value={form.wisSav}
              onChange={(e) => updateForm({ wisSav: e.target.value })}
              />
            <div class="divider divider-horizontal"></div>
                        <label htmlFor="wisSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="wisSavProf" id="wisSavProf" className="" checked={form.wisSavProf} onChange={(e) => updateForm({ wisSavProf: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="chaSav"
            class="input input-bordered flex items-center gap-2 w-auto"
            >
              Charisma Save
            <input
              type="number"
              name="chaSav"
              id="chaSav"
              className="grow text-right"
              placeholder="chaSav"
              value={form.chaSav}
              onChange={(e) => updateForm({ chaSav: e.target.value })}
              />
            <div class="divider divider-horizontal"></div>
                        <label htmlFor="chaSavProf" className="">Proficient?</label>
                        <input type="checkbox" name="chaSavProf" id="chaSavProf" className="" checked={form.chaSavProf} onChange={(e) => updateForm({ chaSavProf: e.target.checked })} />
            </label>
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
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Acrobatics
            <input
              type="number"
              name="acrobatics"
              id="acrobatics"
              className="grow text-right"
              placeholder="acrobatics"
              value={form.acrobatics}
              onChange={(e) => updateForm({ acrobatics: e.target.value })}
              />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="acrobaticsProf" className="">Proficient?</label>
            <input type="checkbox" name="acrobaticsProf" id="acrobaticsProf" className="" checked={form.acrobaticsProf} onChange={(e) => updateForm({ acrobaticsProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="acrobaticsExper" className="">Expertise?</label>
            <input type="checkbox" name="acrobaticsExper" id="acrobaticsExper" className="" checked={form.acrobaticsExper} onChange={(e) => updateForm({ acrobaticsExper: e.target.checked })} />
            </label>
          </div>
          <div>
            <label
              htmlFor="animalHandling"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Animal Handling
            <input
              type="number"
              name="animalHandling"
              id="animalHandling"
              className="grow text-right"
              placeholder="animalHandling"
              value={form.animalHandling}
              onChange={(e) => updateForm({ animalHandling: e.target.value })}
            />
                        <div class="divider divider-horizontal"></div>
            <label htmlFor="animalHandlingProf" className="">Proficient?</label>
            <input type="checkbox" name="animalHandlingProf" id="animalHandlingProf" className="" checked={form.animalHandlingProf} onChange={(e) => updateForm({ animalHandlingProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="animalHandlingExper" className="">Expertise?</label>
            <input type="checkbox" name="animalHandlingExper" id="animalHandlingExper" className="" checked={form.animalHandlingExper} onChange={(e) => updateForm({ animalHandlingExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="arcana"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Arcana
            <input
              type="number"
              name="arcana"
              id="arcana"
              className="grow text-right"
              placeholder="arcana"
              value={form.arcana}
              onChange={(e) => updateForm({ arcana: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="arcanaProf" className="">Proficient?</label>
            <input type="checkbox" name="arcanaProf" id="arcanaProf" className="" checked={form.arcanaProf} onChange={(e) => updateForm({ arcanaProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="arcanaExper" className="">Expertise?</label>
            <input type="checkbox" name="arcanaExper" id="arcanaExper" className="" checked={form.arcanaExper} onChange={(e) => updateForm({ arcanaExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="athletics"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Athletics
            <input
              type="number"
              name="athletics"
              id="athletics"
              className="grow text-right"
              placeholder="athletics"
              value={form.athletics}
              onChange={(e) => updateForm({ athletics: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="athleticsProf" className="">Proficient?</label>
            <input type="checkbox" name="athleticsProf" id="athleticsProf" className="" checked={form.athleticsProf} onChange={(e) => updateForm({ athleticsProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="athleticsExper" className="">Expertise?</label>
            <input type="checkbox" name="athleticsExper" id="athleticsExper" className="" checked={form.athleticsExper} onChange={(e) => updateForm({ athleticsExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="deception"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Deception
            <input
              type="number"
              name="deception"
              id="deception"
              className="grow text-right"
              placeholder="deception"
              value={form.deception}
              onChange={(e) => updateForm({ deception: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="deceptionProf" className="">Proficient?</label>
            <input type="checkbox" name="deceptionProf" id="deceptionProf" className="" checked={form.deceptionProf} onChange={(e) => updateForm({ deceptionProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="deceptionExper" className="">Expertise?</label>
            <input type="checkbox" name="deceptionExper" id="deceptionExper" className="" checked={form.deceptionExper} onChange={(e) => updateForm({ deceptionExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="herstory"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              History
            <input
              type="number"
              name="herstory"
              id="herstory"
              className="grow text-right"
              placeholder="herstory"
              value={form.herstory}
              onChange={(e) => updateForm({ herstory: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="herstoryProf" className="">Proficient?</label>
            <input type="checkbox" name="herstoryProf" id="herstoryProf" className="" checked={form.herstoryProf} onChange={(e) => updateForm({ herstoryProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="herstoryExper" className="">Expertise?</label>
            <input type="checkbox" name="herstoryExper" id="herstoryExper" className="" checked={form.herstoryExper} onChange={(e) => updateForm({ herstoryExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="insight"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Insight
            <input
              type="number"
              name="insight"
              id="insight"
              className="grow text-right"
              placeholder="insight"
              value={form.insight}
              onChange={(e) => updateForm({ insight: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="insightProf" className="">Proficient?</label>
            <input type="checkbox" name="insightProf" id="insightProf" className="" checked={form.insightProf} onChange={(e) => updateForm({ insightProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="insightExper" className="">Expertise?</label>
            <input type="checkbox" name="insightExper" id="insightExper" className="" checked={form.insightExper} onChange={(e) => updateForm({ insightExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="intimidation"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Intimidation
            <input
              type="number"
              name="intimidation"
              id="intimidation"
              className="grow text-right"
              placeholder="intimidation"
              value={form.intimidation}
              onChange={(e) => updateForm({ intimidation: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="intimidationProf" className="">Proficient?</label>
            <input type="checkbox" name="intimidationProf" id="intimidationProf" className="" checked={form.intimidationProf} onChange={(e) => updateForm({ intimidationProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="intimidationExper" className="">Expertise?</label>
            <input type="checkbox" name="intimidationExper" id="intimidationExper" className="" checked={form.intimidationExper} onChange={(e) => updateForm({ intimidationExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="investigation"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Investigation
            <input
              type="number"
              name="investigation"
              id="investigation"
              className="grow text-right"
              placeholder="investigation"
              value={form.investigation}
              onChange={(e) => updateForm({ investigation: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="investigationProf" className="">Proficient?</label>
            <input type="checkbox" name="investigationProf" id="investigationProf" className="" checked={form.investigationProf} onChange={(e) => updateForm({ investigationProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="investigationExper" className="">Expertise?</label>
            <input type="checkbox" name="investigationExper" id="investigationExper" className="" checked={form.investigationExper} onChange={(e) => updateForm({ investigationExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="medicine"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Medicine
            <input
              type="number"
              name="medicine"
              id="medicine"
              className="grow text-right"
              placeholder="medicine"
              value={form.medicine}
              onChange={(e) => updateForm({ medicine: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="medicineProf" className="">Proficient?</label>
            <input type="checkbox" name="medicineProf" id="medicineProf" className="" checked={form.medicineProf} onChange={(e) => updateForm({ medicineProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="medicineExper" className="">Expertise?</label>
            <input type="checkbox" name="medicineExper" id="medicineExper" className="" checked={form.medicineExper} onChange={(e) => updateForm({ medicineExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="nature"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Nature
              <input
              type="number"
              name="nature"
              id="nature"
              className="grow text-right"
              placeholder="nature"
              value={form.nature}
              onChange={(e) => updateForm({ nature: e.target.value })}
              />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="natureProf" className="">Proficient?</label>
            <input type="checkbox" name="natureProf" id="natureProf" className="" checked={form.natureProf} onChange={(e) => updateForm({ natureProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="natureExper" className="">Expertise?</label>
            <input type="checkbox" name="natureExper" id="natureExper" className="" checked={form.natureExper} onChange={(e) => updateForm({ natureExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="perception"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Perception
            <input
              type="number"
              name="perception"
              id="perception"
              className="grow text-right"
              placeholder="perception"
              value={form.perception}
              onChange={(e) => updateForm({ perception: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="perceptionProf" className="">Proficient?</label>
            <input type="checkbox" name="perceptionProf" id="perceptionProf" className="" checked={form.perceptionProf} onChange={(e) => updateForm({ perceptionProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="perceptionExper" className="">Expertise?</label>
            <input type="checkbox" name="perceptionExper" id="perceptionExper" className="" checked={form.perceptionExper} onChange={(e) => updateForm({ perceptionExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="performance"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Performance
            <input
              type="number"
              name="performance"
              id="performance"
              className="grow text-right"
              placeholder="performance"
              value={form.performance}
              onChange={(e) => updateForm({ performance: e.target.value })}
            />
                        <div class="divider divider-horizontal"></div>
            <label htmlFor="performanceProf" className="">Proficient?</label>
            <input type="checkbox" name="performanceProf" id="performanceProf" className="" checked={form.performanceProf} onChange={(e) => updateForm({ performanceProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="performanceExper" className="">Expertise?</label>
            <input type="checkbox" name="performanceExper" id="performanceExper" className="" checked={form.aperformanceExper} onChange={(e) => updateForm({ performanceExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="persuasion"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Persuasion
            <input
              type="number"
              name="persuasion"
              id="persuasion"
              className="grow text-right"
              placeholder="persuasion"
              value={form.persuasion}
              onChange={(e) => updateForm({ persuasion: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="persuasionProf" className="">Proficient?</label>
            <input type="checkbox" name="persuasionProf" id="persuasionProf" className="" checked={form.persuasionProf} onChange={(e) => updateForm({ persuasionProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="persuasionExper" className="">Expertise?</label>
            <input type="checkbox" name="persuasionExper" id="persuasionExper" className="" checked={form.persuasionExper} onChange={(e) => updateForm({ persuasionExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="religion"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Religion
            <input
              type="number"
              name="religion"
              id="religion"
              className="grow text-right"
              placeholder="religion"
              value={form.religion}
              onChange={(e) => updateForm({ religion: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="religionProf" className="">Proficient?</label>
            <input type="checkbox" name="religionProf" id="religionProf" className="" checked={form.religionProf} onChange={(e) => updateForm({ religionProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="religionExper" className="">Expertise?</label>
            <input type="checkbox" name="religionExper" id="religionExper" className="" checked={form.religionExper} onChange={(e) => updateForm({ religionExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="sleight"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Sleight of Hand
            <input
              type="number"
              name="sleight"
              id="sleight"
              className="grow text-right"
              placeholder="sleight"
              value={form.sleight}
              onChange={(e) => updateForm({ sleight: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="sleightProf" className="">Proficient?</label>
            <input type="checkbox" name="sleightProf" id="sleightProf" className="" checked={form.sleightProf} onChange={(e) => updateForm({ sleightProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="sleightExper" className="">Expertise?</label>
            <input type="checkbox" name="sleightExper" id="sleightExper" className="" checked={form.sleightExper} onChange={(e) => updateForm({ sleightExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="stealth"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Stealth
            <input
              type="number"
              name="stealth"
              id="stealth"
              className="grow text-right"
              placeholder="stealth"
              value={form.stealth}
              onChange={(e) => updateForm({ stealth: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="stealthProf" className="">Proficient?</label>
            <input type="checkbox" name="stealthProf" id="stealthProf" className="" checked={form.stealthProf} onChange={(e) => updateForm({ stealthProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="stealthExper" className="">Expertise?</label>
            <input type="checkbox" name="stealthExper" id="stealthExper" className="" checked={form.stealthExper} onChange={(e) => updateForm({ stealthExper: e.target.checked })} />
              </label>
          </div>
          <div>
            <label
              htmlFor="survival"
              class="input input-bordered flex items-center gap-2 w-auto"
            >
              Survival
            <input
              type="number"
              name="survival"
              id="survival"
              className="grow text-right"
              placeholder="survival"
              value={form.survival}
              onChange={(e) => updateForm({ survival: e.target.value })}
              />
                          <div class="divider divider-horizontal"></div>
            <label htmlFor="survivalProf" className="">Proficient?</label>
            <input type="checkbox" name="survivalProf" id="survivalProf" className="" checked={form.survivalProf} onChange={(e) => updateForm({ survivalProf: e.target.checked })} />
            <div class="divider divider-horizontal"></div>
            <label htmlFor="survivalExper" className="">Expertise?</label>
            <input type="checkbox" name="survivalExper" id="survivalExper" className="" checked={form.survivalExper} onChange={(e) => updateForm({ survivalExper: e.target.checked })} />
              </label>
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