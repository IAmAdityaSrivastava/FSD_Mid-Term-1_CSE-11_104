import express from "express";
import cors from "cors";

const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const userData=[{
    id: 101, 
    title: "Java Programming", 
    author: "Herbert Schildt", 
    category: "Programming", 
    quantity: 5, 
    available: 5
}];

app.get("/api/books", (req, res) => {
    res.json(userData);
});
app.get("/api/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const book = userData.find((b) => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
});
app.put("/api/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const ind = userData.findIndex((b) => b.id === id);
    if (ind === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    userData[ind] = { ...userData[ind], ...req.body };
    res.json(userData[ind]);
});
