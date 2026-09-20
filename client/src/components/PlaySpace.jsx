import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hand from "./Hand";
import Card from "./Card";
import Economy from "./Economy";
import Resources from "./Resources";

const API_BASE = "http://localhost:5050/characters";

const ABILITY_LABELS = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  inte: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const SKILL_LIST = [
  { key: "acrobatics", label: "Acrobatics", ability: "Dex" },
  { key: "animalHandling", label: "Animal Handling", ability: "Wis" },
  { key: "arcana", label: "Arcana", ability: "Int" },
  { key: "athletics", label: "Athletics", ability: "Str" },
  { key: "deception", label: "Deception", ability: "Cha" },
  { key: "history", label: "History", ability: "Int" },
  { key: "insight", label: "Insight", ability: "Wis" },
  { key: "intimidation", label: "Intimidation", ability: "Cha" },
  { key: "investigation", label: "Investigation", ability: "Int" },
  { key: "medicine", label: "Medicine", ability: "Wis" },
  { key: "nature", label: "Nature", ability: "Int" },
  { key: "perception", label: "Perception", ability: "Wis" },
  { key: "performance", label: "Performance", ability: "Cha" },
  { key: "persuasion", label: "Persuasion", ability: "Cha" },
  { key: "religion", label: "Religion", ability: "Int" },
  { key: "sleightOfHand", label: "Sleight of Hand", ability: "Dex" },
  { key: "stealth", label: "Stealth", ability: "Dex" },
  { key: "survival", label: "Survival", ability: "Wis" },
];

