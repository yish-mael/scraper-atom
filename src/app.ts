import express from "express";
import db from "./db/connection";
import BankController from "./controllers/BankController";
import "dotenv/config";

const router =  express.Router();

db();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

router.get("/scrape", BankController.runScraper);
router.post("/formatter", BankController.runFormatter);

app.use("/api", router);

// Error Handling
app.use((req, res) => {
    res.status(404).json({
        message: "Not found"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});