const mongoose = require('mongoose');

/**
 * Mongoose-схема сущности «Проект» (вариант 1 — «Портфолио фриланс-разработчика»).
 * Поля по заданию: title (String, required), description (String), imageUrl (String).
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Поле title обязательно'],
      trim: true,
      minlength: [3, 'Название должно содержать не менее 3 символов'],
      maxlength: [100, 'Название должно содержать не более 100 символов'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Описание должно содержать не более 1000 символов'],
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
      match: [/^$|^(https?:\/\/|\/)\S+$/, 'imageUrl должен быть URL (http://, https://) или путём от корня сайта (/...)'],
    },
  },
  {
    timestamps: true, // автоматически добавляет createdAt и updatedAt
    versionKey: false, // убирает служебное поле __v из документов
  },
);

module.exports = mongoose.model('Project', projectSchema);
