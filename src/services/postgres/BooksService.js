const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class BooksService {
  constructor() {
    this.pool = new Pool();
  }

  //   #checkId() {
  //     const id = nanoid(16);
  //     if ((this.book.findIndex((book) => book.id === id)) !== -1) {
  //       this.#checkId();
  //     }
  //     return id;
  //   }

  async addBook({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);

    const query = {
      text: 'INSERT INTO bookshelf VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 RETURNING id)',
      values: [
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    // only for RETURNING id
    if (!result.rows[0].id) {
      throw new InvariantError('Buku gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getBooks(/* detail, status */) {
    const result = await this.pool.query('SELECT * FROM bookshelf');
    return result.rows.map(mapDBToModel);
  }

  async getBookById(id) {
    const query = {
      text: 'SELECT * FROM bookshelf WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];// use [0] for only 1 object
  }

  async editBookById(
    id,
    {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    },
  ) {
    const updatedAt = new Date().toISOString();
    const finished = (pageCount === readPage);

    const query = {
      text: 'UPDATE bookshelf SET name = $1, year = $2, author = $3, summary = $4, publisher = $5, pageCount = $6, readPage = $7, finished = $8, reading = $9, updatedAt = $10 WHERE id = $11', // add RETURNING id for get only id property
      values: [name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan');
    }

    // return result.rows.map(mapDBToModel)[0];
    return result.rows[0];
  }

  async deleteBookById(id) {
    const query = {
      text: 'DELETE FROM bookshelf WHERE id = $1', // add RETURNING id for get only id property
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Buku gagal dihapus. Id tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }
}

module.exports = BooksService;
