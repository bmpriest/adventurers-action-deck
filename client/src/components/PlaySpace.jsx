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
  const [nextId, setNextId] = useState(0)
  const [health, setHealth] = useState({heal: true, amt: 0});

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
      setChar(record);
      setDeck(Object.values(record.deck))
      setNextId(Object.values(record.deck).length)
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // updateChar({ deck: deckObj })

  function updateHealth(value) {
    return setHealth((prev) => {
      return { ...prev, ...value };
    });
  }

  function applyHealth() {
    console.log(char.curHP)
    console.log(health.amt)
    let hp = Number(char.curHP)
    hp = health.heal ? hp + Number(health.amt) : hp - Number(health.amt)
    updateChar({curHP: hp})
    document.getElementById('modify_modal').close();
    updateHealth({heal: true, amt: 0})
  }

  function saveDeck() {
    let newDeck = deck;
    updateChar({ deck: newDeck })
    onSubmit()  
  }

  // These methods will update the state properties.
  function updateChar(value) {
    return setChar((prev) => {
      return { ...prev, ...value };
    });
  }

  function updateDeck(value, del = false) {
    if (del) {
      return setDeck(value);
    } else {
    return setDeck((prevDeck) => {
      return [...prevDeck, {...value}]});
    }
  }

  function toggleBtns(btn) {
    if (btn == "heal") {
      document.getElementById("healBtn").classList.add("btn-success")
      document.getElementById("harmBtn").classList.remove("btn-error")
      updateHealth({heal: true})
    } else {
      document.getElementById("healBtn").classList.remove("btn-success")
      document.getElementById("harmBtn").classList.add("btn-error")
      updateHealth({heal: false})
    }
  }

  const updateEcon = (value) => {
    setEconomy(value);
  }

  function toggleVis() {
    let toggleNodes = document.getElementsByName('hidey');
    console.log(toggleNodes)
    for (let i = 0; i < toggleNodes.length; i++) {
      toggleNodes[i].classList.toggle("hidden")
    }
  }

  function printDeck() {
    console.log('Deck is: ')
    console.log(deck)
    console.log('Nextid is: ' + nextId)
  }

  // This function will handle the submission.
  async function onSubmit() {
    //e.preventDefault();
    const person = { ...char };
    person.deck = {...deck};

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
    <div className="grid grid-cols-12 auto-rows-max gap-4">
      
      {/* Name Badge */}
      <div className="z-10 col-start-1 row-start-1 col-span-2 row-span-auto p-2 gap-4 card bg-neutral flex items-center flex-row">
        {/* <div className="avatar placeholder basis-1/4">
          <div className="bg-base-200 text-neutral-content w-24 rounded-full">
            <span className="text-3xl">D</span>
          </div>
        </div> */}
        <div className="flex flex-col">
          <div className="card-title">{char.name}</div>
          <div>Level {char.level} {char.class}</div>
          <div>{char.race}</div>
        </div>
      </div>

      {/* Health and AC */}
      <div className="z-10 col-start-3 col-span-2 row-start-1 row-span-2 p-2 card bg-neutral">
        <div className="stats stats-vertical bg-neutral">
          <div className="stat" onClick={() => document.getElementById('modify_modal').showModal()}>
            <div className="stat-title">
              Hit Points
            </div>
            <div className="stat-value text-center">
              {char.curHP}
            </div>
            <div className="stat-desc text-base text-right">
              / {char.maxHP}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">
              Armor Class
            </div>
            <div className="stat-value text-center">
              {char.ac}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Bar */}
      <div className="z-10 col-start-5 col-end-13 row-start-1 row-span-1 p-4 card bg-neutral">
        <Economy resources={economy} setter={setEconomy}/>
        
      </div>

      {/* Floaters */}
      <div className="z-10 col-end-13 col-span-2 flex flex-row justify-end">
        <Card id={nextId} setId={setNextId} deck={deck} setter={updateDeck} resources={char.resource}/>
        <button className="btn btn-primary btn-circle btn-lg" onClick={() => document.getElementById('new_modal_card').showModal()}><span className="material-icons">add</span></button>
        <button className="btn btn-accent btn-circle btn-lg" onClick={toggleVis}><span className="material-icons">edit</span></button>
        <button className="btn btn-secondary btn-circle btn-lg" onClick={saveDeck}><span className="material-icons">save</span></button>
        {/* <button className="btn btn-circle btn-lg" onClick={() => printDeck()}><span className="material-symbols-outlined">swords</span></button> */}
      </div>

      {/* Stats and Skills */}
      <div className="z-10 col-start-1 col-span-2 row-start-2 row-span-4 p-4 rounded-lg bg-neutral">
        <div role="tablist" className="tabs tabs-xl tabs-bordered">
            <input type="radio" name="stat_tabs" role="tab" defaultChecked={true} className="tab" aria-label="Stats" />
            <div role="tabpanel" className="tab-content p-10">
              <div className="grid grid-cols-2 grid-rows-3 gap-10 place-items-center">

                <div className="avatar placeholder indicator order-1">
                  <span className="indicator-item indicator-top indicator-center badge badge-primary">Strength</span>
                  <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span className="text-3xl">{dispBonus(char.str)}</span>
                  </div>
                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.str}</span>
                </div>

                <div className="avatar placeholder indicator order-3">
                  <span className="indicator-item indicator-top indicator-center badge badge-primary">Dexterity</span>
                  <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span className="text-3xl">{dispBonus(char.dex)}</span>
                  </div>
                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.dex}</span>
                </div>

                <div className="avatar placeholder indicator order-5">
                  <span className="indicator-item indicator-top indicator-center badge badge-primary">Constitution</span>
                  <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span className="text-3xl">{dispBonus(char.con)}</span>
                  </div>
                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.con}</span>
                </div>

                <div className="avatar placeholder indicator order-2">
                  <span className="indicator-item indicator-top indicator-center badge badge-primary">Intelligence</span>
                  <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span className="text-3xl">{dispBonus(char.inte)}</span>
                  </div>
                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.inte}</span>
                </div>

                <div className="avatar placeholder indicator order-4">
                  <span className="indicator-item indicator-top indicator-center badge badge-primary">Wisdom</span>
                  <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span className="text-3xl">{dispBonus(char.wis)}</span>
                  </div>
                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.wis}</span>
                </div>

                <div className="avatar placeholder indicator order-6">
                  <span className="indicator-item indicator-top indicator-center badge badge-primary">Charisma</span>
                  <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                    <span className="text-3xl">{dispBonus(char.cha)}</span>
                  </div>
                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">{char.cha}</span>
                </div>

              </div>
            </div>

            <input type="radio" name="stat_tabs" role="tab" className="tab" aria-label="Skills" />
            <div role="tabpanel" className="tab-content p-2">
              <table className="table-xs">
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
                    <td><input type="checkbox" className="checkbox" checked={char.acrobatcsProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.acrobatcsExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.animalHandling}</td>
                    <td>Animal Handling (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.animalHandlingProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.animalHandlingExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.arcana}</td>
                    <td>Arcana (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.arcanaProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.arcanaExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.athletics}</td>
                    <td>Athletics (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.athleticsProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.athleticsExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.deception}</td>
                    <td>Deception (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.deceptionProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.deceptionExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.herstory}</td>
                    <td>History (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.herstoryProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.herstoryExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.insight}</td>
                    <td>Insight (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.insightProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.insightExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.intimidation}</td>
                    <td>Intimidation (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.intimidationProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.intimidationExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.investigation}</td>
                    <td>Investigation (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.investigationProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.investigationExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.medicine}</td>
                    <td>Medicine (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.medicineProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.medicineExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.nature}</td>
                    <td>Nature (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.natureProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.natureExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.perception}</td>
                    <td>Perception (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.perceptionProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.perceptionExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.performance}</td>
                    <td>Performance (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.performanceProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.performanceExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.persuasion}</td>
                    <td>Persuasion (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.persuasionProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.persuasionExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.religion}</td>
                    <td>Religion (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.religionProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.religionExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.sleight}</td>
                    <td>Sleight of Hand (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.sleightProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.sleightExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.stealth}</td>
                    <td>Stealth (Dex)</td>
                    <td><input type="checkbox" className="checkbox" value={char.stealthProf} checked={char.stealthProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" value={char.stealthExper} checked={char.stealthExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                  <tr>
                    <td>{char.survival}</td>
                    <td>Survival (Dex)</td>
                    <td><input type="checkbox" className="checkbox" checked={char.survivalProf} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                    <td><input type="checkbox" className="checkbox" checked={char.survivalExper} style={{pointerEvents: 'none'}} readOnly={true}/></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <a name="stat-tabs" role="tab" className="tab grow"></a>
        </div>
      </div>

      {/* Resources */}
      <div className="z-10 col-start-1 col-span-2 row-span-4 p-4 rounded-lg bg-neutral">
        <div role="tablist" className="tabs tabs-bordered">
          <a role="tab" className="tab tab-active">Resources</a>
          <a role="tab" className="tab grow"></a>
        </div>
        <div className="p-2">
          <Resources char={char} setter={updateChar}/>
        </div>
      </div>

      {/* Play Area */}
      <div className="z-0 col-start-3 row-start-3 col-span-full row-span-12 ">
        <div className="flex flex-row flex-wrap-reverse gap-2">
          <Hand character={char} updateChar={updateChar} activeDeck={deck} updateDeck={updateDeck} economy={economy} setEconomy={setEconomy}/>
        </div>
      </div>
    </div>


  <dialog id="modify_modal" className="modal">
    <div className="modal-box">

        <div className="join flex flex-row">
          <button id="healBtn" className="join-item btn btn-success" onClick={() => toggleBtns('heal')}>Heal</button>
          <button id="harmBtn" className="join-item btn" onClick={() => toggleBtns('harm')}>Harm</button>
          <input id="modifyAmt" type="number" className="join-item grow text-right" value={health.amt} onChange={(e) => updateHealth({ amt: e.target.value})}></input>
          <button id="confirm" className="btn btn-primary" onClick={() => applyHealth()}>Apply</button>
        </div>

        {/* <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form> */}

    </div>
  </dialog>
  <dialog id="roll_modal" className="modal">
  <div className="modal-box">
    <h3 className="text-lg font-bold">Hello!</h3>
    <p className="py-4">Press ESC key or click outside to close</p>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
    </>
  );
}