/* eslint-disable no-console */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
// const routes = require('./routes');
const books = require('./api/books');
const BooksService = require('./services/postgres/BooksService');
const BookValidator = require('./validator/books');
// const bookPlugin = require('./bookPlugin'); //simple plugin example

const init = async () => {
  const booksService = new BooksService();

  const server = Hapi.server({
    // host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.route(routes);

  await server.register({
    plugin: books,
    options: {
      service: booksService,
      validator: BookValidator,
    },
  });

  // eslint-disable-next-line function-paren-newline
  await server.start(
    // simple plugin example
    // {
    // plugin: bookPlugin,
    // options: { books: [] },
    // }
  // eslint-disable-next-line function-paren-newline
  );
  console.log(`Server running in ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
