import express from 'express';
import { createDb } from './createDb.js';

const db = await createDb();

const app = express();
const PORT = process.env.PORT ?? '';

if (!PORT) {
  throw new Error('One or more required environment variables are missing.');
}

const itemList = [ 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Laptop Bag' ];

const ratingTracker = itemList.reduce((acc, item) => {
  acc[item] = { count: 0, total: 0 };
  return acc;
}, {});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Homepage with form
app.get('/', (req, res) => {
  res.render('feedback', {
    title: 'Customer Feedback',
    items: itemList,
    companyName: 'dKin Resalers',
    address: '123 Market Lane, Brisbane, QLD 4000',
  });
});

const parsePayloadFromReq = (req) => ({
  name: req?.body?.name?.trim() ?? '',
  email: req?.body?.email?.trim() ?? '',
  item: req?.body?.item?.trim() ?? '',
  date: req?.body?.date ? new Date(req.body.date).toISOString() : new Date().toISOString(),
  rating: parseInt(req?.body?.rating, 10) ?? 0,
  message: req?.body?.message ?? '',
});

// Form submission handler
app.post('/submit-feedback', async (req, res) => {
  const rating = parseInt(req.body.rating, 10);
  const payload = parsePayloadFromReq(req);

  await db.run(
    'insert into Feedback (name, email, item, date, rating, message) values (?, ?, ?, ?, ?, ?)',
    [ payload.name, payload.email, payload.item, payload.date, payload.rating, payload.message ],
  );

  const results = await db.all('select * from Feedback where item = ?', [ payload.item ]);

  const itemFeedback = results.filter((result) => result.item === payload.item);
  console.log(itemFeedback);

  ratingTracker[req.body.item].count += 1;
  ratingTracker[req.body.item].total += rating;

  res.render('storeFeedback', {
    title: 'Store Feedback',
    payload,
    items: itemList,
    avgRating: (
      itemFeedback.map((feedback) => feedback.rating).reduce((acc, rating) => acc + rating) / itemFeedback.length
    ).toFixed(1),
    count: itemFeedback.length,
    feedbacks: results,
    companyName: 'dKin Resalers',
    address: '123 Market Lane, Brisbane, QLD 4000',
  });
});

app.get('/all-feedbacks', async (req, res) => {
  const feedbacks = await db.all('select * from Feedback');

  res.render('allfeedbacks', {
    companyName: 'dKin Resalers',
    feedbacks: feedbacks.sort((a, b) => new Date(a.date) - new Date(b.date)),
    address: '123 Market Lane, Brisbane, QLD 4000',
  });
});


async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}`);
      console.log('Press ctrl+c to close');
    });
  } catch (e) {
    console.error(e);
  }
}

await start();
