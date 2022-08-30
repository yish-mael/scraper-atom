import express from "express";

const app = express();
const port = 4000;

app.use(express.json());

// Error Handling
app.use((req, res) => {
    res.status(404).json({
        message: "Not found"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});