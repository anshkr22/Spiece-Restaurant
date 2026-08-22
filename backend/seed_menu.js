const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('./config/database');

const CATEGORIES_DATA = [
  { name: 'Starters', description: 'Delicious opening bites, tikka and kebabs to awaken your taste buds' },
  { name: 'Main Course — Vegetarian', description: 'Rich, authentic vegetarian curries and gravies prepared with fresh spices' },
  { name: 'Main Course — Non-Vegetarian', description: 'Succulent chicken, mutton and fish curries cooked to perfection' },
  { name: 'Biryani & Rice', description: 'Fragrant, spice-infused biryanis and fluffy rice specialties' },
  { name: 'Breads', description: 'Freshly baked tandoori naans, rotis and parathas' },
  { name: 'Chinese', description: 'Indo-Chinese sizzlers, noodles, Manchurian and fried rice' },
  { name: 'Desserts', description: 'Traditional Indian sweets and delightful desserts to finish your meal' },
  { name: 'Beverages', description: 'Refreshing lassis, sodas, chai and beverages' }
];

const DISHES_DATA = [
  // --- STARTERS ---
  {
    category: 'Starters',
    name: 'Paneer Tikka',
    description: 'Cubes of fresh cottage cheese marinated in spiced yogurt and grilled in a clay oven',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Starters',
    name: 'Hara Bhara Kebab',
    description: 'Crispy spinach and green pea patties seasoned with aromatic Indian spices',
    price: 169.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Starters',
    name: 'Veg Spring Rolls',
    description: 'Golden crunchy rolls stuffed with shredded vegetables and served with sweet chili sauce',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    rating: 4.5
  },
  {
    category: 'Starters',
    name: 'Crispy Corn',
    description: 'Sweet corn kernels tossed in spicy seasoning and fried till crispy',
    price: 149.00,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Starters',
    name: 'Chilli Paneer',
    description: 'Crispy paneer cubes tossed in garlic chili sauce with onions and bell peppers',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Starters',
    name: 'Chicken Tikka',
    description: 'Tender boneless chicken pieces marinated in tandoori masala and char-grilled',
    price: 249.00,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Starters',
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken tossed with curry leaves, red chilies, and yogurt',
    price: 239.00,
    image: 'https://images.unsplash.com/photo-1610057099443-fce8c4d1e160?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Starters',
    name: 'Tandoori Chicken',
    description: 'Half chicken marinated in rich tandoori spices and roasted to smoky perfection',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Starters',
    name: 'Fish Tikka',
    description: 'Boneless fish fillets marinated in Ajwain herbs and spices, grilled in tandoor',
    price: 289.00,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },

  // --- MAIN COURSE VEGETARIAN ---
  {
    category: 'Main Course — Vegetarian',
    name: 'Paneer Butter Masala',
    description: 'Soft cottage cheese cooked in a rich, creamy, buttery tomato sauce',
    price: 229.00,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Shahi Paneer',
    description: 'Royal Indian curry made with cottage cheese in a luxurious cashew nut gravy',
    price: 239.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Kadai Paneer',
    description: 'Paneer cooked with bell peppers, tomatoes, and freshly ground kadai spices',
    price: 229.00,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Dal Makhani',
    description: 'Whole black lentils simmered overnight with butter, cream, and ground spices',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with ghee, cumin seeds, garlic, and dried red chilies',
    price: 149.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Mix Veg',
    description: 'Assorted seasonal vegetables cooked in a wholesome onion-tomato gravy',
    price: 179.00,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    rating: 4.5
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Veg Korma',
    description: 'Mixed vegetables simmered in a mildly spiced coconut and cashew cream sauce',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Malai Kofta',
    description: 'Melt-in-mouth cottage cheese dumplings cooked in a velvety cream gravy',
    price: 219.00,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Chana Masala',
    description: 'Tender chickpeas simmered in a tangy Punjabi spiced tomato-onion curry',
    price: 169.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Main Course — Vegetarian',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato masala, served with sambar and chutney',
    price: 149.00,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },

  // --- MAIN COURSE NON-VEGETARIAN ---
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Butter Chicken',
    description: 'Tender grilled chicken cooked in a rich, buttery, spiced tomato gravy',
    price: 279.00,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Chicken Curry',
    description: 'Traditional home-style chicken curry cooked with fragrant Indian spices',
    price: 249.00,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Kadai Chicken',
    description: 'Succulent chicken stir-fried with onions, bell peppers, and fresh kadai spices',
    price: 259.00,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Chicken Handi',
    description: 'Slow-cooked chicken in an authentic earthenware pot with thick rich gravy',
    price: 269.00,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Mutton Curry',
    description: 'Slow-cooked tender mutton cooked in a deeply flavorful gravy',
    price: 349.00,
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Mutton Rogan Josh',
    description: 'Kashmiri style mutton curry infused with alkanet root and aromatic spices',
    price: 369.00,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Main Course — Non-Vegetarian',
    name: 'Fish Curry',
    description: 'Fresh fish cooked in a tangy coastal coconut and mustard spice gravy',
    price: 319.00,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },

  // --- BIRYANI & RICE ---
  {
    category: 'Biryani & Rice',
    name: 'Veg Biryani',
    description: 'Aromatic Dum biryani cooked with garden vegetables and saffron Basmati rice',
    price: 219.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Biryani & Rice',
    name: 'Chicken Biryani',
    description: 'Classic Dum Biryani layered with marinated chicken and long-grain rice',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Biryani & Rice',
    name: 'Mutton Biryani',
    description: 'Royal Hyderabad style mutton biryani prepared with aromatic spices and ghee',
    price: 349.00,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Biryani & Rice',
    name: 'Egg Biryani',
    description: 'Flavorful Basmati biryani served with boiled eggs cooked in rich spices',
    price: 239.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Biryani & Rice',
    name: 'Jeera Rice',
    description: 'Fluffy Basmati rice tempered with cumin seeds and pure desi ghee',
    price: 129.00,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Biryani & Rice',
    name: 'Fried Rice',
    description: 'Stir-fried Basmati rice tossed with fresh chopped vegetables and light soy sauce',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },

  // --- BREADS ---
  {
    category: 'Breads',
    name: 'Butter Naan',
    description: 'Soft tandoori leavened flatbread brushed with rich melted butter',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Breads',
    name: 'Garlic Naan',
    description: 'Clay-oven baked naan infused with minced garlic and topped with coriander',
    price: 59.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Breads',
    name: 'Plain Naan',
    description: 'Traditional unleavened flatbread cooked inside a blazing hot tandoor',
    price: 39.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.5
  },
  {
    category: 'Breads',
    name: 'Tandoori Roti',
    description: 'Whole wheat flatbread baked freshly in the tandoor',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Breads',
    name: 'Butter Roti',
    description: 'Crispy whole wheat tandoori roti brushed generously with butter',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Breads',
    name: 'Laccha Paratha',
    description: 'Multi-layered flaky whole wheat paratha baked to golden crispness',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Breads',
    name: 'Stuffed Paratha',
    description: 'Tandoori paratha stuffed with spiced mashed potatoes and herbs',
    price: 69.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },

  // --- CHINESE ---
  {
    category: 'Chinese',
    name: 'Veg Manchurian',
    description: 'Vegetable dumplings tossed in a dark, savory garlic and ginger soy sauce',
    price: 179.00,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Chinese',
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles with crunchy cabbage, capsicum, carrots, and spring onions',
    price: 169.00,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Chinese',
    name: 'Chicken Hakka Noodles',
    description: 'Wok-tossed noodles with shredded chicken and oriental vegetables',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Chinese',
    name: 'Veg Fried Rice',
    description: 'Indo-Chinese style aromatic fried rice with diced garden vegetables',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },
  {
    category: 'Chinese',
    name: 'Chicken Fried Rice',
    description: 'Classic fried rice cooked with tender chicken pieces, egg, and green scallions',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Chinese',
    name: 'Chilli Chicken',
    description: 'Crispy fried chicken pieces coated in a tangy, spicy red chili garlic sauce',
    price: 229.00,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },

  // --- DESSERTS ---
  {
    category: 'Desserts',
    name: 'Gulab Jamun',
    description: 'Warm, soft milk solids balls soaked in rose-flavored sugar syrup',
    price: 99.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Desserts',
    name: 'Rasmalai',
    description: 'Soft cottage cheese patties immersed in chilled, cardamom-flavored saffron milk',
    price: 119.00,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Desserts',
    name: 'Gajar Ka Halwa',
    description: 'Traditional winter carrot pudding slow-cooked with milk, ghee, nuts, and khoya',
    price: 109.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Desserts',
    name: 'Brownie',
    description: 'Rich, fudgy chocolate brownie topped with warm chocolate fudge syrup',
    price: 129.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Desserts',
    name: 'Ice Cream',
    description: 'Choice of Vanilla, Chocolate, or Mango premium ice cream scoops',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80',
    rating: 4.6
  },

  // --- BEVERAGES ---
  {
    category: 'Beverages',
    name: 'Fresh Lime Soda',
    description: 'Chilled sparkling soda seasoned with fresh lime juice, mint, and black salt',
    price: 69.00,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Beverages',
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink blended with sweet Alphonso mango pulp and saffron',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1571006682858-a45752990da5?auto=format&fit=crop&w=900&q=80',
    rating: 4.9
  },
  {
    category: 'Beverages',
    name: 'Sweet Lassi',
    description: 'Traditional Punjabi sweet yogurt drink topped with malai and pistachios',
    price: 79.00,
    image: 'https://images.unsplash.com/photo-1571006682858-a45752990da5?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Beverages',
    name: 'Masala Chai',
    description: 'Authentic Indian milk tea brewed with cardamom, ginger, and aromatic spices',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    rating: 4.8
  },
  {
    category: 'Beverages',
    name: 'Cold Coffee',
    description: 'Rich creamy iced coffee topped with chocolate powder and ice cream',
    price: 99.00,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
    rating: 4.7
  },
  {
    category: 'Beverages',
    name: 'Soft Drink',
    description: 'Chilled 300ml canned soft drink (Coca Cola, Thums Up, Sprite)',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80',
    rating: 4.5
  }
];

