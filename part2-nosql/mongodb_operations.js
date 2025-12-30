// Operation 1: Load Data
// Import products_catalog.json into 'products' collection

const fs = require("fs");

db = db.getSiblingDB("fleximart_nosql");

const products = JSON.parse(
  fs.readFileSync("products_catalog.json", "utf8")
);

db.products.insertMany(products);




// Operation 3: Review Analysis
// Find products with average rating >= 4.0

db.products.aggregate([
  { $unwind: "$reviews" },
  {
    $group: {
      _id: "$name",
      avg_rating: { $avg: "$reviews.rating" }
    }
  },
  { $match: { avg_rating: { $gte: 4 } } }
]);


// Operation 4: Update Operation
// Add a new review to product ELEC001

db.products.updateOne(
  { product_id: "ELEC001" },
  {
    $push: {
      reviews: {
        user: "U999",
        rating: 4,
        comment: "Good value",
        date: new Date()
      }
    }
  }
);


// Operation 5: Complex Aggregation
// Calculate average price by category
// Return category, avg_price, product_count
// Sort by avg_price descending

db.products.aggregate([
  {
    $group: {
      _id: "$category",
      avg_price: { $avg: "$price" },
      product_count: { $sum: 1 }
    }
  },
  { $sort: { avg_price: -1 } }
]);