function formatBonus(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export default function PlaySpace() {
  const [char, setChar] = useState({});
  const [economy, setEconomy] = useState([1, 2, 3]);
  const [deck, setDeck] = useState([]);
  const [nextId, setNextId] = useState(0);
  const [health, setHealth] = useState({ heal: true, amt: 0 });

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setChar(record);
      const deckArr = record.deck || [];
      setDeck(deckArr);
      setNextId(deckArr.length);
    }
    fetchData();
  }, [params.id, navigate]);

  function updateHealth(value) {
    setHealth((prev) => ({ ...prev, ...value }));
  }

  function applyHealth() {
    let hp = Number(char.curHP);
    hp = health.heal
      ? hp + Number(health.amt)
      : hp - Number(health.amt);
    updateChar({ curHP: hp });
    document.getElementById("modify_modal").close();
    updateHealth({ heal: true, amt: 0 });
  }

  function saveDeck() {
    updateChar({ deck: deck });
    onSubmit();
  }

  function updateChar(value) {
    setChar((prev) => ({ ...prev, ...value }));
  }

  function updateDeck(value, del = false) {
    if (del) {
      setDeck(value);
    } else {
      setDeck((prevDeck) => [...prevDeck, { ...value }]);
    }
  }

  function toggleBtns(btn) {
    if (btn === "heal") {
      document.getElementById("healBtn").classList.add("btn-success");
      document.getElementById("harmBtn").classList.remove("btn-error");
      updateHealth({ heal: true });
    } else {
      document.getElementById("healBtn").classList.remove("btn-success");
      document.getElementById("harmBtn").classList.add("btn-error");
      updateHealth({ heal: false });
    }
  }

  function toggleVis() {
    const toggleNodes = document.getElementsByName("hidey");
    for (let i = 0; i < toggleNodes.length; i++) {
      toggleNodes[i].classList.toggle("hidden");
    }
  }

  async function onSubmit() {
    const person = { ...char };
    person.deck = [...deck];

    try {
      const response = await fetch(`${API_BASE}/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    }
  }

  const classDisplay = char.classes
    ? char.classes.map((c) => `${c.class} ${c.level}`).join(" / ")
    : "";

  return (
    <>
      <div className="grid grid-cols-12 auto-rows-max gap-4">
        {/* Name Badge */}
        <div className="z-10 col-start-1 row-start-1 col-span-2 row-span-auto p-2 gap-4 card bg-neutral flex items-center flex-row">
          <div className="flex flex-col">
            <div className="card-title">{char.name}</div>
            <div>Level {char.totalLevel} {classDisplay}</div>
            <div>{char.race}</div>
          </div>
        </div>

        {/* Health and AC */}
        <div className="z-10 col-start-3 col-span-2 row-start-1 row-span-2 p-2 card bg-neutral">
          <div className="stats stats-vertical bg-neutral">
            <div
              className="stat"
              onClick={() =>
                document.getElementById("modify_modal").showModal()
              }
            >
              <div className="stat-title">Hit Points</div>
              <div className="stat-value text-center">{char.curHP}</div>
              <div className="stat-desc text-base text-right">
                / {char.maxHP}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Armor Class</div>
              <div className="stat-value text-center">{char.ac}</div>
            </div>
          </div>
        </div>

        {/* Economy Bar */}
        <div className="z-10 col-start-5 col-end-13 row-start-1 row-span-1 p-4 card bg-neutral">
          <Economy resources={economy} setter={setEconomy} />
        </div>

        {/* Floaters */}
        <div className="z-10 col-end-13 col-span-2 flex flex-row justify-end">
          <Card
            id={nextId}
            setId={setNextId}
            deck={deck}
            setter={updateDeck}
            resources={char.resources}
          />
          <button
            className="btn btn-primary btn-circle btn-lg"
            onClick={() =>
              document.getElementById("new_modal_card").showModal()
            }
          >
            <span className="material-icons">add</span>
          </button>
          <button
            className="btn btn-accent btn-circle btn-lg"
            onClick={toggleVis}
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            className="btn btn-secondary btn-circle btn-lg"
            onClick={saveDeck}
          >
            <span className="material-icons">save</span>
          </button>
        </div>

        {/* Stats and Skills */}
        <div className="z-10 col-start-1 col-span-2 row-start-2 row-span-4 p-4 rounded-lg bg-neutral">
          <div role="tablist" className="tabs tabs-xl tabs-bordered">
            <input
              type="radio"
              name="stat_tabs"
              role="tab"
              defaultChecked={true}
              className="tab"
              aria-label="Stats"
            />
            <div role="tabpanel" className="tab-content p-10">
              <div className="grid grid-cols-2 grid-rows-3 gap-10 place-items-center">
                {Object.entries(ABILITY_LABELS).map(([key, label], i) => (
                  <div
                    key={key}
                    className={`avatar placeholder indicator order-${i + 1}`}
                  >
                    <span className="indicator-item indicator-top indicator-center badge badge-primary">
                      {label}
                    </span>
                    <div className="bg-base-200 text-neutral-content w-24 mask mask-hexagon">
                      <span className="text-3xl">
                        {formatBonus(char[`${key}Bonus`] ?? 0)}
                      </span>
                    </div>
                    <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">
                      {char[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="radio"
              name="stat_tabs"
              role="tab"
              className="tab"
              aria-label="Skills"
            />
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
                  {SKILL_LIST.map(({ key, label, ability }) => {
                    const skillData = char.skills instanceof Map
                      ? char.skills.get(key)
                      : char.skills?.[key];
                    return (
                      <tr key={key}>
                        <td>{formatBonus(char[`${key}Total`] ?? 0)}</td>
                        <td>
                          {label} ({ability})
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={skillData?.proficient || false}
                            style={{ pointerEvents: "none" }}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={skillData?.expertise || false}
                            style={{ pointerEvents: "none" }}
                            readOnly
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <a name="stat-tabs" role="tab" className="tab grow"></a>
          </div>
        </div>

        {/* Resources */}
        <div className="z-10 col-start-1 col-span-2 row-span-4 p-4 rounded-lg bg-neutral">
          <div role="tablist" className="tabs tabs-bordered">
            <a role="tab" className="tab tab-active">
              Resources
            </a>
            <a role="tab" className="tab grow"></a>
          </div>
          <div className="p-2">
            <Resources char={char} setter={updateChar} />
          </div>
        </div>

        {/* Play Area */}
        <div className="z-0 col-start-3 row-start-3 col-span-full row-span-12">
          <div className="flex flex-row flex-wrap-reverse gap-2">
            <Hand
              character={char}
              updateChar={updateChar}
              activeDeck={deck}
              updateDeck={updateDeck}
              economy={economy}
              setEconomy={setEconomy}
            />
          </div>
        </div>
      </div>

      <dialog id="modify_modal" className="modal">
        <div className="modal-box">
          <div className="join flex flex-row">
            <button
              id="healBtn"
              className="join-item btn btn-success"
              onClick={() => toggleBtns("heal")}
            >
              Heal
            </button>
            <button
              id="harmBtn"
              className="join-item btn"
              onClick={() => toggleBtns("harm")}
            >
              Harm
            </button>
            <input
              id="modifyAmt"
              type="number"
              className="join-item grow text-right"
              value={health.amt}
              onChange={(e) => updateHealth({ amt: e.target.value })}
            />
            <button
              id="confirm"
              className="btn btn-primary"
              onClick={() => applyHealth()}
            >
              Apply
            </button>
          </div>
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
