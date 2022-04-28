const Joi = require('joi');

const BookPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(50).required()
    .messages({
      'any.required': 'Gagal menambahkan buku. Mohon isi nama buku',
    }),
  year: Joi.number().integer().min(1).max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Gagal menambahkan buku. Mohon isi tahun buku',
    }),
  author: Joi.string().min(1).max(30).required()
    .messages({
      'any.required': 'Gagal menambahkan buku. Mohon isi author buku',
    }),
  summary: Joi.string().min(1).max(50).required()
    .messages({
      'any.required': 'Gagal menambahkan buku. Mohon isi summary buku',
    }),
  publisher: Joi.string().min(1).max(30).required()
    .messages({
      'any.required': 'Gagal menambahkan buku. Mohon isi publisher buku',
    }),
  pageCount: Joi.number().min(1).required().messages({
    'any.required': 'Gagal menambahkan buku. Mohon isi total halaman buku',
  }),
  readPage: Joi.number().min(0).max(Joi.ref('pageCount')).required()
    .messages({
      'number.max': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      'any.required': 'Gagal menambahkan buku. Mohon isi halaman dibaca buku',
    }),
  reading: Joi.boolean().required().messages({
    'any.required': 'Gagal menambahkan buku. Mohon isi status membaca buku',
  }),
});

module.exports = { BookPayloadSchema };
