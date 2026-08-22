const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('./config/database');

const UNIQUE_IMAGE_MAPPING = {
  // Starters
  "Paneer Tikka": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
  "Hara Bhara Kebab": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  "Veg Spring Rolls": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  "Crispy Corn": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80",
  "Chilli Paneer": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80",
  "Chicken Tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80",
  "Chicken 65": "https://images.unsplash.com/photo-1610057099443-fce8c4d1e160?auto=format&fit=crop&w=900&q=80",
  "Tandoori Chicken": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80",
  "Fish Tikka": "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=900&q=80",

  // Main Course Vegetarian
  "Paneer Butter Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
  "Shahi Paneer": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  "Kadai Paneer": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80",
  "Dal Makhani": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80",
  "Dal Tadka": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
  "Mix Veg": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
  "Veg Korma": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
  "Malai Kofta": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=900&q=80",
  "Chana Masala": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80",
  "Masala Dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",

  // Main Course Non-Vegetarian
  "Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  "Chicken Curry": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=900&q=80",
  "Kadai Chicken": "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=900&q=80",
  "Chicken Handi": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "Mutton Curry": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80",
  "Mutton Rogan Josh": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80",
  "Fish Curry": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",

  // Biryani & Rice
  "Veg Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80",
  "Chicken Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80",
  "Mutton Biryani": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=900&q=80",
  "Egg Biryani": "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=900&q=80",
  "Jeera Rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=80",
  "Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",

  // Breads
  "Butter Naan": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80",
  "Garlic Naan": "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=900&q=80",
  "Plain Naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  "Tandoori Roti": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80",
  "Butter Roti": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
  "Laccha Paratha": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80",
  "Stuffed Paratha": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80",

  // Chinese
  "Veg Manchurian": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80",
  "Veg Hakka Noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80",
  "Chicken Hakka Noodles": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=900&q=80",
  "Veg Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
  "Chicken Fried Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "Chilli Chicken": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80",

  // Desserts
  "Gulab Jamun": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=80",
  "Rasmalai": "https://images.unsplash.com/photo-1571006682858-a45752990da5?auto=format&fit=crop&w=900&q=80",
  "Gajar Ka Halwa": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80",
  "Brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  "Ice Cream": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80",

  // Beverages
  "Fresh Lime Soda": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
  "Mango Lassi": "https://images.unsplash.com/photo-1571006682858-a45752990da5?auto=format&fit=crop&w=900&q=80",
  "Sweet Lassi": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  "Masala Chai": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80",
  "Cold Coffee": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
  "Soft Drink": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80"
};

async function updateImages() {
  console.log('=== UPDATING UNIQUE FOOD IMAGES IN MYSQL DATABASE ===\n');
  try {
    let updatedCount = 0;
    for (const [dishName, imageUrl] of Object.entries(UNIQUE_IMAGE_MAPPING)) {
      const [res] = await pool.query(
        'UPDATE menu_items SET image = ? WHERE LOWER(name) = LOWER(?)',
        [imageUrl, dishName]
      );
      if (res.affectedRows > 0) {
        updatedCount += res.affectedRows;
      }
    }
    console.log(`🎉 Successfully updated ${updatedCount} menu item images in database.`);
  } catch (err) {
    console.error('Update error:', err.message);
  } finally {
    process.exit(0);
  }
}

updateImages();
