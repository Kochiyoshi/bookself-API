const BookHandler = require('./handles');
const routes = require('./routes');

module.exports = {
  name: 'book',
  version: '1.0.0',
  register: async (server, { service }) => {
    const bookHandler = new BookHandler(service);
    server.route(routes(bookHandler));
  },
};
