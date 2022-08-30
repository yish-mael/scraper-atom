"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
const fs = __importStar(require("fs"));
function okraScraper() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = {
            email: "iakinnubi@gmail.com",
            password: "secret@123",
            otp: "12345"
        };
        const url = 'https://bankof.okra.ng';
        const browser = yield puppeteer.launch({ headless: false });
        const page = yield browser.newPage();
        yield page.goto(url);
        yield page.evaluate(() => { var _a; return (_a = document.querySelectorAll('a')[1]) === null || _a === void 0 ? void 0 : _a.click(); });
        yield page.type('#email', credentials.email);
        yield page.type('#password', credentials.password);
        page.on('dialog', (dialog) => __awaiter(this, void 0, void 0, function* () { return yield dialog.accept(); }));
        yield page.evaluate(() => { var _a; return (_a = document.querySelector('button')) === null || _a === void 0 ? void 0 : _a.click(); });
        yield page.waitForNavigation();
        yield page.type('#otp', credentials.otp);
        yield page.evaluate(() => { var _a; return (_a = document.querySelector('button')) === null || _a === void 0 ? void 0 : _a.click(); });
        yield page.waitForTimeout(4000);
        const welcomeString = yield page.evaluate(() => document.querySelectorAll('h1')[1].innerText.split(" "));
        const fullName = welcomeString[2] + " " + welcomeString[3].replace("!", "");
        const address = yield page.evaluate(() => document.querySelectorAll('p')[0].innerText.split(":")[1]);
        const bvn = yield page.evaluate(() => document.querySelectorAll('p')[1].innerText.split(" ")[1]);
        const phone = yield page.evaluate(() => document.querySelectorAll('p')[2].innerText.split(" ")[1]);
        const email = yield page.evaluate(() => document.querySelectorAll('p')[3].innerText.split(" ")[1]);
        // create customer object.
        const customer = {
            fullName,
            email,
            phone,
            bvn,
            address
        };
        const savingsBalance = yield page.evaluate(() => document.querySelectorAll('p')[4].innerText);
        const savingsLedgerBalance = yield page.evaluate(() => document.querySelectorAll('p')[5].innerText.split(" (")[0]);
        const marketBalance = yield page.evaluate(() => document.querySelectorAll('p')[6].innerText);
        const marketLedgerBalance = yield page.evaluate(() => document.querySelectorAll('p')[7].innerText.split(" (")[0]);
        // create accounts object. 
        const accounts = {
            savingsAccount: {
                balance: savingsBalance,
                ledgerBalance: savingsLedgerBalance
            },
            moneyMarketAccount: {
                balance: marketBalance,
                ledgerBalance: marketLedgerBalance
            }
        };
        yield page.evaluate(() => { var _a; return (_a = document.querySelectorAll('a')[3]) === null || _a === void 0 ? void 0 : _a.click(); });
        // create transactions object
        let transactions = {};
        function getTransactions(totalSavingsTransactions) {
            return __awaiter(this, void 0, void 0, function* () {
                let totalPages = Math.floor(totalSavingsTransactions / 10);
                const remainder = (totalSavingsTransactions % 10);
                if (remainder > 0)
                    totalPages += 1;
                let perPage = 10;
                let totalSavingsCouter = 0;
                let itemsLeft = 0;
                let dataArray = [];
                yield page.waitForTimeout(4000);
                for (let i = 0; i < totalPages; i++) {
                    for (let x = 0; x < perPage; x++) {
                        const row = yield page.evaluate(() => {
                            var _a;
                            const tableBody = (_a = document.querySelector('tbody')) === null || _a === void 0 ? void 0 : _a.innerText.split(/\s\s+/g);
                            const trs = tableBody === null || tableBody === void 0 ? void 0 : tableBody.map((tr) => {
                                let item = tr.split(/\t+/g);
                                return {
                                    sender: item[5],
                                    beneficiary: item[4],
                                    amount: item[3],
                                    description: item[2],
                                    type: item[0],
                                    dateCleared: item[1]
                                };
                            });
                            return trs;
                        });
                        dataArray.push(row);
                        console.log(row);
                        totalSavingsCouter++;
                    }
                    yield page.evaluate(() => { var _a; return (_a = document.querySelectorAll('button')[1]) === null || _a === void 0 ? void 0 : _a.click(); });
                    yield page.waitForTimeout(2000);
                    itemsLeft = totalSavingsTransactions - totalSavingsCouter;
                    if (itemsLeft < 10) {
                        perPage = itemsLeft;
                    }
                }
            });
        }
        // create savings transactions object.
        yield getTransactions(827);
        let savingsTArray = yield getTransactions(827);
        yield page.goBack();
        yield page.evaluate(() => { var _a; return (_a = document.querySelectorAll('a')[4]) === null || _a === void 0 ? void 0 : _a.click(); });
        // create money market transactions object.
        let moneyMTArray = yield getTransactions(891);
        // set transaction objects.
        transactions.savings = savingsTArray;
        transactions.moneyMarket = moneyMTArray;
        // log the three objects created.
        console.log(accounts, customer, transactions);
        yield page.evaluate(() => { var _a; return (_a = document.querySelectorAll('a')[2]) === null || _a === void 0 ? void 0 : _a.click(); });
        yield page.close();
        yield browser.close();
        let result = {
            accounts,
            customer,
            transactions
        };
        const stream = fs.createWriteStream('/storage/data.json');
        stream.write(JSON.stringify(result));
        stream.end();
        return result;
    });
}
exports.default = okraScraper;
