/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const books = require('./api/books');
const BooksService = require('./services/inMemory/BooksService');
// const bookPlugin = require('./bookPlugin'); //simple plugin example

const init = async () => {
  const booksService = new BooksService();

  const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: 5000,
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
    },
  });

  await server.start(
    // simple plugin example
    // {
    // plugin: bookPlugin,
    // options: { books: [] },
    // }
  );
  console.log(`Server running in ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
