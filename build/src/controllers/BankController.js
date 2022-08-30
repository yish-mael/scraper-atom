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
const FormatterService_1 = __importDefault(require("../services/FormatterService"));
const OkraScraperService_1 = __importDefault(require("../services/OkraScraperService"));
class BankController {
    _constructor() { }
    static runScraper(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scrapedData = yield (0, OkraScraperService_1.default)();
                return res.status(200).json(scrapedData);
            }
            catch (err) {
                return res.status(500).json({ error: err });
            }
        });
    }
    static runFormatter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedData = yield (0, FormatterService_1.default)(req.body);
                return res.status(200).json(formattedData);
            }
            catch (err) {
                return res.status(500).json({ error: err });
            }
        });
    }
}
exports.default = BankController;
