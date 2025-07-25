import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static("public"));

async function start() {
  try {
    app.listen(port, () => {
      console.log(`Web server running at: http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

await start();
