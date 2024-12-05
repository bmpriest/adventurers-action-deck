import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Deck from "./Deck";



function dispBonus(num) {
  // 14 = 14 - 10 = 4 / 2 = +2
  // 8 = 8 - 10 = -2 /2 = -1
  let val = (num - 10) / 2
  return (val > 0) ? "+" + Math.floor(val) : "-" + Math.ceil(val);
}

export default function PlaySpace() {
  const [char, setChar] = useState({});
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
      setChar(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateChar(value) {
    return setChar((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...char };
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
      setChar({});
      navigate("/");
    }
  }

  // This following section will display the playspace that takes the input from the user.
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
      <div class="z-10 col-start-3 row-start-1 col-span-1 row-span-2 p-2 card bg-neutral">
        <div class="stats stats-vertical bg-neutral">
          <div class="stat">
            <div class="stat-title">
              Hit Points
            </div>
            <div class="stat-value text-center">
              119
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
      <div class="z-10 col-start-4 row-start-1 col-end-13 row-span-1 p-4 card bg-neutral">Resource Bar</div>

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
                    <td><input type="checkbox" class="checkbox" checked={char.acrobatcsProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.acrobatcsExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.animalHandling}</td>
                    <td>Animal Handling (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.animalHandlingProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.animalHandlingExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.arcana}</td>
                    <td>Arcana (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.arcanaProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.arcanaExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.athletics}</td>
                    <td>Athletics (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.athleticsProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.athleticsExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.deception}</td>
                    <td>Deception (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.deceptionProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.deceptionExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.herstory}</td>
                    <td>History (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.herstoryProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.herstoryExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.insight}</td>
                    <td>Insight (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.insightProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.insightExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.intimidation}</td>
                    <td>Intimidation (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.intimidationProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.intimidationExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.investigation}</td>
                    <td>Investigation (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.investigationProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.investigationExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.medicine}</td>
                    <td>Medicine (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.medicineProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.medicineExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.nature}</td>
                    <td>Nature (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.natureProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.natureExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.perception}</td>
                    <td>Perception (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.perceptionProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.perceptionExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.performance}</td>
                    <td>Performance (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.performanceProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.performanceExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.persuasion}</td>
                    <td>Persuasion (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.persuasionProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.persuasionExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.religion}</td>
                    <td>Religion (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.religionProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.religionExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.sleight}</td>
                    <td>Sleight of Hand (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.sleightProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.sleightExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.stealth}</td>
                    <td>Stealth (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.stealthProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.stealthExper} disabled/></td>
                  </tr>
                  <tr>
                    <td>{char.survival}</td>
                    <td>Survival (Dex)</td>
                    <td><input type="checkbox" class="checkbox" checked={char.survivalProf} disabled/></td>
                    <td><input type="checkbox" class="checkbox" checked={char.survivalExper} disabled/></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {/* Play Area */}
      <div class="z-0 col-start-3 row-start-3 col-span-full row-span-12 ">
        <div class="place-self-end flex flex-row flex-wrap-reverse gap-2">
        
          <Deck></Deck>
        </div>
      </div>
    </div>
    </>
  );
}