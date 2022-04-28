// const {
//   ValidationError,
//   validationInput,
//   validate,
//   validationReadPage,
// } = require('./error-handling');
const ClientError = require('../../exceptions/ClientError');

class BookHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postBookHandler = this.postBookHandler.bind(this);
    this.getAllBooksHandler = this.getAllBooksHandler.bind(this);
    this.getBookByIdHandler = this.getBookByIdHandler.bind(this);
    this.putBookByIdHandler = this.putBookByIdHandler.bind(this);
    this.deleteBookByIdHandler = this.deleteBookByIdHandler.bind(this);
  }

  async postBookHandler(request, h) {
    try {
      this.validator.validateBookPayload(request.payload);
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

      // validationInput(
      //   'Gagal menambahkan buku. Mohon isi',
      //   name,
      //   year,
      //   author,
      //   summary,
      //   publisher,
      //   pageCount,
      //   readPage,
      //   reading,
      // );
      // eslint-disable-next-line max-len
      // validationReadPage('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', pageCount, readPage);
      // const validationResult = validate({
      //   name,
      //   year,
      //   author,
      //   summary,
      //   publisher,
      //   pageCount,
      //   readPage,
      //   reading,
      // });

      // if (validationResult.error) {
      //   throw new Error(`${validationResult.error.message}`);
      // }

      const book = await this.service.addBook({
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
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'fail',
        message: `test${error.message}`,
      }).code(500);
    }
  }

  async getAllBooksHandler(request, h) {
    try {
      // const { name } = request.query;
      // const { reading } = request.query;
      // const { finished } = request.query;

      let message = '';
      // const status = '';
      let books = null;

      // if (name !== undefined) {
      //   books = this.service.getBooks(name, 1);
      //   message = `Berhasil menampilkan buku ${name}`;
      // } else if (reading !== undefined) {
      //   if (reading) {
      //     status = 'Reading';
      //   } else {
      //     status = 'Not Reading';
      //   }

      //   books = this.service.getBooks(reading, 2);
      //   message = `Berhasil menampilkan buku ${status}`;
      // } else if (finished !== undefined) {
      //   if (finished) {
      //     status = 'finished';
      //   } else {
      //     status = 'Not finished';
      //   }

      //   books = this.service.getBooks(finished, 3);
      //   message = `Berhasil menampilkan buku ${status}`;
      // } else {
      books = await this.service.getBooks();
      message = 'Berhasil menampilkan semua buku';
      // }

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

  async getBookByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const book = await this.service.getBookById(id);
      return {
        status: 'success',
        message: 'Buku ditemukan',
        data: {
          ...book,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  async putBookByIdHandler(request, h) {
    try {
      this.validator.validateBookPayload(request.payload);
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

      // validationInput(
      //   'Gagal memperbarui buku. Mohon isi',
      //   name,
      //   year,
      //   author,
      //   summary,
      //   publisher,
      //   pageCount,
      //   readPage,
      //   reading,
      // );
      // eslint-disable-next-line max-len
      // validationReadPage('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', pageCount, readPage);

      const book = await this.service.editBookById(
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
      );

      return {
        status: 'success',
        message: 'Buku berhasil diperbarui',
        data: {
          book,
        },
      };
    } catch (error) {
      // if (error instanceof ValidationError) {
      //   return h.response({
      //     status: 'fail',
      //     message: error.message,
      //   }).code(400);
      // }
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  async deleteBookByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteBookById(id);

      return {
        status: 'success',
        message: 'Buku berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }
}

module.exports = BookHandler;
