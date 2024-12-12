import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
        <img rel="icon" type="image/svg+xml" href="/cards.svg" />
        Adventurer's Action Deck
        </NavLink>

        <NavLink className="btn btn-primary" to="/create">
          Create Character
        </NavLink>
      </nav>
    </div>
  );
}