/* eslint-disable camelcase */
// id,
// name,
// year,
// author,
// summary,
// publisher,
// pageCount,
// readPage,
// finished,
// reading,
// insertedAt,
// updatedAt,

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('bookShelfTable', {
    id: {
      type: 'VARCHAR(16)',
      primaryKeys: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'TEXT',
      notNull: true,
    },
    author: {
      type: 'TEXT',
      notNull: true,
    },
    summary: {
      type: 'TEXT',
      notNull: true,
    },
    publisher: {
      type: 'TEXT',
      notNull: true,
    },
    pageCount: {
      type: 'TEXT',
      notNull: true,
    },
    readPage: {
      type: 'TEXT',
      notNull: true,
    },
    finished: { // must be boolean
      type: 'TEXT',
      notNull: true,
    },
    reading: { // must be boolean
      type: 'TEXT',
      notNull: true,
    },
    insertedAt: {
      type: 'TEXT',
      notNull: true,
    },
    updatedAt: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('bookShelfTable');
};
