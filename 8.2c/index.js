import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bookData from './bookData.json' with { type: 'json' };

const app = express();
const port = process.env.PORT ?? 3000;

app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('common'));

// helper function to parse numeric input from URL parameters
const parseInputFromParams = (req) => {
  const { num1 = '0', num2 = '0' } = req.params, n1 = Number(num1), n2 = Number(num2);
  return { num1: n1, num2: n2 };
}

// helper function to generate error information
const error = (message = '400: Bad Request', statusCode = 400) => {
  const title = 'Error';
  // iif switch to determine heading based on status code
  const heading = (() => {
    switch (statusCode) {
      case 400:
        return '400: Bad Request';
      case 404:
        return '404: Not Found';
      default:
        return '500: Internal Server Error';
    }
  })();
  const backMessage = 'Back to '

  return { title, heading, message, backMessage };
}

app.get('/add/:num1/:num2', (req, res) => {
  // parse input
  const { num1, num2} = parseInputFromParams(req);

  // invalid input guard clause
  if (!num1 || !num2) {
    const statusCode = 400;
    const message = 'Please provide both num1 and num2 as numeric URL parameters.';

    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // valid input response
  res.status(200).json({ num1, num2, result: num1 + num2 });
})

app.get('/dif/:num1/:num2', (req, res) => {
  // parse input
  const { num1, num2} = parseInputFromParams(req);

  // invalid input guard clause
  if (!num1 || !num2) {
    const statusCode = 400;
    const message = 'Please provide both num1 and num2 as numeric URL parameters.';

    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // valid input response
  res.status(200).json({ num1, num2, result: num1 - num2 });
})

app.get('/mul/:num1/:num2', (req, res) => {
  // parse input
  const { num1, num2} = parseInputFromParams(req);

  // invalid input guard clause
  if (!num1 || !num2) {
    const statusCode = 400;
    const message = 'Please provide both num1 and num2 as numeric URL parameters.';

    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // valid input response
  res.status(200).json({ num1, num2, result: num1 * num2 });
})

app.get('/div/:num1/:num2', (req, res) => {
  // parse input
  const { num1, num2} = parseInputFromParams(req);

  // invalid input guard clause
  if (!num1 || !num2) {
    const statusCode = 400;
    const message = 'Please provide both num1 and num2 as numeric URL parameters.';

    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // division by zero guard clause
  if (num2 === 0) {
    const statusCode = 400;
    const message = 'Division by zero is not allowed. Please provide a non-zero value for num2.';

    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // valid input response
  res.status(200).json({ num1, num2, result: num1 / num2 });
})

// endpoint to get all books
app.get('/books', (req, res) => {
  res.status(200).json(bookData);
});

// endpoint to get a book by id
app.get('/books/:bookId', (req, res) => {
  // parse bookId from URL parameter
  const { bookId } = req.params;
  // convert bookId to an integer
  const id = parseInt(bookId, 10);

  // parse error guard clause
  if (isNaN(id)) {
    const statusCode = 400;
    const message = 'Please provide a valid numeric bookId as a URL parameter.';

    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // find the book with the given id
  const target = bookData.find(book => book.id === id);

  // book not found guard clause
  if (!target) {
    const statusCode = 404;
    const message = `Book with id: ${id} not found.`;
    return res.status(statusCode).render('error', error(message, statusCode));
  }

  // valid book response
  return res.status(200).json(target);
});

// serve static files from public_html directory
app.use(express.static('public_html'));

// 404 middleware
app.use((_req, res) => {
  res.status(statusCode).render('error', error(message, statusCode));
})

// global error handler middleware
app.use((err, _req, res, _next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).render('error', error(message, statusCode));
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
