import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";
import { connectDB } from "./db/connection.js";
import characters from "./routes/characters.js";

const app = new Hono();

app.use(trimTrailingSlash());
app.use("*", cors());

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

app.route("/characters", characters);

// Keep the old /record path working so the existing client still works
app.route("/record", characters);

const PORT = process.env.PORT || 5050;

await connectDB();

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});
