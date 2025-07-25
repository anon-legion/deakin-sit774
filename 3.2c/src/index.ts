import {Hono} from "hono";
import {serveStatic} from "hono/bun";

const app = new Hono();

app.use("/public_html/*", serveStatic({root: "./"}));
app.get("/*", (c) => c.redirect(`/public_html${c.req.path}`));

export default {
  port: 3000,
  fetch: app.fetch,
};
