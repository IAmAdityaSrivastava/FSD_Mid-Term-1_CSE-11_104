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
app.delete("/api/books/:id", async (req, res) => {
    try {
    const book = await userData.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }if (book.available > 0) { 
      await userData.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Book successfully deleted." });
    }
    return res.status(400).json({ 
      message: `Cannot delete. Available stock (${book.available}) does not meet the requirement.` 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.get("/api/books/search", (req, res) => {
    const tquery = req.query.title;
    if (!titleQuery) {
        return res.status(400).json({ error: "Title parameter is required" });
    }
    const filtered = userData.filter(book => 
        book.title.toLowerCase().includes(titleQuery.toLowerCase())
    );
    res.json(filtered);
});
app.post("/api/books/:id/issue", (req, res) => {
    const id = parseInt(req.params.id);
    const book = userData.find((b) => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    if (book.available <= 0) {
        return res.status(400).json({ error: "Book is not available for issue" });
    }
    book.available -= 1;
    res.json({ message: "Book issued successfully", book });
});
app.post("/api/books/:id/return", (req, res) => {
    const id = parseInt(req.params.id);
    const book = userData.find((b) => b.id === id);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    book.available += 1;
    res.json({ message: "Book returned successfully", book });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});