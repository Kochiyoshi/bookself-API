const {
  ValidationError,
  validationInput,
  validationReadPage,
} = require('./error-handling');

class BookHandler {
  constructor(service) {
    this.service = service;

    this.postBookHandler = this.postBookHandler.bind(this);
    this.getAllBooksHandler = this.getAllBooksHandler.bind(this);
    this.getBookByIdHandler = this.getBookByIdHandler.bind(this);
    this.putBookByIdHandler = this.putBookByIdHandler.bind(this);
    this.deleteBookByIdHandler = this.deleteBookByIdHandler.bind(this);
  }

  postBookHandler(request, h) {
    try {
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

      const book = this.service.addBook({
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      });

      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: book,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ValidationError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  getAllBooksHandler(request, h) {
    try {
      const { name } = request.query;
      const { reading } = request.query;
      const { finished } = request.query;

      let message = '';
      let status = '';
      let books = null;

      if (name !== undefined) {
        books = this.service.getBooks(name, 1);
        message = `Berhasil menampilkan buku ${name}`;
      } else if (reading !== undefined) {
        if (reading) {
          status = 'Reading';
        } else {
          status = 'Not Reading';
        }

        books = this.service.getBooks(reading, 2);
        message = `Berhasil menampilkan buku ${status}`;
      } else if (finished !== undefined) {
        if (finished) {
          status = 'finished';
        } else {
          status = 'Not finished';
        }

        books = this.service.getBooks(finished, 3);
        message = `Berhasil menampilkan buku ${status}`;
      } else {
        books = this.service.getBooks();
        message = 'Berhasil menampilkan semua buku';
      }

      return {
        status: 'success',
        message,
        data: books,
      };
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  getBookByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const book = this.service.getBookById(id);
      return {
        status: 'success',
        message: 'Buku ditemukan',
        data: {
          ...book,
        },
      };
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }

  putBookByIdHandler(request, h) {
    try {
      const { id } = request.params;
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

      const book = this.service.editBookById(id, {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      });

      return {
        status: 'success',
        message: 'Buku berhasil diperbarui',
        data: {
          book,
        },
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }
      if (error instanceof SyntaxError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(500);
      }
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }

  deleteBookByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this.service.deleteBookById(id);

      return {
        status: 'success',
        message: 'Buku berhasil dihapus',
      };
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }
}

module.exports = BookHandler;
