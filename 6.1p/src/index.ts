import {Hono} from "hono";
import {serveStatic} from "hono/bun";

const app = new Hono();

app.use("/public_html/*", serveStatic({root: "./"}));
app.get("/*", (c) => {
  if (!c.req.path.startsWith('/public_html')) {
    return c.redirect(`/public_html${c.req.path}`)
  }

  return c.text("Not found", 404)
});

export default {
  port: 3000,
  fetch: app.fetch,
};
