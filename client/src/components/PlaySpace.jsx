import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hand from "./Hand";
import Card from "./Card";
import Economy from "./Economy";
import Resources from  "./Resources";



function dispBonus(num) {
  // 14 = 14 - 10 = 4 / 2 = +2
  // 8 = 8 - 10 = -2 /2 = -1
  let val = (num - 10) / 2
  return (val > 0) ? "+" + Math.floor(val) : "-" + Math.ceil(val);
}

export default function PlaySpace() {
  const [char, setChar] = useState({});
  const [economy, setEconomy] = useState([1, 2, 3])
  const [deck, setDeck] = useState([])
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  let nextId = 0;

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
      setChar(record);
      setDeck(Object.values(record.deck))
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // updateChar({ deck: deckObj })

  function saveDeck() {
    console.log('From PlayPlace it\'s saveDeck.')
    console.log(deck)
    const newDeck = { ...deck}
    updateChar({ deck: newDeck })
    
    console.log('See if it added to char...')
    console.log(char.deck);
    onSubmit()  
  }
  // These methods will update the state properties.
  function updateChar(value) {
    return setChar((prev) => {
      return { ...prev, ...value };
    });
  }

  const updateDeck = (value) => {
    setDeck(prevDeck => [...prevDeck, {id: nextId++, ...value}]);
  }

  const updateEcon = (value) => {
    setEconomy(value);
  }

  // This function will handle the submission.
  async function onSubmit() {
    //e.preventDefault();
    const person = { ...char };
    try {
      let response;

      // if we are updating a record we will PATCH to /record/:id.
      response = await fetch(`http://localhost:5050/record/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      console.log('Completed submission.');
    }
  }

  // This following section will display the playspace
  return (
    <>
    <div class="grid grid-cols-12 auto-rows-max gap-4">
      
      {/* Name Badge */}
      <div class="z-10 col-start-1 row-start-1 col-span-2 row-span-auto p-2 gap-4 card bg-neutral flex items-center  flex-row">
        <div class="avatar placeholder basis-1/4">
          <div class="bg-base-200 text-neutral-content w-24 rounded-full">
            <span class="text-3xl">D</span>
          </div>
        </div>
        <div class="flex flex-col basis-3/4">
          <div class="card-title">{char.name}</div>
          <div>Level {char.level} {char.class}</div>
          <div>{char.race}</div>
        </div>
      </div>

      {/* Health and AC */}
      <div class="z-10 col-start-3 col-span-2 row-start-1 row-span-2 p-2 card bg-neutral">
        <div class="stats stats-vertical bg-neutral">
          <div class="stat">
            <div class="stat-title">
              Hit Points
            </div>
            <div class="stat-value text-center">
              {char.curHP}
            </div>
            <div class="stat-desc text-base text-right">
              / {char.maxHP}
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">
              Armor Class
            </div>
            <div class="stat-value text-center">
              {char.ac}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Bar */}
      <div class="z-10 col-start-5 col-end-13 row-start-1 row-span-1 p-4 card bg-neutral">
        <Economy resources={economy} setter={setEconomy}/>
      
      </div>

      {/* Floaters */}
      <div class="z-10 col-end-13 row-end-8">
        <Card deck={deck} setter={updateDeck} resources={char.resource}/>
        <button className="btn btn-secondary btn-circle" onClick={saveDeck}>S</button>
      </div>

      {/* Stats and Skills */}
      <div class="z-10 col-start-1 col-span-2 row-start-2 row-span-4 p-4 rounded-lg bg-neutral">
        <div role="tablist" class="tabs tabs-xl tabs-bordered">
            <input type="radio" name="stat_tabs" role="tab" checked="checked" class="tab" aria-label="Stats" />
            <div role="tabpanel" class="tab-content p-10">
              <div class="grid grid-cols-2 grid-rows-3 gap-10 place-items-center">

                <div class="avatar placeholder indicator order-1">
                  <span class="indicator-item indicator-top indicator-center badge badge-primary">Strength</span>
                  <div class="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span class="text-3xl">{dispBonus(char.str)}</span>
                  </div>
                  <span class="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.str}</span>
                </div>

                <div class="avatar placeholder indicator order-3">
                  <span class="indicator-item indicator-top indicator-center badge badge-primary">Dexterity</span>
                  <div class="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span class="text-3xl">{dispBonus(char.dex)}</span>
                  </div>
                  <span class="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.dex}</span>
                </div>

                <div class="avatar placeholder indicator order-5">
                  <span class="indicator-item indicator-top indicator-center badge badge-primary">Constitution</span>
                  <div class="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span class="text-3xl">{dispBonus(char.con)}</span>
                  </div>
                  <span class="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.con}</span>
                </div>

                <div class="avatar placeholder indicator order-2">
                  <span class="indicator-item indicator-top indicator-center badge badge-primary">Intelligence</span>
                  <div class="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span class="text-3xl">{dispBonus(char.inte)}</span>
                  </div>
                  <span class="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.inte}</span>
                </div>

                <div class="avatar placeholder indicator order-4">
                  <span class="indicator-item indicator-top indicator-center badge badge-primary">Wisdom</span>
                  <div class="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span class="text-3xl">{dispBonus(char.wis)}</span>
                  </div>
                  <span class="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.wis}</span>
                </div>

                <div class="avatar placeholder indicator order-6">
                  <span class="indicator-item indicator-top indicator-center badge badge-primary">Charisma</span>
                  <div class="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span class="text-3xl">{dispBonus(char.cha)}</span>
                  </div>
                  <span class="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.cha}</span>
                </div>

              </div>
            </div>

            <input type="radio" name="stat_tabs" role="tab" class="tab" aria-label="Skills" />
            <div role="tabpanel" class="tab-content p-2">
              <table class="table-sm">
                <thead>
                  <tr>
                    <td>Bonus</td>
                    <td>Skill</td>
                    <td>Prof</td>
                    <td>Exper</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{char.acrobatics}</td>
                    <td>Acrobats (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.acrobatcsProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.acrobatcsExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.animalHandling}</td>
                    <td>Animal Handling (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.animalHandlingProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.animalHandlingExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.arcana}</td>
                    <td>Arcana (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.arcanaProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.arcanaExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.athletics}</td>
                    <td>Athletics (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.athleticsProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.athleticsExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.deception}</td>
                    <td>Deception (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.deceptionProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.deceptionExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.herstory}</td>
                    <td>History (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.herstoryProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.herstoryExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.insight}</td>
                    <td>Insight (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.insightProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.insightExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.intimidation}</td>
                    <td>Intimidation (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.intimidationProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.intimidationExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.investigation}</td>
                    <td>Investigation (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.investigationProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.investigationExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.medicine}</td>
                    <td>Medicine (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.medicineProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.medicineExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.nature}</td>
                    <td>Nature (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.natureProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.natureExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.perception}</td>
                    <td>Perception (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.perceptionProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.perceptionExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.performance}</td>
                    <td>Performance (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.performanceProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.performanceExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.persuasion}</td>
                    <td>Persuasion (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.persuasionProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.persuasionExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.religion}</td>
                    <td>Religion (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.religionProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.religionExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.sleight}</td>
                    <td>Sleight of Hand (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.sleightProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.sleightExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.stealth}</td>
                    <td>Stealth (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.stealthProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.stealthExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                  <tr>
                    <td>{char.survival}</td>
                    <td>Survival (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.survivalProf} style={{pointerEvents: 'none'}}/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.survivalExper} style={{pointerEvents: 'none'}}/></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <a name="stat-tabs" role="tab" class="tab grow"></a>
        </div>
      </div>

      {/* Resources */}
      <div class="z-10 col-start-1 col-span-2 row-span-4 p-4 rounded-lg bg-neutral">
        <div role="tablist" class="tabs tabs-bordered">
          <a role="tab" class="tab tab-active">Resources</a>
          <a role="tab" class="tab grow"></a>
        </div>
        <div class="p-2">
          <Resources char={char} setter={updateChar}/>
        </div>
      </div>

      {/* Play Area */}
      <div class="z-0 col-start-3 row-start-3 col-span-full row-span-12 ">
        <div class="flex flex-row flex-wrap-reverse gap-2">
          <Hand character={char} updater={updateChar} activeDeck={deck} economy={economy} setEconomy={setEconomy}/>
        </div>
      </div>
    </div>
    </>
  );
}