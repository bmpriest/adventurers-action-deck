import { useState, useEffect } from "react";

export default function Card({ id, setId, deck, setter, resources, blank = true }) {
  const [card, setCard] = useState(createInitialCard)
  const [res, setRes] = useState(createInitialRes);
  const [damages, setDamages] = useState(createInitialDamages);

  let len = 0;
  if (resources !== undefined) { len = resources.length }

  let modalId
  if (blank) {
    modalId = "new_modal_card"
  } else {
    modalId = "modal_card_" + card.id;
  }

  function createInitialCard() {
    if (blank) {
      return {
        id: id,
        title: "",
        type: "",
        description: "",
        attr: "",
        useResource: "",
        resource: [],
        isAttack: "",
        damage: [],
        isProficient: ""
      }
    } else {
      return {
        id: deck[id].id,
        title: deck[id].title,
        type: deck[id].type,
        description: deck[id].description,
        attr: deck[id].attr,
        useResource: deck[id].useResource,
        resource: deck[id].resource,
        isAttack: deck[id].isAttack,
        damage: deck[id].damage,
        isProficient: deck[id].isProficient
      }
    }
  }

  function createInitialDamages() {
    if (blank) {
      return [{diceNum: "", diceType: "", bonus: "", damageType: ""}];
    } else {
      return deck[id].damage;
    }
  }

  function createInitialRes() {
    if (blank) {
      return [{title: "", bonus: "", value: ""}];
    } else {
      return deck[id].resource
    }
  }

  function updateCard(value) {
    return setCard((prev) => {
      return { ...prev, ...value };
    });
  }

  function handleDmgChange(event, index) {
    let data = [...damages];
    data[index][event.target.name] = event.target.value;
    setDamages(data);
    updateCard({ damage: damages })
  }

  function addDamage(e) {
    e.preventDefault();
    let dmg = {diceNum: "", diceType: "", bonus: "", damageType: ""}
    setDamages([...damages, dmg])
  }

  function rmvDamge(index) {
    let data = [...damages];
    data.splice(index, 1);
    setDamages(data);
  }

  function handleResChange(event, index) {
    let data = [...res];
    data[index][event.target.name] = event.target.value;
    setRes(data);
    updateCard({ resource: res })
  }

  function addRes(e) {
    e.preventDefault();
    let newRes = {title: "", bonus: "", value: ""}
    setRes([...res, newRes])
  }

  function rmvRes(index) {
    let data = [...res];
    data.splice(index, 1);
    setRes(data);
  }

  function handleRadio(event, index) {
    let data = [...res];
    switch(event.target.id) {
      case 'bonus':
        data[index].bonus = true;
        break
      case 'malus':
        data[index].bonus = false;
        break
    }
    setRes(data);
  }

  function printDeck(e) {
    e.preventDefault();
    console.log(deck)
    console.log(card)
  }

  function onSubmit(e) {
    e.preventDefault();
    if (blank) {
      setId(id + 1)
      setter({...card, id: id})
    } else {
      let data = [...deck]
      data.splice(card.id, 1, card);
      setter(data, true)
    }
    resetModal();
  }

  function removeCard(index) {
    let data = [...activeDeck];
    data.splice(index, 1);
    updateDeck(data, true);
  }

  function resetModal() {
    if (blank) {
      document.getElementById(modalId).close()
      setCard({     
        id: "",
        title: "",
        type: "",
        description: "",
        attr: "",
        useResource: "",
        resource: [],
        isAttack: "",
        damage: [],
        isProficient: ""
      })
      setDamages([{diceNum: "", diceType: "", bonus: "", damageType: ""}])
      setRes([{title: "", bonus: "", value: ""}])
    } else {
      document.getElementById(modalId).close()
    }
  }




  return (
    <>
      <dialog key={card.id} id={modalId} className={"modal " + card.id}>
          <div className="modal-box">
            <form>
              <div className="grid grid-cols-2 grid-flow-dense gap-4 form-control">
                <div className="col-span-2 order-first flex justify-between">
                
                </div>

                <label className="col-span-2 input input-bordered flex items-center gap-2">
                  Title
                  <input 
                    type="text" 
                    className="grow" 
                    placeholder="Melee attack"

                    value={card.title}
                    onChange={(e) => updateCard({ title: e.target.value })}
                    />
                </label>

                <textarea 
                  className="col-span-1 textarea textarea-bordered" 
                  placeholder="Description"
                  value={card.description}
                  onChange={(e) => updateCard({ description: e.target.value })}
                  ></textarea>

                {/* Damage block */}
                <div className="col-span-2">
                <div className="label">
                  <span className="label-text">Damage</span>
                </div>

                {damages.map((damage, index) => {
                  return (

                    <div key={index}>
                      <div className="join flex items-center">
                        <input 
                          type="number" 
                          className="join-item input input-bordered w-14 shrink" 
                          name="diceNum"
                          value={damage.diceNum}
                          onChange={event => handleDmgChange(event, index)}
                          />
                        <select 
                          className="join-item select select-bordered shrink"
                          name="diceType"
                          value={damage.diceType}
                          onChange={event => handleDmgChange(event, index)}
                          >
                          <option value="">d_</option>
                          <option value="4">d4</option>
                          <option value="6">d6</option>
                          <option value="8">d8</option>
                          <option value="10">d10</option>
                          <option value="12">d12</option>
                          <option value="20">d20</option>
                        </select>
                        <label className="join-item input input-bordered flex items-center gap-2">
                          +
                          <input 
                            type="number" 
                            className="join-item w-14 shrink" 
                            name="bonus"
                            value={damage.bonus}
                            onChange={event => handleDmgChange(event, index)}
                            />
                        </label>
                        <label className="join-item input input-bordered flex items-center">
                          <input 
                            type="text" 
                            placeholder="damage type" 
                            className="grow" 
                            name="damageType"
                            value={damage.damageType}
                            onChange={event => handleDmgChange(event, index)}
                            />
                          <button className="btn btn-circle btn-xs" onClick={() => rmvDamge(index)}>X</button>
                        </label>
                     </div>
                    </div>                      
                  )
                  })}
                     <div className="label">
                        <span className="label-text-alt"></span>
                        <span className="label-text-alt"><button className="btn btn-xs" onClick={addDamage}>Add Damage</button></span>
                      </div>
                  </div>

                <label className="col-span-1 label cursor-pointer">
                  <span className="label-text">Attack?</span>
                  <input 
                    type="checkbox" 
                    className="toggle"
                    name="isAttack"
                    id="isAttack"
                    value={card.isAttack}
                    onChange={(e) => updateCard({ isAttack: e.target.checked })}
                    />
                </label>

                <label className="col-span-1 label cursor-pointer">
                  <span className="label-text">Proficient?</span>
                  <input 
                    type="checkbox" 
                    className="toggle"
                    name="isProficient"
                    id="isProficient"
                    value={card.isProficient}
                    onChange={(e) => updateCard({ isProficient: e.target.checked })}
                    />
                </label>

                <select 
                  className="col-span-1 select select-bordered w-full max-w-xs"
                  value={card.type}
                  onChange={(e) => updateCard({ type: e.target.value })}
                  >
                  <option value="">Action Type</option>
                  <option value="std">Standard Action</option>
                  <option value="bonus">Bonus Action</option>
                  <option value="react">Reaction</option>
                  <option value="free">Free Action</option>
                  <option value="multi">Multiattack</option>
                </select>

                <select 
                  className="col-span-1 select select-bordered w-full max-w-xs"
                  value={card.attr}
                  onChange={(e) => updateCard({ attr: e.target.value })}
                  >
                  <option value="">Related Stat</option>
                  <option value="str">Strength</option>
                  <option value="dex">Dexterity</option>
                  <option value="con">Constitution</option>
                  <option value="inte">Intelligence</option>
                  <option value="wis">Wisdom</option>
                  <option value="cha">Charisma</option>
                </select>

                {/* Resource block */}
                <div className="col-span-2">
                  <label className="label cursor-pointer">
                    <span className="label-text">Uses a resource?</span>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      name="useResource"
                      id="useResource"
                      value={card.useResource}
                      checked={card.useResource}                      
                      onChange={(e) => updateCard({ useResource: e.target.checked })}/>
                  </label>
                  {res.map((rs, index) => {
                    return (
                    <div key={index} className="join flex flex-row justify-between items-center">
                      <select className="join-item select select-bordered" name="title" value={rs.title} disabled={!card.useResource} onChange={event => handleResChange(event, index)}>
                        <option value=""></option>
                          {Array.from(Array(Number(len)), (e, i) => {
                            return <option key={i} value={resources[i].title}>{resources[i].title}</option>
                            })}                   
                      </select>
                      <label className="join-item input input-bordered grow flex items-center" >
                        <div className="join">
                          <input className="join-item btn btn-sm" 
                            type="radio" 
                            name={"res-" + index} 
                            id="bonus" 
                            aria-label="+" 
                            disabled={!card.useResource}
                            checked={rs.bonus} 
                            onChange={event => handleRadio(event, index)}
                          />
                          <input 
                            className="join-item btn btn-sm" 
                            type="radio" 
                            name={"res-"+ index} 
                            id="malus" 
                            aria-label="-" 
                            disabled={!card.useResource}
                            checked={!rs.bonus}
                            onChange={event => handleRadio(event, index)}
                          />
                        </div>
                        <input 
                          className="grow text-right"
                          name="value" 
                          type="number" 
                          value={rs.value}
                          disabled={!card.useResource} 
                          onChange={event => handleResChange(event, index)}/>
                        <button className="btn btn-circle btn-xs" onClick={() => rmvRes(index)}>X</button>
                      </label>
                    </div>

                    )
                  })}
                  <div className="label">
                    <span className="label-text-alt"></span>
                    <span className="label-text-alt"><button className="btn btn-xs" onClick={addRes} disabled={!card.useResource} >Add Resource</button></span>
                  </div>

                </div>

              </div>



              <div className="flex items-center">
                <div class="justify-self-start self-end">
                {id}
                </div>
                <div class="grow"></div>
                <div className="modal-action gap-2">
                  <input type="submit" className="btn btn-primary" value="Save Card" onClick={onSubmit}/>
                  {/* <button className="btn btn-secondary" onClick={printDeck}>Print</button> */}
                  <button className="btn" formMethod="dialog" onClick={resetModal}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </dialog>

    </>
  )
}