"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    transactionId: { type: String, required: true },
    sender: { type: String, required: true },
    beneficiary: { type: String, required: true },
    amount: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, required: true },
    dateCleared: { type: String, required: true },
    accountType: { type: String, required: true },
    bank: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Bank' }],
    customer: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Customer' }]
});
exports.default = (0, mongoose_1.model)('Transaction', transactionSchema);
