import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

const itemList = ["Headphones", "Keyboard", "Mouse", "Monitor", "Laptop Bag"];
const ratingTracker = itemList.reduce((acc, item) => {
  acc[item] = { count: 0, total: 0 };
  return acc;
}, {});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Homepage with form
app.get("/", (req, res) => {

  res.render("feedback", {
    title: "Customer Feedback",
    items: itemList,
    companyName: "dKin Resalers",
    address: "123 Market Lane, Brisbane, QLD 4000",
  });
});

app.get("/store-feedback", (req, res) => {

  res.render("storeFeedback", {
    title: "Store Feedback",
    items: itemList,
    companyName: "dKin Resalers",
    address: "123 Market Lane, Brisbane, QLD 4000",
  });
});

// Form submission handler
app.post("/submit-feedback", (req, res) => {
  const rating = parseInt(req.body.rating, 10);

  ratingTracker[req.body.item].count += 1;
  ratingTracker[req.body.item].total += rating;

  res.render("storeFeedback", {
    title: "Store Feedback",
    body: req.body,
    items: itemList,
    avgRating: (ratingTracker[req.body.item].total / ratingTracker[req.body.item].count).toFixed(1),
    count: ratingTracker[req.body.item].count,
    companyName: "dKin Resalers",
    address: "123 Market Lane, Brisbane, QLD 4000",
  });
});

async function start() {
  try {
    app.listen(port, () => {
      console.log(`Server running at: http://localhost:${port}`);
      console.log("Press ctrl+c to close");
    });
  } catch (e) {
    console.error(e);
  }
}

await start();
