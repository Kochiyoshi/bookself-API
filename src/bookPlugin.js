const bookPlugin = {
  name: 'Delete Book by id',
  version: '1.0.0',

  register: async (server, options) => {
    // contoh, menetapkan routing untuk /notes
    const books = options.notes;
    server.route([
      {
        method: 'GET',
        path: '/books',
        handler: () => books,
      },
    ]);
  },
};

module.exports = { bookPlugin };
