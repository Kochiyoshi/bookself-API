/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');
const {
  validationInput,
  validationReadPage,
} = require('./error-handling');

const checkId = () => {
  const id = nanoid(16);
  if ((books.findIndex((book) => book.id === id)) !== -1) {
    checkId(books);
  }
  return id;
};

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  try {
    validationInput(
      'Gagal menambahkan buku. Mohon isi',
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    );
    validationReadPage('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', pageCount, readPage);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(400);
  }

  const bookId = checkId();
  const now = new Date().toISOString();
  const finished = (pageCount === readPage);

  books.push({
    bookId,
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

  if (books.findIndex((book) => book.bookId === bookId) !== -1) {
    // eslint-disable-next-line no-console
    console.log(`Add ${bookId} ${name}`);
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name } = request.query;
  const { reading } = request.query;
  const { finished } = request.query;

  if (!books.length) {
    return h.response({
      status: 'success',
      message: 'Balum ada buku yang disimpan',
      data: {
        books,
      },
    }).code(200);
  }

  if (name !== undefined) {
    const book = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    return h.response({
      status: 'success',
      message: `Berhasil menampilkan buku ${name}`,
      data: {
        books: book.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  if (finished !== undefined) {
    const book = books.filter((book) => book.finished == finished);

    let status = '';
    if (reading) {
      status = 'finished';
    }
    status = 'Not finished';

    return h.response({
      status: 'success',
      message: `Berhasil menampilkan buku ${status}`,
      data: {
        books: book.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  if (reading !== undefined) {
    const book = books.filter((book) => book.reading == reading);

    let status = '';
    if (reading) {
      status = 'Reading';
    }
    status = 'Not Reading';

    return h.response({
      status: 'success',
      message: `Berhasil menampilkan buku ${status}`,
      data: {
        books: book.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  return h.response({
    status: 'success',
    message: 'Berhasil menampilkan semua buku',
    data: {
      books: books.map((book) => ({
        id: book.bookId,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((book) => book.bookId === bookId);
  if (book !== undefined) {
    return h.response({
      status: 'success',
      message: 'Buku ditemukan',
      data: {
        book: {
          id: book.bookId,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.insertedAt,
        },
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  try {
    validationInput(
      'Gagal memperbarui buku. Mohon isi',
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    );
    validationReadPage('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', pageCount, readPage);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(400);
  }

  const now = new Date().toISOString();
  const finished = (pageCount === readPage);
  const bookIndex = books.findIndex((book) => book.bookId === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
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

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        book: {
          id: books[bookIndex].bookId,
          name: books[bookIndex].name,
          year: books[bookIndex].year,
          author: books[bookIndex].author,
          summary: books[bookIndex].summary,
          publisher: books[bookIndex].publisher,
          pageCount: books[bookIndex].pageCount,
          readPage: books[bookIndex].readPage,
          finished: books[bookIndex].finished,
          reading: books[bookIndex].reading,
          insertedAt: books[bookIndex].insertedAt,
          updatedAt: books[bookIndex].insertedAt,
        },
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((book) => book.bookId === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
