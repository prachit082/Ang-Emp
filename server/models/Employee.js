const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  department: { type: String },
  contact: { type: Number, required: true },
  salary: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);