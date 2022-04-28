/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class BooksService {
  constructor() {
    this.book = [];
  }

  #checkId() {
    const id = nanoid(16);
    if ((this.book.findIndex((book) => book.id === id)) !== -1) {
      this.#checkId();
    }
    return id;
  }

  addBook({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }) {
    const id = this.#checkId();
    const now = new Date().toISOString();
    const finished = (pageCount === readPage);

    this.book.push({
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
      insertedAt: now,
      updatedAt: now,
    });

    if (this.book.findIndex((book) => book.id === id) === -1) {
      // eslint-disable-next-line no-console
      throw new InvariantError('Buku gagal ditambahkan');
    }

    return id;
  }

  getBooks(detail, status) {
    const books = this.book;

    if (status === 1) {
      const bookTemp = books.filter((book) => {
        const result = book.name.toLowerCase().includes(detail.toLowerCase());
        return result;
      });
      return {
        books: bookTemp.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      };
    }

    if (status === 2) {
      const bookTemp = books.filter((book) => book.reading == detail);
      return {
        books: bookTemp.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      };
    }

    if (status === 3) {
      const bookTemp = books.filter((book) => book.finished == detail);
      return {
        books: bookTemp.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      };
    }
    return {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    };
  }

  getBookById(id) {
    const bookTemp = this.book.find((book) => book.id === id);
    if (!bookTemp) {
      throw new NotFoundError('Buku tidak ditemukan');
    }
    return {
      book: bookTemp,
    };
  }

  editBookById(id, {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }) {
    const now = new Date().toISOString();
    const finished = (pageCount === readPage);
    const bookIndex = this.book.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan');
    }

    this.book[bookIndex] = {
      ...this.book[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt: now,
    };

    return this.book[bookIndex];
  }

  deleteBookById(id) {
    const bookIndex = this.book.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundError('Buku gagal dihapus. Id tidak ditemukan');
    }
    this.book.splice(bookIndex, 1);
  }
}

module.exports = BooksService;
