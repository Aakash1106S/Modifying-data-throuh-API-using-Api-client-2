const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MenuItem = require("./schema");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Menu API!");
});

// POST /menu - Add a new menu item
app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: "Menu item added", menuItem: newItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to add menu item", error });
  }
});

// GET /menu - Fetch all menu items
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error });
  }
});

// PUT /menu/:id - Update an existing menu item
app.put("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item updated", menuItem: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update menu item", error });
  }
});

// DELETE /menu/:id - Delete a menu item
app.delete("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted", menuItem: deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu item", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
