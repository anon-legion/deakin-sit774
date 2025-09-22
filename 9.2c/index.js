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

const parseFeedbackPayload = (payload = {}) => ({
  name: payload.name ?? "",
  email: payload.email ?? "",
  item: payload.item ?? "",
  date: payload.date ?? "",
  rating: payload.rating ?? "",
  message: payload.message ?? "",
});

// Homepage with form
app.get("/", (req, res) => {
  res.render("feedback", {
    title: "Customer Feedback",
    items: itemList,
    payload: parseFeedbackPayload(),
    validationErrors: [],
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
  const payload = parseFeedbackPayload(req.body);
  const validationErrors = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc.push(key);
      }

      if (
        key === "email" &&
        value &&
        value.split("@")[1]?.toLowerCase() === "deakin.edu.au"
      ) {
        acc.push(key);
      }

      return acc;
    },
    [],
  );

  if (validationErrors.length > 0) {
    return res.render("feedback", {
      title: "Customer Feedback",
      items: itemList,
      payload,
      validationErrors,
      companyName: "dKin Resalers",
      address: "123 Market Lane, Brisbane, QLD 4000",
    });
  }

  const ratingInt = parseInt(payload.rating, 10);

  ratingTracker[req.body.item].count += 1;
  ratingTracker[req.body.item].total += ratingInt;

  res.render("storeFeedback", {
    title: "Store Feedback",
    body: req.body,
    items: itemList,
    ratingInt,
    avgRating: (
      ratingTracker[req.body.item].total / ratingTracker[req.body.item].count
    ).toFixed(1),
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
