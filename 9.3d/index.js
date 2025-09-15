import fs from "fs";
import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

const captchaImages = [
  "226md.png",
  "22d5n.png",
  "23n88.png",
  "244e2.png",
  "245y5.png",
  "33f7m.png",
  "33p4e.png",
  "36w25.png",
  "377xx.png",
  "3xng6.png",
];

const captchaCache = {};

const getCaptchaCodeFromFilename = (filename) => filename.split(".")[0]?.trim();

let randomCaptchaIndex = -1;

const rng = (max) => {
  let roll = Math.floor(Math.random() * max);

  // ensure new index is different from last one
  while (roll === randomCaptchaIndex) {
    roll = Math.floor(Math.random() * max);
  }

  return roll;
};

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
app.get("/{:reqId}", (req, res) => {
  if (!req.params.reqId) {
    req.params.reqId = crypto.randomUUID();
  }

  res.render("feedback", {
    title: "Customer Feedback",
    items: itemList,
    payload: parseFeedbackPayload(),
    validationErrors: [],
    companyName: "dKin Resalers",
    address: "123 Market Lane, Brisbane, QLD 4000",
    reqId: req.params.reqId,
    isSubmitDisabled: true,
  });
});

// Serve captcha image
app.get('/captcha/{:reqId}', (req, res) => {
  const reqCaptcha = captchaCache[req.params.reqId];

  if (reqCaptcha == null || !reqCaptcha.hasValidated) {
    const randomIndex = rng(captchaImages.length);
    const captchaImage = captchaImages[randomIndex];
    captchaCache[req.params.reqId] = {
      code: getCaptchaCodeFromFilename(captchaImage),
      hasValidated: false,
    };
    const streamRead = fs.createReadStream(`views/captcha/${captchaImage}`);

    return streamRead.pipe(res);
  }

  const streamRead = fs.createReadStream(`views/captcha/${reqCaptcha.code}.png`);

  return streamRead.pipe(res);
})

// Form submission handler
app.post("/submit-feedback/{:reqId}", (req, res) => {
  const payload = parseFeedbackPayload(req.body);
  const { captcha = '' } = req.query;
  const reqCaptcha = captchaCache[req.params.reqId];
  const isCaptchaValid = reqCaptcha?.code === captcha;

  if ((reqCaptcha == null || !isCaptchaValid) && !reqCaptcha?.hasValidated) {
    return res.render("invalid", {
      title: "Invalid Captcha",
      companyName: "dKin Resalers",
      address: "123 Market Lane, Brisbane, QLD 4000",
    });
  }

  if (isCaptchaValid && !reqCaptcha.hasValidated) {
    reqCaptcha.hasValidated = true;

    return res.render("feedback", {
      title: "Customer Feedback",
      items: itemList,
      payload,
      validationErrors: [],
      companyName: "dKin Resalers",
      address: "123 Market Lane, Brisbane, QLD 4000",
      reqId: req.params.reqId,
      isSubmitDisabled: false,
    });
  }

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
      reqId: req.params.reqId,
      isSubmitDisabled: false,
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
