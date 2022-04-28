const mapDBToModel = ({
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
}) => ({
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
  // contohSatu: contoh_satu, //gunakan perintah berikut jika nama properti berbeda
});

module.exports = { mapDBToModel };
