import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Utensils, 
  Leaf, 
  Tag, 
  Info, 
  ShoppingBag,
  Sparkles,
  Bot,
  Trash2,
  Package,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Search,
  Star
} from 'lucide-react';
import { fetchMenuItems, fetchOrderById, askChatbotAI } from '../services/api';

const RESTAURANT_INFO = {
  name: 'Spice Garden Restaurant',
  address: '123 Culinary Avenue, Foodie District, City - 500001',
  phone: '+91 98765 43210',
  email: 'contact@spicegarden.com',
  hours: 'Mon-Sun: 11:00 AM - 11:00 PM',
  delivery: 'Free delivery on orders over ₹500. Estimated delivery time: 35-45 minutes.',
  payment: 'We accept Cash on Delivery, Credit/Debit Cards, UPI, Net Banking, & Razorpay.',
  cancellation: 'Orders can be cancelled before kitchen preparation starts by contacting our support team.'
};

const Chatbot = ({ 
  cartItems = [], 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onOpenCheckout, 
  onOpenCart 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuCache, setMenuCache] = useState(null);
  const [awaitingOrderInput, setAwaitingOrderInput] = useState(false);
  const messagesEndRef = useRef(null);

  const getInitialMessages = () => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Namaste! 🙏 Welcome to Spice Garden Restaurant assistant. How can I serve you today?',
      quickActions: [
        { label: 'View Menu 🍽️', action: 'menu' },
        { label: 'Popular Dishes ⭐', action: 'popular' },
        { label: 'My Cart 🛒', action: 'cart' },
        { label: 'Track Order 📦', action: 'track' },
        { label: 'Place Order 💳', action: 'checkout' },
        { label: 'Contact Restaurant 📍', action: 'info' }
      ]
    }
  ];

  const [messages, setMessages] = useState(getInitialMessages);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Load menu items from live API
  const getMenuData = async () => {
    if (menuCache && menuCache.length > 0) return menuCache;
    try {
      const res = await fetchMenuItems('all');
      if (res.data && res.data.success) {
        setMenuCache(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error('Error fetching menu for chatbot:', err);
    }
    return [];
  };

  // Clear chat conversation
  const handleClearChat = () => {
    setMessages(getInitialMessages());
    setAwaitingOrderInput(false);
  };

  // Cart total calculations
  const calculateCartTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
    const tax = subtotal * 0.05;
    const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
    const grandTotal = subtotal + tax + deliveryFee;
    return { subtotal, tax, deliveryFee, grandTotal };
  };

  const handleSend = async (customText = null) => {
    const queryText = (customText !== null ? customText : input).trim();
    if (!queryText) return;

    if (customText === null) {
      setInput('');
    }

    // Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate natural response latency
    setTimeout(async () => {
      await processUserIntent(queryText);
      setIsTyping(false);
    }, 500);
  };

  const processUserIntent = async (queryText) => {
    const lower = queryText.toLowerCase();

    // Check if user is inputting an order ID for tracking
    if (awaitingOrderInput || /^(sg-\d+|\d+)$/i.test(queryText.trim())) {
      setAwaitingOrderInput(false);
      await handleTrackOrderById(queryText.trim());
      return;
    }

    const liveMenu = await getMenuData();

    // 1. ADD TO CART INTENT
    if (lower.startsWith('add ') || lower.includes('add to cart') || lower.includes('order ') || lower.includes('buy ')) {
      let itemNameQuery = lower
        .replace(/^add\s+/, '')
        .replace(/\s+to\s+(my\s+)?cart/i, '')
        .replace(/^(i\s+want\s+to\s+)?(order|buy|get)\s+/, '')
        .replace(/^a\s+/, '')
        .replace(/^some\s+/, '')
        .trim();

      if (itemNameQuery) {
        const matches = liveMenu.filter(item => 
          item.name.toLowerCase().includes(itemNameQuery) ||
          itemNameQuery.includes(item.name.toLowerCase())
        );

        if (matches.length === 1) {
          const itemToAdd = matches[0];
          if (onAddToCart) onAddToCart(itemToAdd);
          const totals = calculateCartTotals();
          const newSubtotal = totals.subtotal + parseFloat(itemToAdd.price);

          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `✅ Added **${itemToAdd.name}** (₹${parseFloat(itemToAdd.price).toFixed(0)}) to your cart!`,
            quickActions: [
              { label: 'View Cart 🛒', action: 'cart' },
              { label: 'Proceed to Checkout 💳', action: 'checkout' },
              { label: 'View Menu 🍽️', action: 'menu' }
            ]
          }]);
          return;
        } else if (matches.length > 1) {
          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `I found multiple matching dishes for "${itemNameQuery}". Which one would you like to add?`,
            dishes: matches,
            quickActions: [
              { label: 'View Cart 🛒', action: 'cart' }
            ]
          }]);
          return;
        } else {
          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `I couldn't find "${itemNameQuery}" on our menu. Here are some of our popular authentic dishes:`,
            dishes: liveMenu.slice(0, 4),
            quickActions: [
              { label: 'View Full Menu 🍽️', action: 'menu' }
            ]
          }]);
          return;
        }
      }
    }

    // 2. CART INTENT
    if (lower.includes('cart') || lower.includes('total') || lower.includes('my order list')) {
      if (lower.includes('total') && !lower.includes('show cart')) {
        const { subtotal, tax, deliveryFee, grandTotal } = calculateCartTotals();
        if (cartItems.length === 0) {
          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `Your cart is currently empty! Explore our delicious menu to start your order.`,
            quickActions: [{ label: 'View Menu 🍽️', action: 'menu' }]
          }]);
        } else {
          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `🛒 **Cart Summary (${cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)**\n\n• **Subtotal:** ₹${subtotal.toFixed(2)}\n• **GST (5%):** ₹${tax.toFixed(2)}\n• **Delivery Fee:** ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}\n• **Grand Total:** ₹${grandTotal.toFixed(2)}`,
            quickActions: [
              { label: 'View Cart 🛒', action: 'cart' },
              { label: 'Proceed to Checkout 💳', action: 'checkout' }
            ]
          }]);
        }
        return;
      }

      await handleShowCart();
      return;
    }

    // 3. CHECKOUT / PLACE ORDER INTENT
    if (lower.includes('checkout') || lower.includes('place order') || lower.includes('i want to order') || lower.includes('pay now')) {
      if (cartItems.length === 0) {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Your cart is currently empty! Please add your favorite dishes before proceeding to checkout.`,
          quickActions: [
            { label: 'View Menu 🍽️', action: 'menu' },
            { label: 'Popular Dishes ⭐', action: 'popular' }
          ]
        }]);
      } else {
        const { grandTotal } = calculateCartTotals();
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Awesome! You have ${cartItems.length} dish(es) in your cart (Total: ₹${grandTotal.toFixed(2)}). Click below to complete your checkout.`,
          actionButton: {
            label: 'Open Checkout Modal 💳',
            onClick: () => {
              if (onOpenCheckout) onOpenCheckout();
            }
          },
          quickActions: [
            { label: 'View Cart 🛒', action: 'cart' }
          ]
        }]);
      }
      return;
    }

    // 4. TRACK ORDER INTENT
    if (lower.includes('track') || lower.includes('where is my order') || lower.includes('order status') || lower.includes('show my order')) {
      setAwaitingOrderInput(true);
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📦 Please enter your **Order ID** or **Order Number** (e.g. \`SG-1001\` or \`1\`) to retrieve your order status:`,
        quickActions: [
          { label: 'Cancel Tracking', action: 'cancel_track' }
        ]
      }]);
      return;
    }

    // 5. MENU & CATEGORY QUERIES
    if (lower.includes('menu') || lower.includes('food') || lower.includes('what do you have') || lower.includes('dishes')) {
      if (lower.includes('veg') && !lower.includes('non veg') && !lower.includes('non-veg')) {
        await handleShowVeg(liveMenu);
        return;
      }
      if (lower.includes('non veg') || lower.includes('non-veg')) {
        await handleShowNonVeg(liveMenu);
        return;
      }
      if (lower.includes('dessert') || lower.includes('sweet')) {
        await handleShowDesserts(liveMenu);
        return;
      }
      if (lower.includes('drink') || lower.includes('beverage') || lower.includes('lassi')) {
        await handleShowDrinks(liveMenu);
        return;
      }

      await handleShowFullMenu(liveMenu);
      return;
    }

    if (lower.includes('veg') && !lower.includes('non veg') && !lower.includes('non-veg')) {
      await handleShowVeg(liveMenu);
      return;
    }

    if (lower.includes('non veg') || lower.includes('non-veg')) {
      await handleShowNonVeg(liveMenu);
      return;
    }

    if (lower.includes('dessert') || lower.includes('sweet')) {
      await handleShowDesserts(liveMenu);
      return;
    }

    if (lower.includes('drink') || lower.includes('beverage') || lower.includes('lassi')) {
      await handleShowDrinks(liveMenu);
      return;
    }

    if (lower.includes('popular') || lower.includes('best') || lower.includes('bestseller') || lower.includes('recommend')) {
      await handleShowPopular(liveMenu);
      return;
    }

    // 6. FOOD SEARCH / FILTERS
    if (lower.includes('spicy') || lower.includes('tandoori') || lower.includes('curry')) {
      const spicyDishes = liveMenu.filter(item => {
        const text = (item.name + ' ' + item.description).toLowerCase();
        return text.includes('spicy') || text.includes('tikka') || text.includes('masala') || text.includes('chilli') || text.includes('curry') || text.includes('biryani');
      });
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🌶️ Here are some spicy and flavorful options from our menu:`,
        dishes: spicyDishes.slice(0, 5),
        quickActions: [
          { label: 'View Menu 🍽️', action: 'menu' },
          { label: 'Under ₹300 💰', action: 'under300' }
        ]
      }]);
      return;
    }

    if (lower.includes('300') || lower.includes('under ₹300') || lower.includes('cheap') || lower.includes('budget')) {
      const budgetDishes = liveMenu.filter(item => parseFloat(item.price) <= 300);
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💰 Delicious authentic options available under ₹300:`,
        dishes: budgetDishes.slice(0, 5),
        quickActions: [
          { label: 'View Menu 🍽️', action: 'menu' },
          { label: 'Popular Dishes ⭐', action: 'popular' }
        ]
      }]);
      return;
    }

    // Check specific ingredient query e.g. "paneer", "chicken", "biryani", "dosa", "dal"
    const ingredientMatch = liveMenu.filter(item => 
      item.name.toLowerCase().includes(lower) || 
      lower.includes(item.name.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(lower))
    );

    if (ingredientMatch.length > 0) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Yes! We have these matching dishes on our menu:`,
        dishes: ingredientMatch.slice(0, 5),
        quickActions: [
          { label: 'View Menu 🍽️', action: 'menu' },
          { label: 'My Cart 🛒', action: 'cart' }
        ]
      }]);
      return;
    }

    // 7. RESTAURANT INFO & FAQs
    if (lower.includes('hour') || lower.includes('time') || lower.includes('open') || lower.includes('close')) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🕒 **Opening Hours**\n\n• ${RESTAURANT_INFO.hours}\n• Open for Dine-in, Pickup & Delivery!`,
        quickActions: [{ label: 'View Menu 🍽️', action: 'menu' }]
      }]);
      return;
    }

    if (lower.includes('location') || lower.includes('address') || lower.includes('where')) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📍 **Restaurant Location**\n\n${RESTAURANT_INFO.address}\n\nPhone: ${RESTAURANT_INFO.phone}`,
        quickActions: [{ label: 'Contact Restaurant 📍', action: 'info' }]
      }]);
      return;
    }

    if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('email')) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📞 **Contact Us**\n\n• **Phone:** ${RESTAURANT_INFO.phone}\n• **Email:** ${RESTAURANT_INFO.email}\n• **Address:** ${RESTAURANT_INFO.address}`,
        quickActions: [{ label: 'Track Order 📦', action: 'track' }]
      }]);
      return;
    }

    if (lower.includes('delivery') || lower.includes('pickup') || lower.includes('shipping')) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🚀 **Delivery & Pickup Policy**\n\n• ${RESTAURANT_INFO.delivery}\n• Standard delivery fee: ₹40 (FREE over ₹500)`,
        quickActions: [{ label: 'Place Order 💳', action: 'checkout' }]
      }]);
      return;
    }

    if (lower.includes('payment') || lower.includes('cod') || lower.includes('online')) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💳 **Payment Methods**\n\n${RESTAURANT_INFO.payment}`,
        quickActions: [{ label: 'Place Order 💳', action: 'checkout' }]
      }]);
      return;
    }

    if (lower.includes('cancel')) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `ℹ️ **Cancellation Policy**\n\n${RESTAURANT_INFO.cancellation}`,
        quickActions: [{ label: 'Contact Restaurant 📍', action: 'info' }]
      }]);
      return;
    }

    // 8. GENERAL AI QUESTIONS (Backend AI API Routing)
    try {
      const aiRes = await askChatbotAI(queryText, messages);
      if (aiRes.data && aiRes.data.success && aiRes.data.reply) {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: aiRes.data.reply
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "I'm having trouble connecting right now. Please try again in a moment."
        }]);
      }
    } catch (err) {
      console.error('Chatbot AI API Error:', err);
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment."
      }]);
    }
  };


  // Quick Action Handler Helper
  const handleQuickAction = async (actionKey) => {
    if (actionKey === 'cancel_track') {
      setAwaitingOrderInput(false);
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Cancelled tracking request. How else may I help you?`,
        quickActions: getInitialMessages()[0].quickActions
      }]);
      return;
    }

    setIsTyping(true);
    const liveMenu = await getMenuData();
    setIsTyping(false);

    switch (actionKey) {
      case 'menu':
        await handleShowFullMenu(liveMenu);
        break;
      case 'popular':
        await handleShowPopular(liveMenu);
        break;
      case 'cart':
        await handleShowCart();
        break;
      case 'track':
        setAwaitingOrderInput(true);
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📦 Please enter your **Order ID** or **Order Number** (e.g. \`SG-1001\` or \`1\`):`,
          quickActions: [{ label: 'Cancel', action: 'cancel_track' }]
        }]);
        break;
      case 'checkout':
        handleSend('I want to checkout');
        break;
      case 'info':
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📍 **${RESTAURANT_INFO.name}**\n\n• **Address:** ${RESTAURANT_INFO.address}\n• **Hours:** ${RESTAURANT_INFO.hours}\n• **Phone:** ${RESTAURANT_INFO.phone}\n• **Email:** ${RESTAURANT_INFO.email}`,
          quickActions: [
            { label: 'View Menu 🍽️', action: 'menu' },
            { label: 'Track Order 📦', action: 'track' }
          ]
        }]);
        break;
      case 'under300':
        handleSend('Show me something under ₹300');
        break;
      default:
        break;
    }
  };

  const handleShowFullMenu = async (liveMenu) => {
    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: liveMenu.length > 0 
        ? `🍽️ Here are top authentic dishes from our live menu:`
        : `Loading live menu from database...`,
      dishes: liveMenu.slice(0, 6),
      quickActions: [
        { label: 'Vegetarian 🌱', action: 'veg' },
        { label: 'Popular Dishes ⭐', action: 'popular' },
        { label: 'Under ₹300 💰', action: 'under300' }
      ]
    }]);
  };

  const handleShowVeg = async (liveMenu) => {
    const vegDishes = liveMenu.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      return item.is_veg === 1 || item.is_veg === true || cat.includes('veg') || name.includes('paneer') || name.includes('dal') || name.includes('dosa') || name.includes('manchurian');
    });

    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🌱 Pure Vegetarian Delights from our kitchen:`,
      dishes: vegDishes.slice(0, 5),
      quickActions: [
        { label: 'View Full Menu 🍽️', action: 'menu' },
        { label: 'My Cart 🛒', action: 'cart' }
      ]
    }]);
  };

  const handleShowNonVeg = async (liveMenu) => {
    const nonVegDishes = liveMenu.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      return item.is_veg === 0 || cat.includes('non') || name.includes('chicken') || name.includes('mutton') || name.includes('fish') || name.includes('biryani');
    });

    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🍗 Non-Vegetarian Tandoori & Biryani Specialties:`,
      dishes: nonVegDishes.slice(0, 5),
      quickActions: [
        { label: 'View Full Menu 🍽️', action: 'menu' },
        { label: 'My Cart 🛒', action: 'cart' }
      ]
    }]);
  };

  const handleShowDesserts = async (liveMenu) => {
    const desserts = liveMenu.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      return cat.includes('dessert') || cat.includes('sweet') || name.includes('jamun') || name.includes('kulfi') || name.includes('halwa');
    });

    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🍨 Sweet Desserts to finish your meal:`,
      dishes: desserts.length > 0 ? desserts : liveMenu.slice(0, 3),
      quickActions: [{ label: 'View Menu 🍽️', action: 'menu' }]
    }]);
  };

  const handleShowDrinks = async (liveMenu) => {
    const drinks = liveMenu.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      return cat.includes('beverage') || cat.includes('drink') || name.includes('lassi') || name.includes('soda') || name.includes('tea') || name.includes('coffee');
    });

    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🥤 Refreshing Beverages & Lassi:`,
      dishes: drinks.length > 0 ? drinks : liveMenu.slice(0, 3),
      quickActions: [{ label: 'View Menu 🍽️', action: 'menu' }]
    }]);
  };

  const handleShowPopular = async (liveMenu) => {
    const topDishes = [...liveMenu].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5)).slice(0, 5);

    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `⭐ Customer Bestseller Favorites:`,
      dishes: topDishes,
      quickActions: [
        { label: 'My Cart 🛒', action: 'cart' },
        { label: 'Place Order 💳', action: 'checkout' }
      ]
    }]);
  };

  const handleShowCart = async () => {
    if (!cartItems || cartItems.length === 0) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🛒 Your cart is currently empty. Add your favorite dishes from our menu!`,
        quickActions: [
          { label: 'View Menu 🍽️', action: 'menu' },
          { label: 'Popular Dishes ⭐', action: 'popular' }
        ]
      }]);
      return;
    }

    const { subtotal, tax, deliveryFee, grandTotal } = calculateCartTotals();

    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `🛒 **Your Current Cart (${cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)**`,
      cartDetails: {
        items: cartItems,
        subtotal,
        tax,
        deliveryFee,
        grandTotal
      },
      quickActions: [
        { label: 'Proceed to Checkout 💳', action: 'checkout' },
        { label: 'Add More Food 🍽️', action: 'menu' }
      ]
    }]);
  };

  const handleTrackOrderById = async (orderIdQuery) => {
    try {
      const res = await fetchOrderById(orderIdQuery);
      if (res.data && res.data.success && res.data.data) {
        const order = res.data.data;
        const statusFormatted = (order.order_status || 'pending').toUpperCase();

        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📦 **Order Tracking Details**\n\n• **Order #:** ${order.order_number || order.id}\n• **Customer:** ${order.customer_name || 'Guest'}\n• **Status:** ${statusFormatted}\n• **Payment:** ${order.payment_status || 'pending'}\n• **Total Amount:** ₹${parseFloat(order.total_amount).toFixed(2)}\n• **Delivery Address:** ${order.delivery_address || 'N/A'}\n\n**Items Ordered:**\n${(order.items || []).map(i => `• ${i.item_name || 'Dish'} x ${i.quantity} (₹${parseFloat(i.price).toFixed(0)})`).join('\n')}`,
          quickActions: [
            { label: 'Contact Restaurant 📍', action: 'info' },
            { label: 'View Menu 🍽️', action: 'menu' }
          ]
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `❌ Order "${orderIdQuery}" was not found in our database. Please verify your Order ID and try again, or contact our support team.`,
          quickActions: [
            { label: 'Track Order 📦', action: 'track' },
            { label: 'Contact Support 📍', action: 'info' }
          ]
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `❌ Could not find order "${orderIdQuery}". Please check the ID or contact restaurant support at ${RESTAURANT_INFO.phone}.`,
        quickActions: [
          { label: 'Track Order 📦', action: 'track' },
          { label: 'Contact Support 📍', action: 'info' }
        ]
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chatbot Trigger Button */}
      <button 
        className={`chatbot-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
        title="Chat with Spice Assistant"
      >
        {isOpen ? (
          <X size={26} color="#FFFFFF" />
        ) : (
          <div className="trigger-content">
            <MessageSquare size={26} color="#FFFFFF" />
            <span className="trigger-badge">
              {cartItems.length > 0 ? cartItems.length : 1}
            </span>
          </div>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={22} color="#FFFFFF" />
              </div>
              <div>
                <h3 className="bot-name">Spice Assistant 🌶️</h3>
                <span className="bot-status">
                  <span className="status-dot"></span> Online | Spice Garden
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="close-btn"
                onClick={handleClearChat}
                title="Clear Chat History"
                aria-label="Clear Chat"
              >
                <Trash2 size={17} />
              </button>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="msg-avatar">
                    <Bot size={16} color="#FFFFFF" />
                  </div>
                )}
                
                <div className={`message-bubble ${msg.sender}`}>
                  <div className="message-text">
                    {msg.text.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Dishes cards inside message */}
                  {msg.dishes && msg.dishes.length > 0 && (
                    <div className="bot-dishes-list">
                      {msg.dishes.map((dish) => (
                        <div key={dish.id} className="bot-dish-card">
                          <div className="bot-dish-info">
                            <span className="bot-dish-name">
                              {dish.name} {dish.is_veg ? '🌱' : '🍗'}
                            </span>
                            <span className="bot-dish-price">₹{parseFloat(dish.price).toFixed(0)}</span>
                          </div>
                          {dish.description && (
                            <p className="bot-dish-desc">{dish.description.slice(0, 70)}...</p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
                              Available
                            </span>
                            {onAddToCart && (
                              <button 
                                className="bot-add-cart-btn"
                                onClick={() => onAddToCart(dish)}
                              >
                                <ShoppingBag size={12} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Cart Details inside Bot Bubble */}
                  {msg.cartDetails && (
                    <div className="bot-cart-wrapper">
                      {msg.cartDetails.items.map((ci) => (
                        <div key={ci.id} className="bot-cart-item">
                          <div>
                            <span className="bot-cart-item-name">{ci.name}</span>
                            <span className="bot-cart-item-meta">₹{parseFloat(ci.price).toFixed(0)} x {ci.quantity}</span>
                          </div>
                          <div className="bot-cart-qty-controls">
                            <button onClick={() => onUpdateQuantity && onUpdateQuantity(ci.id, ci.quantity - 1)}>
                              <Minus size={12} />
                            </button>
                            <span>{ci.quantity}</span>
                            <button onClick={() => onUpdateQuantity && onUpdateQuantity(ci.id, ci.quantity + 1)}>
                              <Plus size={12} />
                            </button>
                            <button onClick={() => onRemoveItem && onRemoveItem(ci.id)} style={{ color: '#E53935', marginLeft: '4px' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="bot-cart-totals">
                        <div><span>Subtotal:</span> <span>₹{msg.cartDetails.subtotal.toFixed(2)}</span></div>
                        <div><span>Tax (5%):</span> <span>₹{msg.cartDetails.tax.toFixed(2)}</span></div>
                        <div><span>Delivery:</span> <span>{msg.cartDetails.deliveryFee === 0 ? 'FREE' : `₹${msg.cartDetails.deliveryFee}`}</span></div>
                        <div className="total-row"><span>Grand Total:</span> <span>₹{msg.cartDetails.grandTotal.toFixed(2)}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Special Action Button */}
                  {msg.actionButton && (
                    <button 
                      className="bot-action-main-btn"
                      onClick={msg.actionButton.onClick}
                    >
                      {msg.actionButton.label}
                    </button>
                  )}

                  {/* Inline Quick Action Chips */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="inline-quick-actions">
                      {msg.quickActions.map((qa, index) => (
                        <button
                          key={index}
                          className="quick-chip"
                          onClick={() => {
                            if (qa.action) handleQuickAction(qa.action);
                            else handleSend(qa.label);
                          }}
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-row bot-row">
                <div className="msg-avatar">
                  <Bot size={16} color="#FFFFFF" />
                </div>
                <div className="message-bubble bot typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Useful Quick Actions Bar */}
          <div className="chatbot-toolbar">
            <button className="toolbar-chip" onClick={() => handleQuickAction('menu')}>
              <Utensils size={13} /> View Menu
            </button>
            <button className="toolbar-chip" onClick={() => handleQuickAction('popular')}>
              <Star size={13} /> Popular
            </button>
            <button className="toolbar-chip" onClick={() => handleQuickAction('cart')}>
              <ShoppingBag size={13} /> My Cart ({cartItems.length})
            </button>
            <button className="toolbar-chip" onClick={() => handleQuickAction('track')}>
              <Package size={13} /> Track Order
            </button>
            <button className="toolbar-chip" onClick={() => handleQuickAction('checkout')}>
              <CreditCard size={13} /> Place Order
            </button>
            <button className="toolbar-chip" onClick={() => handleQuickAction('info')}>
              <Info size={13} /> Contact Us
            </button>
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder={awaitingOrderInput ? "Enter Order ID e.g. SG-1001..." : "Ask Spice Assistant..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
