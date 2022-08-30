"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BankSchema_1 = __importDefault(require("../db/BankSchema"));
const CustomerSchema_1 = __importDefault(require("../db/CustomerSchema"));
const TransactionSchema_1 = __importDefault(require("../db/TransactionSchema"));
function formatter(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bank = {
                name: data.bankName,
                details: data.bankDetails,
            };
            const nameCheck = yield BankSchema_1.default.findOne({ name: bank.name });
            let bankId = nameCheck === null || nameCheck === void 0 ? void 0 : nameCheck._id;
            let createBank = {};
            if (nameCheck === null) {
                createBank = yield BankSchema_1.default.create(bank);
                bankId = createBank === null || createBank === void 0 ? void 0 : createBank._id;
            }
            const customer = {
                fullName: data.customer.fullName,
                email: data.customer.email,
                password: data.customer.password,
                address: data.customer.address,
                phone: data.customer.phone,
                bvn: data.customer.bvn,
                bank: bankId
            };
            const emailCheck = yield CustomerSchema_1.default.findOne({ email: customer.email });
            let customerId = emailCheck === null || emailCheck === void 0 ? void 0 : emailCheck._id;
            let createCustomer = {};
            if (emailCheck === null) {
                createCustomer = yield CustomerSchema_1.default.create(customer);
                customerId = createCustomer === null || createCustomer === void 0 ? void 0 : createCustomer._id;
            }
            let transactionsx = [];
            for (let i = 0; i < data.transactions.length; i++) {
                const item = {
                    transactionId: data.transactions[i].transactionId,
                    sender: data.transactions[i].sender,
                    beneficiary: data.transactions[i].beneficiary,
                    amount: data.transactions[i].amount,
                    description: data.transactions[i].description,
                    type: data.transactions[i].type,
                    dateCleared: data.transactions[i].dateCleared,
                    accountType: data.transactions[i].accountType,
                    bank: bankId,
                    customer: customerId
                };
                let transactionCheck = yield TransactionSchema_1.default.findOne({ transactionId: item.transactionId });
                let tId = transactionCheck === null || transactionCheck === void 0 ? void 0 : transactionCheck._id;
                let createTransaction = {};
                if (transactionCheck === null) {
                    createTransaction = yield TransactionSchema_1.default.create(item);
                    transactionsx.push(createTransaction);
                    tId = createCustomer === null || createCustomer === void 0 ? void 0 : createCustomer._id;
                }
                transactionsx.push(transactionCheck);
            }
            return { bank: nameCheck || createBank, customer: emailCheck || createCustomer, transactions: transactionsx };
        }
        catch (e) {
            throw e;
        }
    });
}
exports.default = formatter;
