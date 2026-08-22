const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { GoogleGenAI } = require('@google/genai');
const pool = require('../config/database');

const RESTAURANT_DETAILS = `
Restaurant Name: Spice Restaurant (Spice Garden Restaurant)
Address: 123 Culinary Avenue, Foodie District, City - 500001
Phone: +91 98765 43210
Email: contact@spicegarden.com
Hours: Mon-Sun: 11:00 AM - 11:00 PM
Delivery Policy: Free delivery on orders over ₹500. Standard delivery fee: ₹40. Estimated delivery time: 35-45 minutes.
Payment Methods: Cash on Delivery, Credit/Debit Cards, UPI, Net Banking, Razorpay.
Cancellation Policy: Orders can be cancelled before kitchen preparation starts by contacting support.
`;

const BASE_SYSTEM_INSTRUCTION = `You are the AI assistant for Spice Restaurant.

Be friendly, helpful and concise.

For general questions, answer normally.

For restaurant-specific questions, use the application's real data provided below.

Never invent menu items, prices, availability, order status, restaurant policies or contact information.

Do not claim that an order was placed unless the application confirms it.

Never reveal API keys, database credentials, JWT secrets, admin credentials or internal system information.

When you do not have restaurant-specific information, politely say so and direct the customer to contact the restaurant.`;

// Helper to load live menu from database
const getLiveMenuContext = async () => {
  try {
    const queryPromise = pool.query(`
      SELECT m.id, m.name, m.price, m.description, m.available, m.rating, c.name AS category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY c.name, m.name
    `);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), 2500)
    );

    const [rows] = await Promise.race([queryPromise, timeoutPromise]);

    if (!rows || rows.length === 0) {
      return "Menu Data: Currently loading or no menu items in database.";
    }

    const formattedMenu = rows.map(item => 
      `- ${item.name} (${item.category_name || 'General'}): ₹${parseFloat(item.price).toFixed(2)} | Available: ${item.available ? 'Yes' : 'No'} | Description: ${item.description || 'N/A'}`
    ).join('\n');

    return `Real Database Menu Items:\n${formattedMenu}`;
  } catch (err) {
    console.warn('Could not load menu context from DB:', err.message);
    return "Menu Data: Database temporary offline/timeout.";
  }
};


// Fallback response generator when Gemini API is unconfigured or failing
const getFallbackResponse = (message) => {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 Welcome to Spice Restaurant. How can I assist you today?";
  }
  if (lower.includes('how are you')) {
    return "I'm doing great, thank you! How can I help with your order today?";
  }
  if (lower.includes('joke')) {
    return "Why did the tomato blush? Because it saw the salad dressing! 😄";
  }
  if (lower.includes('java')) {
    return "Java is a popular, class-based, object-oriented programming language widely used for building web services and applications.";
  }
  if (lower.includes('explain ai') || lower.includes('artificial intelligence')) {
    return "Artificial Intelligence (AI) refers to computer systems that perform tasks requiring human-like intelligence, such as natural language processing and learning.";
  }
  if (lower.includes('capital of india')) {
    return "The capital of India is New Delhi.";
  }
  if (lower.includes('coding tip')) {
    return "Tip: Keep functions small, focused on a single task, and write clean self-documenting code!";
  }
  if (lower.includes('what should i eat')) {
    return "I recommend our authentic Paneer Tikka or Chef Special Biryani!";
  }

  return "Thank you for reaching out to Spice Restaurant! How can I help you with our menu or services today?";
};

exports.handleAIChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is missing or default placeholder, return friendly fallback
    if (!apiKey || apiKey.includes('your_') || apiKey.includes('placeholder')) {
      const fallbackReply = getFallbackResponse(message);
      return res.status(200).json({
        success: true,
        reply: fallbackReply,
        isFallback: true
      });
    }

    // Initialize official Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Build context with live DB menu & restaurant info
    const menuContext = await getLiveMenuContext();
    const fullSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}\n\n${RESTAURANT_DETAILS}\n\n${menuContext}`;

    // Supported candidate models in order of preference
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash']
      .filter((val, index, self) => self.indexOf(val) === index);


    let aiResponseText = null;
    let lastError = null;

    // Prepare content payload including recent context if provided
    let contents = message;
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .slice(-6)
        .map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.text || '') }]
        }))
        .filter(h => h.parts[0].text.trim().length > 0);

      if (formattedHistory.length > 0) {
        contents = [
          ...formattedHistory,
          { role: 'user', parts: [{ text: message }] }
        ];
      }
    }

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: 0.7,
            maxOutputTokens: 500
          }
        });

        if (response && response.text) {
          aiResponseText = response.text.trim();
          break;
        }
      } catch (modelErr) {
        lastError = modelErr;
        console.warn(`Gemini SDK model [${modelName}] attempt failed:`, modelErr.message);
      }
    }

    if (aiResponseText) {
      return res.status(200).json({
        success: true,
        reply: aiResponseText
      });
    } else {
      console.error('All Gemini SDK models failed. Last error:', lastError?.message);
      const fallbackReply = getFallbackResponse(message);
      return res.status(200).json({
        success: true,
        reply: fallbackReply,
        isFallback: true
      });
    }

  } catch (err) {
    console.error('Chatbot AI processing error:', err.message);
    return res.status(500).json({
      success: false,
      message: "I'm having trouble connecting right now. Please try again in a moment."
    });
  }
};