async function seed() {
  console.log('==================================================');
  console.log('🌱 Starting Spice Restaurant Menu Database Seed...');
  console.log('==================================================\n');

  try {
    const categoryMap = {};

    // 1. Upsert Categories
    for (const cat of CATEGORIES_DATA) {
      const [existing] = await pool.query('SELECT id FROM categories WHERE name = ?', [cat.name]);
      let catId;
      if (existing.length > 0) {
        catId = existing[0].id;
        await pool.query('UPDATE categories SET description = ? WHERE id = ?', [cat.description, catId]);
      } else {
        const [inserted] = await pool.query(
          'INSERT INTO categories (name, description) VALUES (?, ?)',
          [cat.name, cat.description]
        );
        catId = inserted.insertId;
      }
      categoryMap[cat.name] = catId;
    }

    console.log('✅ Categories synchronized:', Object.keys(categoryMap).length);

    // 2. Upsert Dishes
    let insertedCount = 0;
    let updatedCount = 0;

    for (const dish of DISHES_DATA) {
      const catId = categoryMap[dish.category];
      if (!catId) continue;

      const [existing] = await pool.query('SELECT id FROM menu_items WHERE LOWER(name) = LOWER(?)', [dish.name]);

      if (existing.length > 0) {
        await pool.query(
          `UPDATE menu_items SET 
            category_id = ?,
            description = ?,
            price = ?,
            image = ?,
            rating = ?,
            available = 1
          WHERE id = ?`,
          [catId, dish.description, dish.price, dish.image, dish.rating, existing[0].id]
        );
        updatedCount++;
      } else {
        await pool.query(
          `INSERT INTO menu_items (category_id, name, description, price, image, rating, available) 
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [catId, dish.name, dish.description, dish.price, dish.image, dish.rating]
        );
        insertedCount++;
      }
    }

    console.log(`✅ Menu items seeded: ${insertedCount} inserted, ${updatedCount} updated.`);

    const [totalItems] = await pool.query('SELECT COUNT(*) as count FROM menu_items');
    console.log(`\n🎉 Total Menu Items now in Database: ${totalItems[0].count}`);
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
