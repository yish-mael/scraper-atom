"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./db/connection"));
const BankController_1 = __importDefault(require("./controllers/BankController"));
require("dotenv/config");
const router = express_1.default.Router();
(0, connection_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use(express_1.default.json());
router.get("/scrape", BankController_1.default.runScraper);
router.post("/formatter", BankController_1.default.runFormatter);
app.use("/api", router);
// Error Handling
app.use((req, res) => {
    res.status(404).json({
        message: "Not found"
    });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
