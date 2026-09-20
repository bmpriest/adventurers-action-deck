import { useState } from "react";
import Buttons from "./Buttons";
import Card from "./Card";

function formatBonus(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export default function Hand({
  character,
  updateChar,
  activeDeck,
  updateDeck,
  economy,
  setEconomy,
}) {
  function removeCard(index) {
    const data = [...activeDeck];
    data.splice(index, 1);
    updateDeck(data, true);
  }

  function actionIcon(type) {
    switch (type) {
      case "std":
        return <div className="bg-info w-8 mask mask-circle"></div>;
      case "bonus":
        return <div className="bg-success w-8 mask mask-triangle-2"></div>;
      case "react":
        return <div className="bg-warning w-8 mask mask-star-2"></div>;
      case "free":
      case "multi":
        return <div className="bg-base-content w-8 mask mask-circle"></div>;
    }
  }

  function cardToHit(attr, isProficient) {
    const abilityBonus = character[`${attr}Bonus`] ?? 0;
    const prof = isProficient ? (character.proficiencyBonus ?? 0) : 0;
    const total = abilityBonus + prof;
    return (
      <div className="flex flex-row justify-between">
        <div>To hit:</div>
        <div>
          {formatBonus(total)} ({attr})
        </div>
      </div>
    );
  }

  function cardDamage(dmgs) {
    return dmgs.map((dmg, i) => {
      if (i === 0) {
        return (
          <div key={i} className="flex flex-row justify-between">
            <div>Damage:</div>
            <div>
              {dmg.diceNum}d{dmg.diceType} + {dmg.bonus} {dmg.damageType}
            </div>
          </div>
        );
      }
      return (
        <div key={i} className="flex justify-end">
          {dmg.diceNum}d{dmg.diceType} + {dmg.bonus} {dmg.damageType}
        </div>
      );
    });
  }

  function cardRes(ress) {
    try {
      return ress.map((res, i) => {
        if (i === 0) {
          return (
            <div key={i} className="flex flex-row justify-between">
              <div>Resource:</div>
              <div>
                {res.title} {res.bonus ? "+" : "-"} {res.value}
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="flex justify-end">
            {res.title} {res.bonus ? "+" : "-"} {res.value}
          </div>
        );
      });
    } catch {
      return null;
    }
  }

  function editCard(index) {
    const cardId = "modal_card_" + index;
    document.getElementById(cardId).showModal();
  }

  if (!activeDeck || activeDeck.length === 0) return null;

  const actionCards = activeDeck.map((card) => (
    <div
      key={card.id}
      className={card.id + " card bg-neutral w-80 shadow-xl flex flex-column"}
    >
      <div className="card-body justify-between pb-6">
        <div className="flex gap-2 pb-4">
          {actionIcon(card.type)}
          <h2 className="text-center grow card-title">{card.title}</h2>
          <div name="hidey" className="join hidden">
            <button
              className="join-item btn btn-square"
              onClick={() => editCard(card.id)}
            >
              <span className="material-icons">edit_square</span>
            </button>
            <button
              className="join-item btn btn-square"
              onClick={() => removeCard(card.id)}
            >
              <span className="material-icons">delete</span>
            </button>
          </div>
        </div>
        <div className="grow">
          <div className="rounded bg-base-100 min-h-16 p-2">
            {card.description}
          </div>
          <br />
          <div>{cardToHit(card.attr, card.isProficient)}</div>
          <div>{cardDamage(card.damage)}</div>
          <div>{cardRes(card.resource)}</div>
        </div>
        <div>
          <div className="divider"></div>
          <Buttons
            action={card}
            character={character}
            updateChar={updateChar}
            economy={economy}
            setEconomy={setEconomy}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="pl-4 pb-4">{card.id}</div>
        <div className="pr-4 pb-2" hidden={!card.isAttack}>
          <span className="material-symbols-outlined">swords</span>
        </div>
      </div>

      <Card
        id={card.id}
        deck={activeDeck}
        setter={updateDeck}
        resources={character.resources}
        blank={false}
      />
    </div>
  ));

  return <>{actionCards}</>;
}
