import path from 'path';
import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT ?? 3000;
const startTime = new Date();

app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('common'));


app.get('/add', (req, res) => {
  const n1 = Number(req.query.num1) || 0;
  const n2 = Number(req.query.num2) || 0;

  if (!n1 || !n2) {
    const statusCode = 404;
    const title = 'Error';
    const heading = 'Missing Inputs, Bad Request';
    const backMessage = 'Return to '

    return res.status(statusCode).render('error', { title, heading, backMessage });
  }

  const title = 'Add';
  const heading = 'Result of Adding Query Parameters';
  const timestamp = new Date().toLocaleString();
  const message = `The sum of ${n1} and ${n2} is ${n1 + n2}.`;
  const backMessage = 'Return to '

  res.render('add', { title, heading, timestamp, message, backMessage });
})

app.get('/uptime', (req, res) => {
  const title = 'Uptime';
  const heading = 'A Dynamically Created Page';
  const currentTime = new Date();
  const uptime = Math.floor((currentTime - startTime) / 1000);
  const backMessage = 'Please visit again soon. Return to '

  res.render('uptime', { title, heading, uptime, backMessage });
})

app.get('/force-error', (req, res) => {
  console.log('Got a request to force an error...')

  let f;
  console.log(`f = ${f.nomethod()}`);
})

app.use(express.static('public_html'));

app.use((_req, res) => {
  const statusCode = 400;
  const title = 'Error';
  const heading = `${statusCode}: File Not Found`;
  const backMessage = 'Return to '
  res.status(statusCode).render('error', { title, heading, backMessage });
})

app.use((err, _req, res, _next) => {
  const statusCode = err.status || 500;
  const title = 'Error';
  const heading = `${statusCode}: Bad Request`;
  const backMessage = 'Return to '
  res.status(statusCode).render('error', { title, heading, backMessage });
});

async function start() {
  try {
    app.listen(port, () => {
      console.log(`Web server running at: http://localhost:${port}`);
      console.log('Type Ctrl+C to shut down the web server');
    });
  } catch (e) {
    console.error(e);
  }
}

await start();
