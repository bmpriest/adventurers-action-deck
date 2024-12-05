import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const actions = [
  'First action title',
  'Second action title',
  'Third action title',
  'Fourth action title',
  'Fifth action title',
  'Sixth action title',
  'Seventh action title',
  'Eighth action title',
  'Ninth action title',
  'Tenth action title',
  'Eleventh action title',
  'Twelfth action title',
  'Thirteenth action title'
]

export default function Deck() {
  const actionCards = actions.map(action =>
    <div class="card bg-neutral w-96 shadow-xl">
      <div class="card-body">
      <h2 class="card-title">{action}</h2>
      <p>Here's a second line of text!</p>
      <div class="card-actions justify-end">
      <button class="btn btn-primary">Button</button>
    </div>
  </div>
</div>
  );
  return <>{actionCards}</>;
}