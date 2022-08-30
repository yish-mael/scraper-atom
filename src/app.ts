import express from "express";
import db from "./db/connection";
import BankController from "./controllers/BankController";

const router =  express.Router();

db();
const app = express();
const port = 4000;

app.use(express.json());

router.get("/scrape", BankController.runScraper);

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