import { useState } from "react";

export default function Card({ deck, setter, resources }) {
  const [damages, setDamages] = useState([{diceNum: "", diceType: "", bonus: "", damageType: ""}]);
  const [res, setRes] = useState([{title: "", bonus: "", value: ""}]);
  const [card, setCard] = useState({
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



  function onSubmit(e) {
    e.preventDefault();
    setter(card);
    closeModal();
  }

  function closeModal() {
    setCard({     
      title: "",
      type: "",
      description: "",
      attr: "",
      useResource: "",
      resource: [],
      isAttack: "",
      damage: [],
      isProficient: "",
    })
    //document.getElementById('add_card_modal').close()
  }

  let len = 0;
  try { len = resources.length; } catch(err) {console.log('Didn\'t work')}



  return (
    <>
      <button class="btn btn-primary btn-circle btn-lg" onClick={() => document.getElementById('add_card_modal').showModal()}>+</button>
        <dialog id="add_card_modal" className="modal">
          <div className="modal-box">
            <form>
              <div class="grid grid-cols-2 grid-flow-dense gap-4 form-control">
                <h3 className="col-span-2 order-first font-bold text-lg">New Card!</h3>

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
                  class="col-span-1 textarea textarea-bordered" 
                  placeholder="Description"
                  value={card.description}
                  onChange={(e) => updateCard({ description: e.target.value })}
                  ></textarea>

                {/* Damage block */}
                <div class="col-span-2">
                <div class="label">
                  <span class="label-text">Damage</span>
                </div>

                {damages.map((damage, index) => {
                  return (

                    <div key={index}>
                      <div class="join flex items-center">
                        <input 
                          type="number" 
                          class="join-item input input-bordered w-14 shrink" 
                          name="diceNum"
                          
                          onChange={event => handleDmgChange(event, index)}
                          />
                        <select 
                          class="join-item select select-bordered shrink"
                          name="diceType"
                          
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
                        <label class="join-item input input-bordered flex items-center gap-2">
                          +
                          <input 
                            type="number" 
                            class="join-item w-14 shrink" 
                            name="bonus"
                            
                            onChange={event => handleDmgChange(event, index)}
                            />
                        </label>
                        <label class="join-item input input-bordered flex items-center">
                          <input 
                            type="text" 
                            placeholder="damage type" 
                            class="grow" 
                            name="damageType"
                          
                            onChange={event => handleDmgChange(event, index)}
                            />
                          <button class="btn btn-circle btn-xs" onClick={() => rmvDamge(index)}>X</button>
                        </label>
                     </div>
                    </div>                      
                  )
                  })}
                     <div class="label">
                        <span class="label-text-alt"></span>
                        <span class="label-text-alt"><button class="btn btn-xs" onClick={addDamage}>Add Damage</button></span>
                      </div>
                  </div>

                <label class="col-span-1 label cursor-pointer">
                  <span class="label-text">Attack?</span>
                  <input 
                    type="checkbox" 
                    class="toggle"
                    name="isAttack"
                    id="isAttack"
                    
                    onChange={(e) => updateCard({ isAttack: e.target.checked })}
                    />
                </label>

                <label class="col-span-1 label cursor-pointer">
                  <span class="label-text">Proficient?</span>
                  <input 
                    type="checkbox" 
                    class="toggle"
                    name="isProficient"
                    id="isProficient"
                    
                    onChange={(e) => updateCard({ isProficient: e.target.checked })}
                    />
                </label>

                <select 
                  class="col-span-1 select select-bordered w-full max-w-xs"
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
                  class="col-span-1 select select-bordered w-full max-w-xs"
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
                <div class="col-span-2">
                  <label class="label cursor-pointer">
                    <span class="label-text">Uses a resource?</span>
                    <input 
                      type="checkbox" 
                      class="toggle" 
                      name="useResource"
                      id="useResource"
                      checked={card.useResource}                      
                      onChange={(e) => updateCard({ useResource: e.target.checked })}/>
                  </label>
                  {res.map((rs, index) => {
                    return (
                    <div key={index} class="join flex flex-row justify-between items-center">
                      <select class="join-item select select-bordered" name="title" disabled={!card.useResource} onChange={event => handleResChange(event, index)}>
                        <option value=""></option>
                          {Array.from(Array(Number(len)), (e, i) => {
                            return <option key={i} value={resources[i].title}>{resources[i].title}</option>
                            })}                   
                      </select>
                      <label class="join-item input input-bordered grow flex items-center" >
                        <div class="join">
                          <input class="join-item btn btn-sm" 
                            type="radio" 
                            name={"res-" + index} 
                            id="bonus" 
                            aria-label="+" 
                            disabled={!card.useResource}
                            checked={res.bonus} 
                            onClick={event => handleRadio(event, index)}
                          />
                          <input 
                            class="join-item btn btn-sm" 
                            type="radio" 
                            name={"res-"+ index} 
                            id="malus" 
                            aria-label="-" 
                            disabled={!card.useResource}
                            checked={res.bonus}
                            onClick={event => handleRadio(event, index)}
                          />
                        </div>
                        <input 
                          class="grow text-right"
                          name="value" 
                          type="number" 
                          disabled={!card.useResource} 
                          onChange={event => handleResChange(event, index)}/>
                        <button class="btn btn-circle btn-xs" onClick={() => rmvRes(index)}>X</button>
                      </label>
                    </div>

                    )
                  })}
                  <div class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt"><button class="btn btn-xs" onClick={addRes} disabled={!card.useResource} >Add Resource</button></span>
                  </div>

                </div>

              </div>



              <div class="flex items-center">
                <div className="modal-action">
                  <input type="submit" className="btn btn-primary" value="Save Card" onClick={onSubmit}/>
                  <button className="btn" formMethod="dialog" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </dialog>

    </>
  )
}