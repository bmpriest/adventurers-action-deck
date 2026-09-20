import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5050/characters";

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

const SAVE_ABILITIES = [
  { key: "str", label: "Strength" },
  { key: "dex", label: "Dexterity" },
  { key: "con", label: "Constitution" },
  { key: "inte", label: "Intelligence" },
  { key: "wis", label: "Wisdom" },
  { key: "cha", label: "Charisma" },
];

function emptyForm() {
  return {
    name: "",
    classes: [{ class: "", level: 1 }],
    xp: 0,
    race: "",
    background: "",
    str: 10,
    dex: 10,
    con: 10,
    inte: 10,
    wis: 10,
    cha: 10,
    maxHP: 10,
    curHP: 10,
    ac: 10,
    speed: 30,
    hitDie: "",
    saveProficiencies: {
      str: false,
      dex: false,
      con: false,
      inte: false,
      wis: false,
      cha: false,
    },
    skills: Object.fromEntries(
      SKILL_LIST.map((s) => [s.key, { proficient: false, expertise: false }])
    ),
    resources: [{ title: "", maxValue: 0, curValue: 0, number: false, shape: "" }],
    deck: [],
  };
}

export default function Character() {
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
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
      setForm(record);
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  // --- Classes ---

  function updateClass(index, field, value) {
    const updated = [...form.classes];
    updated[index] = { ...updated[index], [field]: field === "level" ? Number(value) || 1 : value };
    updateForm({ classes: updated });
  }

  function addClass(e) {
    e.preventDefault();
    updateForm({ classes: [...form.classes, { class: "", level: 1 }] });
  }

  function removeClass(index) {
    const updated = [...form.classes];
    updated.splice(index, 1);
    updateForm({ classes: updated });
  }

  // --- Skills ---

  function updateSkill(skillKey, field, value) {
    const updated = { ...form.skills };
    updated[skillKey] = { ...updated[skillKey], [field]: value };
    updateForm({ skills: updated });
  }

  // --- Save proficiencies ---

  function updateSaveProf(ability, value) {
    updateForm({
      saveProficiencies: { ...form.saveProficiencies, [ability]: value },
    });
  }

  // --- Resources ---

  function handleResChange(event, index) {
    const data = [...form.resources];
    const val = event.target.name === "maxValue"
      ? event.target.value
      : event.target.value;
    data[index] = { ...data[index], [event.target.name]: val };
    if (event.target.name === "maxValue") {
      data[index].curValue = event.target.value;
    }
    updateForm({ resources: data });
  }

  function addResource(e) {
    e.preventDefault();
    updateForm({
      resources: [
        ...form.resources,
        { title: "", maxValue: 0, curValue: 0, number: false, shape: "" },
      ],
    });
  }

  function rmvResource(index) {
    const data = [...form.resources];
    data.splice(index, 1);
    updateForm({ resources: data });
  }

  function handleRadio(event, index) {
    const data = [...form.resources];
    if (event.target.id === "number") {
      data[index] = { ...data[index], number: true, shape: "" };
    } else {
      data[index] = { ...data[index], number: false };
    }
    updateForm({ resources: data });
  }

  function renderResource(index) {
    const r = form.resources[index];
    if (r.number) {
      return (
        <div>
          {r.title} {r.curValue} / {r.maxValue}
        </div>
      );
    }
    return (
      <div>
        {r.title}
        <div className="rating">
          {Array.from(Array(Number(r.maxValue) || 0), (_, i) => (
            <input
              type="radio"
              name="previewRating"
              className={"mask " + r.shape}
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    const body = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        response = await fetch(`${API_BASE}/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        Create/Update Your Character
      </h3>
      <form onSubmit={onSubmit}>
        {/* Character Info */}
        <div className="card card-bordered bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Character Info</h2>

            <label
              htmlFor="name"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Character Name
              <input
                type="text"
                name="name"
                id="name"
                className="grow text-right"
                placeholder="First Last"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
              />
            </label>

            <label
              htmlFor="xp"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Experience Points
              <input
                type="number"
                name="xp"
                id="xp"
                className="grow text-right"
                placeholder="0"
                value={form.xp}
                onChange={(e) => updateForm({ xp: Number(e.target.value) })}
              />
            </label>

            <label
              htmlFor="race"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Race
              <input
                type="text"
                name="race"
                id="race"
                className="grow text-right"
                placeholder="Race"
                value={form.race}
                onChange={(e) => updateForm({ race: e.target.value })}
              />
            </label>

            <label
              htmlFor="background"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Background
              <input
                type="text"
                name="background"
                id="background"
                className="grow text-right"
                placeholder="Background"
                value={form.background}
                onChange={(e) => updateForm({ background: e.target.value })}
              />
            </label>
          </div>
        </div>

        <br />

        {/* Classes */}
        <div className="card card-bordered bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Classes</h2>
            {form.classes.map((cls, index) => (
              <div key={index} className="flex items-center gap-2">
                <label className="input input-bordered flex items-center gap-2 grow">
                  Class
                  <input
                    type="text"
                    className="grow text-right"
                    placeholder="Paladin"
                    value={cls.class}
                    onChange={(e) => updateClass(index, "class", e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 w-32">
                  Level
                  <input
                    type="number"
                    className="grow text-right w-16"
                    min="1"
                    max="20"
                    value={cls.level}
                    onChange={(e) => updateClass(index, "level", e.target.value)}
                  />
                </label>
                {form.classes.length > 1 && (
                  <button
                    className="btn btn-circle btn-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      removeClass(index);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <div className="label">
              <span className="label-text-alt">
                <button className="btn btn-xs" onClick={addClass}>
                  Add Class
                </button>
              </span>
            </div>
          </div>
        </div>

        <br />

        {/* Stats */}
        <div className="card card-bordered bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Ability Scores</h2>
            {SAVE_ABILITIES.map(({ key, label }) => (
              <label
                key={key}
                htmlFor={key}
                className="input input-bordered flex items-center gap-2 w-auto"
              >
                {label}
                <input
                  type="number"
                  name={key}
                  id={key}
                  className="grow text-right"
                  placeholder="10"
                  value={form[key]}
                  onChange={(e) =>
                    updateForm({ [key]: Number(e.target.value) })
                  }
                />
              </label>
            ))}

            <br />

            <label
              htmlFor="maxHP"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Maximum HP
              <input
                type="number"
                name="maxHP"
                id="maxHP"
                className="grow text-right"
                value={form.maxHP}
                onChange={(e) =>
                  updateForm({
                    maxHP: Number(e.target.value),
                    curHP: Number(e.target.value),
                  })
                }
              />
            </label>

            <label
              htmlFor="ac"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Armor Class
              <input
                type="number"
                name="ac"
                id="ac"
                className="grow text-right"
                value={form.ac}
                onChange={(e) =>
                  updateForm({ ac: Number(e.target.value) })
                }
              />
            </label>

            <label
              htmlFor="speed"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Speed
              <input
                type="number"
                name="speed"
                id="speed"
                className="grow text-right"
                value={form.speed}
                onChange={(e) =>
                  updateForm({ speed: Number(e.target.value) })
                }
              />
            </label>

            <label
              htmlFor="hitDie"
              className="input input-bordered flex items-center gap-2 w-auto"
            >
              Hit Die
              <input
                type="text"
                name="hitDie"
                id="hitDie"
                className="grow text-right"
                placeholder="d10"
                value={form.hitDie}
                onChange={(e) => updateForm({ hitDie: e.target.value })}
              />
            </label>
          </div>
        </div>

        <br />

        {/* Save Proficiencies */}
        <div className="card card-bordered bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Saving Throw Proficiencies</h2>
            {SAVE_ABILITIES.map(({ key, label }) => (
              <label
                key={key}
                className="label cursor-pointer justify-start gap-4"
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={form.saveProficiencies?.[key] || false}
                  onChange={(e) => updateSaveProf(key, e.target.checked)}
                />
                <span className="label-text">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <br />

        {/* Skills */}
        <div className="card card-bordered bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Skills</h2>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Ability</th>
                  <th>Prof</th>
                  <th>Expertise</th>
                </tr>
              </thead>
              <tbody>
                {SKILL_LIST.map(({ key, label, ability }) => (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>{ability}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={form.skills?.[key]?.proficient || false}
                        onChange={(e) =>
                          updateSkill(key, "proficient", e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={form.skills?.[key]?.expertise || false}
                        onChange={(e) =>
                          updateSkill(key, "expertise", e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <br />

        {/* Resources */}
        <div className="card card-bordered bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Character Resources</h2>
            {form.resources.map((resource, index) => (
              <div key={index}>
                <div className="flex items-center gap-2">
                  <div className="join grow">
                    <label className="input input-bordered flex items-center gap-2 grow">
                      Resource name
                      <input
                        type="text"
                        className="grow"
                        name="title"
                        value={resource.title}
                        onChange={(event) => handleResChange(event, index)}
                      />
                      <div className="divider divider-horizontal"></div>
                      <input
                        type="number"
                        name="maxValue"
                        value={resource.maxValue}
                        placeholder="Maximum Value"
                        onChange={(event) => handleResChange(event, index)}
                      />
                    </label>
                  </div>
                  <div className="join">
                    <input
                      className="join-item btn"
                      type="radio"
                      name={"options-" + index}
                      id="number"
                      aria-label="Number"
                      checked={resource.number}
                      onChange={(event) => handleRadio(event, index)}
                    />
                    <input
                      className="join-item btn"
                      type="radio"
                      name={"options-" + index}
                      id="icon"
                      aria-label="Icon"
                      checked={!!resource.shape}
                      onChange={(event) => handleRadio(event, index)}
                    />
                    <select
                      className="join-item btn select-bordered"
                      name="shape"
                      value={resource.shape}
                      disabled={resource.number}
                      onChange={(event) => handleResChange(event, index)}
                    >
                      <option value="none"></option>
                      <option value="mask-squircle">Squircle</option>
                      <option value="mask-heart">Heart</option>
                      <option value="mask-hexagon">Hexagon</option>
                      <option value="mask-hexagon-2">Hexagon 2</option>
                      <option value="mask-decagon">Decagon</option>
                      <option value="mask-pentagon">Pentagon</option>
                      <option value="mask-diamond">Diamond</option>
                      <option value="mask-square">Square</option>
                      <option value="mask-circle">Circle</option>
                      <option value="mask-star">Star</option>
                      <option value="mask-star-2">Star 2</option>
                      <option value="mask-triangle">Triangle</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-circle btn-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      rmvResource(index);
                    }}
                  >
                    X
                  </button>
                </div>
                <div>Preview:</div>
                <div>{renderResource(index)}</div>
              </div>
            ))}
            <div className="label">
              <span className="label-text-alt">
                <button className="btn btn-xs" onClick={addResource}>
                  Add Resource
                </button>
              </span>
            </div>
          </div>
        </div>

        <br />

        <input
          type="submit"
          value="Save Character"
          className="btn btn-primary"
        />
      </form>
    </>
  );
}
