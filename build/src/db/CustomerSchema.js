"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    bvn: { type: String, required: true },
    bank: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Bank' }]
});
exports.default = (0, mongoose_1.model)('Customer', customerSchema);
