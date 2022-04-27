class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// name,
// year,
// author,
// summary,
// publisher,
// pageCount,
// readPage,
// reading

const validationInput = (errorMsg, ...args) => {
  for (let i = 0; i < args.length; i++) {
    const currentArg = () => {
      if (i === 0) {
        return 'nama';
      }
      if (i === 1) {
        return 'tahun';
      }
      if (i === 2) {
        return 'author';
      }
      if (i === 3) {
        return 'summary';
      }
      if (i === 4) {
        return 'publisher';
      }
      if (i === 5) {
        return 'total halaman';
      }
      if (i === 6) {
        return 'halaman dibaca';
      }
      if (i === 7) {
        return 'status membaca';
      }
    };
    if (args[i] === undefined) {
      throw new ValidationError(`${errorMsg} ${currentArg(i)} buku`);
    }
  }
};

const validationReadPage = (errorMsg, pageCount, readPage) => {
  if (readPage > pageCount) {
    throw new ValidationError(errorMsg);
  }
};

module.exports = {
  ValidationError,
  validationInput,
  validationReadPage,
};
