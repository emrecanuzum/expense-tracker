import express from "express";
import next from "next";
import mongoose from "mongoose";
import Expense from "./models/Expense"; // Assuming models/Expense.ts is exporting a Mongoose model

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  mongoose
    .connect(process.env.MONGODB_URI || "")
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

  // Express API routes
  server.get("/api/expenses", (req, res) => {
    Expense.find()
      .then((expenses) => res.json(expenses))
      .catch((error) =>
        res.status(500).json({ error: "An error occurred", details: error })
      );
  });

  server.post("/api/expenses", (req, res) => {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({ title, amount, category });

    newExpense
      .save()
      .then((expense) => res.json(expense))
      .catch((error) =>
        res.status(500).json({ error: "An error occurred", details: error })
      );
  });

  server.put("/api/expenses/:id", (req, res) => {
    const { title, amount, category } = req.body;

    Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category },
      { new: true }
    )
      .then((expense) => {
        if (!expense) {
          return res.status(404).json({ error: "Expense not found" });
        }
        res.json(expense);
      })
      .catch((error) =>
        res.status(500).json({ error: "An error occurred", details: error })
      );
  });

  server.delete("/api/expenses/:id", (req, res) => {
    Expense.findOneAndDelete({ _id: req.params.id })
      .then((expense) => {
        if (!expense) {
          return res.status(404).json({ error: "Expense not found" });
        }
        res.json({ message: "Expense deleted successfully" });
      })
      .catch((error) =>
        res.status(500).json({ error: "An error occurred", details: error })
      );
  });

  // Handling everything else with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
