/* ============================================================
   CRAVECART — PREMIUM VEGETARIAN FOOD ORDERING WEBSITE
   File: app.js

   Features:
   - Vegetarian product catalogue
   - Product search, category filtering and sorting
   - Shopping cart and quantity controls
   - Wishlist / favourites
   - Coupon codes
   - Checkout and order history
   - Invoice generation, printing and download
   - localStorage persistence
   - Newsletter demo
   - Mobile navigation and toast notifications

   IMPORTANT:
   This version is a frontend demo. Orders and admin data are
   stored in this browser's localStorage, not a shared database.
============================================================ */

(() => {
  "use strict";

  /* ==========================================================
     1. CONFIGURATION
  ========================================================== */

  const CONFIG = {
    currency: "INR",
    locale: "en-IN",
    taxRate: 0.05,
    deliveryFee: 39,
    freeDeliveryMinimum: 499,
    minimumOrder: 99,

    storage: {
      products: "cravecart_products",
      cart: "cravecart_cart",
      wishlist: "cravecart_wishlist",
      orders: "cravecart_orders",
      coupon: "cravecart_coupon",
      lastOrder: "cravecart_last_order",
      newsletter: "cravecart_newsletter"
    }
  };

  const CATEGORY_NAMES = {
    all: "All Products",
    pizza: "Pizza",
    burger: "Burgers",
    indian: "Indian Food",
    chinese: "Chinese",
    snacks: "Snacks",
    dessert: "Desserts",
    drinks: "Drinks"
  };

  const CATEGORY_ICONS = {
    all: "🍽️",
    pizza: "🍕",
    burger: "🍔",
    indian: "🍛",
    chinese: "🥡",
    snacks: "🍟",
    dessert: "🍰",
    drinks: "🥤"
  };

  const COUPONS = {
    CRAVE10: {
      type: "percent",
      value: 10,
      minimum: 199,
      maximumDiscount: 150,
      description: "10% off on orders above ₹199"
    },

    WELCOME50: {
      type: "flat",
      value: 50,
      minimum: 299,
      maximumDiscount: 50,
      description: "₹50 off on orders above ₹299"
    },

    FREESHIP: {
      type: "shipping",
      value: 0,
      minimum: 199,
      maximumDiscount: 39,
      description: "Free delivery on orders above ₹199"
    }
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const money = (amount) =>
    new Intl.NumberFormat(CONFIG.locale, {
      style: "currency",
      currency: CONFIG.currency,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);

  const number = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const safeJSON = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  };

  const readStorage = (key, fallback) => {
    try {
      return safeJSON(localStorage.getItem(key), fallback);
    } catch {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("CraveCart could not save data:", error);
      return false;
    }
  };

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  const createId = (prefix = "CC") =>
    `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

  const formatDate = (dateValue = new Date()) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateValue));

  /* ==========================================================
     2. VEGETARIAN PRODUCT CATALOGUE
     Products are automatically seeded on first visit.
     No non-vegetarian products are included.
  ========================================================== */

  const SEED_PRODUCTS = [
    // PIZZA
    {
      id: "veg-pizza-001",
      name: "Margherita Pizza",
      category: "pizza",
      price: 179,
      originalPrice: 229,
      description: "Classic pizza with mozzarella, tomato sauce and basil.",
      badge: "Bestseller",
      stock: 30,
      available: true,
      image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-pizza-002",
      name: "Farmhouse Pizza",
      category: "pizza",
      price: 279,
      originalPrice: 329,
      description: "Loaded with capsicum, onion, tomato and mushrooms.",
      badge: "Popular",
      stock: 24,
      available: true,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-pizza-003",
      name: "Paneer Tikka Pizza",
      category: "pizza",
      price: 299,
      originalPrice: 349,
      description: "Tandoori paneer, onion, peppers and creamy cheese.",
      badge: "Chef's Special",
      stock: 20,
      available: true,
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-pizza-004",
      name: "Four Cheese Pizza",
      category: "pizza",
      price: 319,
      originalPrice: 379,
      description: "A rich blend of cheese on a crisp pizza base.",
      badge: "Premium",
      stock: 16,
      available: true,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-pizza-005",
      name: "Mexican Veg Pizza",
      category: "pizza",
      price: 269,
      originalPrice: 319,
      description: "Spicy beans, peppers, sweet corn and melted cheese.",
      badge: "Spicy",
      stock: 18,
      available: true,
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=700&q=85"
    },

    // BURGERS
    {
      id: "veg-burger-001",
      name: "Classic Veg Burger",
      category: "burger",
      price: 99,
      originalPrice: 129,
      description: "Crispy vegetable patty with lettuce and house sauce.",
      badge: "Bestseller",
      stock: 35,
      available: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-burger-002",
      name: "Paneer Crunch Burger",
      category: "burger",
      price: 149,
      originalPrice: 179,
      description: "Crunchy paneer patty, fresh vegetables and creamy sauce.",
      badge: "Popular",
      stock: 28,
      available: true,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-burger-003",
      name: "Double Cheese Burger",
      category: "burger",
      price: 169,
      originalPrice: 199,
      description: "A double cheese treat with a delicious veggie patty.",
      badge: "Cheesy",
      stock: 22,
      available: true,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-burger-004",
      name: "Spicy Aloo Burger",
      category: "burger",
      price: 89,
      originalPrice: 109,
      description: "Spiced potato patty, onions and tangy mint sauce.",
      badge: "Value Pick",
      stock: 32,
      available: true,
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-burger-005",
      name: "Mushroom Swiss Burger",
      category: "burger",
      price: 189,
      originalPrice: 229,
      description: "Sautéed mushrooms, Swiss-style cheese and veggie patty.",
      badge: "Premium",
      stock: 15,
      available: true,
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=85"
    },

    // INDIAN FOOD
    {
      id: "veg-indian-001",
      name: "Paneer Butter Masala",
      category: "indian",
      price: 229,
      originalPrice: 269,
      description: "Soft paneer in a rich tomato and butter gravy.",
      badge: "Bestseller",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-002",
      name: "Shahi Paneer",
      category: "indian",
      price: 249,
      originalPrice: 289,
      description: "Creamy royal paneer curry with aromatic spices.",
      badge: "Premium",
      stock: 20,
      available: true,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-003",
      name: "Dal Makhani",
      category: "indian",
      price: 179,
      originalPrice: 219,
      description: "Slow-cooked black lentils finished with butter and cream.",
      badge: "Comfort Food",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-004",
      name: "Veg Biryani",
      category: "indian",
      price: 189,
      originalPrice: 229,
      description: "Fragrant basmati rice, vegetables and whole spices.",
      badge: "Popular",
      stock: 28,
      available: true,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-005",
      name: "Chole Bhature",
      category: "indian",
      price: 149,
      originalPrice: 179,
      description: "Spiced chickpea curry served with fluffy bhature.",
      badge: "North Indian",
      stock: 24,
      available: true,
      image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-006",
      name: "Masala Dosa",
      category: "indian",
      price: 119,
      originalPrice: 149,
      description: "Golden dosa filled with spiced potato masala.",
      badge: "South Indian",
      stock: 30,
      available: true,
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-007",
      name: "Paneer Tikka",
      category: "indian",
      price: 219,
      originalPrice: 259,
      description: "Tandoori paneer cubes with peppers and spices.",
      badge: "Tandoori",
      stock: 18,
      available: true,
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-indian-008",
      name: "Veg Fried Rice",
      category: "indian",
      price: 139,
      originalPrice: 169,
      description: "Wok-tossed rice with vegetables and mild seasoning.",
      badge: "",
      stock: 28,
      available: true,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=85"
    },

    // CHINESE
    {
      id: "veg-chinese-001",
      name: "Veg Hakka Noodles",
      category: "chinese",
      price: 149,
      originalPrice: 179,
      description: "Noodles tossed with crunchy vegetables and sauces.",
      badge: "Popular",
      stock: 28,
      available: true,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-chinese-002",
      name: "Veg Manchurian",
      category: "chinese",
      price: 159,
      originalPrice: 189,
      description: "Vegetable dumplings in a tangy Indo-Chinese sauce.",
      badge: "Spicy",
      stock: 22,
      available: true,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-chinese-003",
      name: "Chilli Paneer",
      category: "chinese",
      price: 199,
      originalPrice: 239,
      description: "Paneer tossed with peppers, onions and chilli sauce.",
      badge: "Chef's Special",
      stock: 20,
      available: true,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-chinese-004",
      name: "Veg Spring Rolls",
      category: "chinese",
      price: 119,
      originalPrice: 149,
      description: "Crispy rolls filled with seasoned vegetables.",
      badge: "Crispy",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1548507200-9a3e3f9c2f2b?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-chinese-005",
      name: "Schezwan Noodles",
      category: "chinese",
      price: 169,
      originalPrice: 199,
      description: "Hot and spicy noodles with vegetables and Schezwan sauce.",
      badge: "Hot",
      stock: 20,
      available: true,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=85"
    },

    // SNACKS
    {
      id: "veg-snacks-001",
      name: "French Fries",
      category: "snacks",
      price: 89,
      originalPrice: 109,
      description: "Golden, crispy fries with a pinch of seasoning.",
      badge: "Classic",
      stock: 40,
      available: true,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-snacks-002",
      name: "Peri Peri Fries",
      category: "snacks",
      price: 109,
      originalPrice: 139,
      description: "Crispy fries tossed in a bold peri peri seasoning.",
      badge: "Spicy",
      stock: 35,
      available: true,
      image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-snacks-003",
      name: "Veg Cheese Sandwich",
      category: "snacks",
      price: 119,
      originalPrice: 149,
      description: "Toasted bread with cheese and fresh vegetables.",
      badge: "Quick Bite",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-snacks-004",
      name: "Paneer Wrap",
      category: "snacks",
      price: 139,
      originalPrice: 169,
      description: "Soft wrap filled with paneer, vegetables and mint sauce.",
      badge: "Filling",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-snacks-005",
      name: "Cheese Garlic Bread",
      category: "snacks",
      price: 129,
      originalPrice: 159,
      description: "Toasted garlic bread topped with melted cheese.",
      badge: "Cheesy",
      stock: 22,
      available: true,
      image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-snacks-006",
      name: "Veg Momos",
      category: "snacks",
      price: 99,
      originalPrice: 129,
      description: "Steamed vegetable dumplings served with spicy chutney.",
      badge: "Street Food",
      stock: 30,
      available: true,
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=85"
    },

    // DESSERTS
    {
      id: "veg-dessert-001",
      name: "Chocolate Brownie",
      category: "dessert",
      price: 99,
      originalPrice: 129,
      description: "Rich chocolate brownie with a soft, fudgy centre.",
      badge: "Bestseller",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-dessert-002",
      name: "Chocolate Cake",
      category: "dessert",
      price: 149,
      originalPrice: 179,
      description: "Moist chocolate cake layered with chocolate frosting.",
      badge: "Chocolate Lover",
      stock: 18,
      available: true,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-dessert-003",
      name: "Strawberry Cheesecake",
      category: "dessert",
      price: 179,
      originalPrice: 219,
      description: "Creamy cheesecake with a strawberry topping.",
      badge: "Premium",
      stock: 12,
      available: true,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-dessert-004",
      name: "Vanilla Ice Cream",
      category: "dessert",
      price: 79,
      originalPrice: 99,
      description: "Smooth vanilla ice cream served chilled.",
      badge: "Classic",
      stock: 30,
      available: true,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-dessert-005",
      name: "Gulab Jamun",
      category: "dessert",
      price: 89,
      originalPrice: 109,
      description: "Soft milk-solid dumplings in fragrant sugar syrup.",
      badge: "Indian Sweet",
      stock: 30,
      available: true,
      image: "https://images.unsplash.com/photo-1666190092159-2f5c6e7b3a76?auto=format&fit=crop&w=700&q=85"
    },

    // DRINKS
    {
      id: "veg-drinks-001",
      name: "Mango Smoothie",
      category: "drinks",
      price: 119,
      originalPrice: 149,
      description: "A refreshing mango smoothie made with ripe mangoes.",
      badge: "Refreshing",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-drinks-002",
      name: "Cold Coffee",
      category: "drinks",
      price: 109,
      originalPrice: 139,
      description: "Chilled coffee blended until smooth and creamy.",
      badge: "Popular",
      stock: 25,
      available: true,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-drinks-003",
      name: "Fresh Lemon Soda",
      category: "drinks",
      price: 69,
      originalPrice: 89,
      description: "A fizzy lemon drink with a fresh citrus flavour.",
      badge: "Refreshing",
      stock: 40,
      available: true,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-drinks-004",
      name: "Strawberry Milkshake",
      category: "drinks",
      price: 129,
      originalPrice: 159,
      description: "Creamy strawberry milkshake with a fruity flavour.",
      badge: "Sweet Treat",
      stock: 20,
      available: true,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: "veg-drinks-005",
      name: "Masala Chai",
      category: "drinks",
      price: 39,
      originalPrice: 49,
      description: "Indian tea brewed with aromatic spices and milk.",
      badge: "Everyday Favourite",
      stock: 50,
      available: true,
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=700&q=85"
    }
  ];

  /* ==========================================================
     3. APPLICATION STATE
  ========================================================== */

  let products = [];
  let cart = [];
  let wishlist = [];
  let orders = [];
  let activeCategory = "all";
  let searchTerm = "";
  let sortMode = "featured";
  let activeCoupon = null;
  let lastOrder = null;
  let toastTimer = null;

  /* ==========================================================
     4. STORAGE AND PRODUCT NORMALISATION
  ========================================================== */

  function normaliseProduct(product, index = 0) {
    const category = String(product.category || "snacks").toLowerCase();

    return {
      id: String(product.id || `product-${index + 1}`),
      name: String(product.name || "Vegetarian Food"),
      category: CATEGORY_NAMES[category] ? category : "snacks",
      price: Math.max(0, number(product.price)),
      originalPrice: Math.max(
        number(product.originalPrice),
        number(product.price)
      ),
      description: String(product.description || "Freshly prepared vegetarian food."),
      badge: String(product.badge || ""),
      image: String(product.image || ""),
      stock: Math.max(0, Math.floor(number(product.stock ?? 20))),
      available: product.available !== false
    };
  }

  function initialiseProducts() {
    const savedProducts = readStorage(CONFIG.storage.products, null);

    if (Array.isArray(savedProducts) && savedProducts.length > 0) {
      products = savedProducts.map(normaliseProduct);
    } else {
      products = SEED_PRODUCTS.map(normaliseProduct);
      writeStorage(CONFIG.storage.products, products);
    }

    // Keep only products that have a usable ID.
    products = products.filter((product) => product.id);
  }

  function loadState() {
    const storedCart = readStorage(CONFIG.storage.cart, []);
    const storedWishlist = readStorage(CONFIG.storage.wishlist, []);
    const storedOrders = readStorage(CONFIG.storage.orders, []);

    cart = Array.isArray(storedCart)
      ? storedCart
          .map((item) => ({
            id: String(item.id || ""),
            quantity: Math.max(1, Math.floor(number(item.quantity || 1)))
          }))
          .filter((item) => item.id)
      : [];

    wishlist = Array.isArray(storedWishlist)
      ? [...new Set(storedWishlist.map(String))]
      : [];

    orders = Array.isArray(storedOrders) ? storedOrders : [];

    activeCoupon = readStorage(CONFIG.storage.coupon, null);
    lastOrder = readStorage(CONFIG.storage.lastOrder, null);
  }

  function saveState() {
    writeStorage(CONFIG.storage.cart, cart);
    writeStorage(CONFIG.storage.wishlist, wishlist);
    writeStorage(CONFIG.storage.orders, orders);
    writeStorage(CONFIG.storage.coupon, activeCoupon);
    writeStorage(CONFIG.storage.lastOrder, lastOrder);
  }

  function getProduct(productId) {
    return products.find((product) => product.id === String(productId));
  }

  function getAvailableProducts() {
    return products.filter((product) => product.available && product.stock > 0);
  }

  /* ==========================================================
     5. TOAST NOTIFICATIONS
  ========================================================== */

  function showToast(message, type = "success") {
    const container = $("#toast-container");

    if (!container) {
      console.log(`[CraveCart ${type}] ${message}`);
      return;
    }

    const toast = document.createElement("div");
    toast.className = `cc-toast cc-toast-${type}`;
    toast.setAttribute("role", "status");

    const icon = type === "error"
      ? "✕"
      : type === "warning"
        ? "!"
        : "✓";

    toast.innerHTML = `
      <span class="cc-toast-icon" aria-hidden="true">${icon}</span>
      <span class="cc-toast-message">${escapeHTML(message)}</span>
      <button class="cc-toast-close" type="button" aria-label="Dismiss notification">×</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("is-visible"));

    const removeToast = () => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 250);
    };

    $(".cc-toast-close", toast)?.addEventListener("click", removeToast);
    window.setTimeout(removeToast, 3500);
  }

  /* ==========================================================
     6. PRODUCT IMAGE FALLBACK
  ========================================================== */

  function fallbackImage(imageElement) {
    if (!imageElement || imageElement.dataset.fallbackUsed === "true") {
      return;
    }

    imageElement.dataset.fallbackUsed = "true";

    // A built-in SVG fallback means the card still looks present
    // if an external image URL fails.
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
        <rect width="600" height="450" fill="#202020"/>
        <circle cx="300" cy="200" r="90" fill="#ff6a1a" opacity=".2"/>
        <text x="300" y="215" font-size="80" text-anchor="middle">🥗</text>
        <text x="300" y="330" fill="#ffffff" font-size="25" text-anchor="middle" font-family="Arial">CraveCart</text>
        <text x="300" y="365" fill="#aaaaaa" font-size="16" text-anchor="middle" font-family="Arial">Fresh vegetarian food</text>
      </svg>
    `;

    imageElement.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  document.addEventListener("error", (event) => {
    const target = event.target;

    if (
      target instanceof HTMLImageElement &&
      target.classList.contains("product-image")
    ) {
      fallbackImage(target);
    }
  }, true);

  /* ==========================================================
     7. PRODUCT CARD RENDERING
  ========================================================== */

  function productCardHTML(product) {
    const discount = product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

    const isFavourite = wishlist.includes(product.id);
    const outOfStock = !product.available || product.stock <= 0;
    const categoryName = CATEGORY_NAMES[product.category] || "Food";

    return `
      <article class="product-card" data-product-id="${escapeHTML(product.id)}">
        <div class="product-image-wrap">
          <img
            class="product-image"
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            decoding="async"
          >

          ${product.badge ? `
            <span class="product-badge">${escapeHTML(product.badge)}</span>
          ` : ""}

          ${discount > 0 ? `
            <span class="product-discount">${discount}% OFF</span>
          ` : ""}

          <button
            type="button"
            class="product-wishlist-btn ${isFavourite ? "is-active" : ""}"
            data-action="toggle-wishlist"
            data-id="${escapeHTML(product.id)}"
            aria-label="${isFavourite ? "Remove from" : "Add to"} favourites"
            aria-pressed="${isFavourite}"
          >${isFavourite ? "♥" : "♡"}</button>
        </div>

        <div class="product-details">
          <div class="product-category">
            <span aria-hidden="true">${CATEGORY_ICONS[product.category] || "🍽️"}</span>
            ${escapeHTML(categoryName)}
          </div>

          <h3 class="product-title">${escapeHTML(product.name)}</h3>

          <p class="product-description">${escapeHTML(product.description)}</p>

          <div class="product-footer">
            <div class="product-price-wrap">
              <span class="product-price">${money(product.price)}</span>
              ${product.originalPrice > product.price ? `
                <del class="product-original-price">${money(product.originalPrice)}</del>
              ` : ""}
            </div>

            <button
              type="button"
              class="add-to-cart-btn"
              data-action="add-to-cart"
              data-id="${escapeHTML(product.id)}"
              ${outOfStock ? "disabled" : ""}
            >
              ${outOfStock ? "Sold Out" : '<span aria-hidden="true">＋</span> Add'}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const grid = $("#products-grid");
    if (!grid) return;

    let visibleProducts = getAvailableProducts();

    if (activeCategory !== "all") {
      visibleProducts = visibleProducts.filter(
        (product) => product.category === activeCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      visibleProducts = visibleProducts.filter((product) =>
        [
          product.name,
          product.description,
          product.category,
          product.badge
        ].some((value) => String(value).toLowerCase().includes(term))
      );
    }

    switch (sortMode) {
      case "price-low":
      case "price-asc":
        visibleProducts.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
      case "price-desc":
        visibleProducts.sort((a, b) => b.price - a.price);
        break;

      case "name":
      case "name-asc":
        visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "discount":
        visibleProducts.sort((a, b) => {
          const discountA = a.originalPrice
            ? (a.originalPrice - a.price) / a.originalPrice
            : 0;
          const discountB = b.originalPrice
            ? (b.originalPrice - b.price) / b.originalPrice
            : 0;

          return discountB - discountA;
        });
        break;

      default:
        break;
    }

    grid.innerHTML = visibleProducts.map(productCardHTML).join("");

    const resultCount = $("#product-results-count");
    if (resultCount) {
      resultCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} found`;
    }

    const noResults = $("#no-results");
    if (noResults) {
      noResults.hidden = visibleProducts.length > 0;
    }

    const activeFilters = $("#active-filters");
    if (activeFilters) {
      const parts = [];

      if (activeCategory !== "all") {
        parts.push(CATEGORY_NAMES[activeCategory] || activeCategory);
      }

      if (searchTerm) {
        parts.push(`Search: "${searchTerm}"`);
      }

      activeFilters.textContent = parts.join(" · ");
    }

    const showAll = $("#show-all-products");
    if (showAll) {
      showAll.hidden = activeCategory === "all" && !searchTerm;
    }

    // Trigger a custom event for optional animations or integrations.
    document.dispatchEvent(new CustomEvent("cravecart:products-rendered", {
      detail: { count: visibleProducts.length }
    }));
  }

  /* ==========================================================
     8. CATEGORY FILTERING
  ========================================================== */

  function setActiveCategory(category) {
    activeCategory = CATEGORY_NAMES[category] ? category : "all";

    $$(".category-card").forEach((card) => {
      const selected = card.dataset.category === activeCategory;

      card.classList.toggle("is-active", selected);
      card.classList.toggle("active", selected);

      if (card.matches("button")) {
        card.setAttribute("aria-pressed", String(selected));
      }
    });

    renderProducts();

    const productSection = $("#products");
    if (productSection && activeCategory !== "all") {
      productSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function renderCategoryCounts() {
    $$(".category-card").forEach((card) => {
      const category = card.dataset.category;
      if (!category) return;

      const count = category === "all"
        ? getAvailableProducts().length
        : getAvailableProducts().filter((product) => product.category === category).length;

      const countElement = $(".category-count", card);

      if (countElement) {
        countElement.textContent = count;
      }
    });
  }

  /* ==========================================================
     9. CART HELPERS
  ========================================================== */

  function getCartItems() {
    return cart
      .map((item) => {
        const product = getProduct(item.id);

        if (!product) return null;

        return {
          ...product,
          quantity: Math.min(
            Math.max(1, item.quantity),
            Math.max(1, product.stock)
          )
        };
      })
      .filter(Boolean);
  }

  function getSubtotal() {
    return getCartItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function calculateDiscount(subtotal = getSubtotal()) {
    if (!activeCoupon || !activeCoupon.code) return 0;

    const coupon = COUPONS[String(activeCoupon.code).toUpperCase()];
    if (!coupon || subtotal < coupon.minimum) return 0;

    if (coupon.type === "percent") {
      return Math.min(
        subtotal * (coupon.value / 100),
        coupon.maximumDiscount
      );
    }

    if (coupon.type === "flat") {
      return Math.min(coupon.value, subtotal);
    }

    return 0;
  }

  function calculateDelivery(subtotal = getSubtotal()) {
    if (subtotal <= 0) return 0;

    const couponCode = activeCoupon?.code?.toUpperCase();

    if (
      subtotal >= CONFIG.freeDeliveryMinimum ||
      couponCode === "FREESHIP"
    ) {
      return 0;
    }

    return CONFIG.deliveryFee;
  }

  function calculateTax(subtotal = getSubtotal(), discount = calculateDiscount(subtotal)) {
    return Math.max(0, subtotal - discount) * CONFIG.taxRate;
  }

  function calculateTotal() {
    const subtotal = getSubtotal();
    const discount = calculateDiscount(subtotal);
    const delivery = calculateDelivery(subtotal);
    const tax = calculateTax(subtotal, discount);

    return {
      subtotal,
      discount,
      delivery,
      tax,
      total: Math.max(0, subtotal - discount + delivery + tax)
    };
  }

  /* ==========================================================
     10. CART RENDERING
  ========================================================== */

  function cartItemHTML(item) {
    return `
      <article class="cart-item" data-cart-id="${escapeHTML(item.id)}">
        <img
          class="cart-item-image"
          src="${escapeHTML(item.image)}"
          alt="${escapeHTML(item.name)}"
          loading="lazy"
        >

        <div class="cart-item-details">
          <h4 class="cart-item-title">${escapeHTML(item.name)}</h4>
          <p class="cart-item-price">${money(item.price)}</p>

          <div class="cart-item-controls">
            <button
              type="button"
              data-action="decrease-quantity"
              data-id="${escapeHTML(item.id)}"
              aria-label="Decrease ${escapeHTML(item.name)} quantity"
            >−</button>

            <span class="cart-item-quantity">${item.quantity}</span>

            <button
              type="button"
              data-action="increase-quantity"
              data-id="${escapeHTML(item.id)}"
              aria-label="Increase ${escapeHTML(item.name)} quantity"
            >+</button>
          </div>
        </div>

        <div class="cart-item-side">
          <strong>${money(item.price * item.quantity)}</strong>

          <button
            type="button"
            class="cart-item-remove"
            data-action="remove-from-cart"
            data-id="${escapeHTML(item.id)}"
            aria-label="Remove ${escapeHTML(item.name)} from cart"
          >Remove</button>
        </div>
      </article>
    `;
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  function renderCart() {
    const cartItemsElement = $("#cart-items");
    const items = getCartItems();

    if (cartItemsElement) {
      cartItemsElement.innerHTML = items.length
        ? items.map(cartItemHTML).join("")
        : "";
    }

    const emptyState = $("#cart-empty-state");
    if (emptyState) {
      emptyState.hidden = items.length > 0;
    }

    const quantity = getCartQuantity();

    setText("#cart-count", quantity);
    setText("#cart-heading-count", quantity);

    const totals = calculateTotal();

    setText("#cart-subtotal", money(totals.subtotal));
    setText("#cart-delivery", totals.delivery === 0 && totals.subtotal > 0
      ? "FREE"
      : money(totals.delivery));
    setText("#cart-tax", money(totals.tax));
    setText("#cart-discount", `−${money(totals.discount)}`);
    setText("#cart-total", money(totals.total));
    setText("#checkout-total", money(totals.total));
    setText("#checkout-review-total", money(totals.total));

    const discountRow = $("#discount-row");
    if (discountRow) {
      discountRow.hidden = totals.discount <= 0;
    }

    const deliveryProgressText = $("#delivery-progress-text");
    const progressBar = $("#cart-progress-bar");

    if (deliveryProgressText && progressBar) {
      const remaining = Math.max(
        0,
        CONFIG.freeDeliveryMinimum - totals.subtotal
      );

      if (totals.subtotal <= 0) {
        deliveryProgressText.textContent =
          `Add items worth ${money(CONFIG.freeDeliveryMinimum)} for free delivery`;
      } else if (remaining > 0) {
        deliveryProgressText.textContent =
          `Add ${money(remaining)} more for free delivery`;
      } else {
        deliveryProgressText.textContent = "Congratulations! You unlocked free delivery.";
      }

      const progress = Math.min(
        100,
        (totals.subtotal / CONFIG.freeDeliveryMinimum) * 100
      );

      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
    }

    const couponMessage = $("#coupon-message");
    if (couponMessage && activeCoupon?.code) {
      couponMessage.textContent = `Coupon ${activeCoupon.code} applied.`;
      couponMessage.classList.add("is-success");
    }

    renderCartClearButton();
  }

  function renderCartClearButton() {
    const cartDrawer = $("#cart-drawer");
    const cartItemsElement = $("#cart-items");

    if (!cartDrawer || !cartItemsElement) return;

    let clearButton = $("#clear-cart-button");

    if (!clearButton && cart.length > 0) {
      clearButton = document.createElement("button");
      clearButton.id = "clear-cart-button";
      clearButton.type = "button";
      clearButton.className = "clear-cart-button";
      clearButton.dataset.action = "clear-cart";
      clearButton.textContent = "Clear cart";

      cartItemsElement.before(clearButton);
    }

    if (clearButton) {
      clearButton.hidden = cart.length === 0;
    }
  }

  function addToCart(productId, quantity = 1) {
    const product = getProduct(productId);

    if (!product || !product.available || product.stock <= 0) {
      showToast("Sorry, this product is currently unavailable.", "error");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    const nextQuantity = (existingItem?.quantity || 0) + quantity;

    if (nextQuantity > product.stock) {
      showToast(`Only ${product.stock} unit(s) available.`, "warning");
      return;
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.push({
        id: product.id,
        quantity: Math.max(1, quantity)
      });
    }

    saveState();
    renderCart();

    showToast(`${product.name} added to your cart.`);
  }

  function changeCartQuantity(productId, change) {
    const item = cart.find((cartItem) => cartItem.id === productId);
    const product = getProduct(productId);

    if (!item || !product) return;

    const nextQuantity = item.quantity + change;

    if (nextQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (nextQuantity > product.stock) {
      showToast(`Only ${product.stock} unit(s) available.`, "warning");
      return;
    }

    item.quantity = nextQuantity;

    saveState();
    renderCart();
  }

  function removeFromCart(productId) {
    const product = getProduct(productId);

    cart = cart.filter((item) => item.id !== productId);

    saveState();
    renderCart();

    if (product) {
      showToast(`${product.name} removed from cart.`, "success");
    }
  }

  function clearCart() {
    if (!cart.length) return;

    cart = [];
    activeCoupon = null;

    saveState();
    renderCart();

    showToast("Your cart has been cleared.");
  }

  /* ==========================================================
     11. COUPONS
  ========================================================== */

  function applyCoupon() {
    const input = $("#coupon-code");
    const message = $("#coupon-message");

    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {
      showCouponMessage("Enter a coupon code first.", "error");
      return;
    }

    const coupon = COUPONS[code];

    if (!coupon) {
      showCouponMessage("Invalid coupon code.", "error");
      return;
    }

    const subtotal = getSubtotal();

    if (subtotal < coupon.minimum) {
      showCouponMessage(
        `Add items worth ${money(coupon.minimum - subtotal)} more to use this coupon.`,
        "error"
      );
      return;
    }

    activeCoupon = {
      code,
      appliedAt: new Date().toISOString()
    };

    saveState();
    renderCart();

    showCouponMessage(coupon.description, "success");
    showToast(`Coupon ${code} applied successfully.`);
  }

  function showCouponMessage(messageText, type = "success") {
    const element = $("#coupon-message");
    if (!element) return;

    element.textContent = messageText;
    element.classList.toggle("is-success", type === "success");
    element.classList.toggle("is-error", type === "error");
  }

  /* ==========================================================
     12. WISHLIST
  ========================================================== */

  function toggleWishlist(productId) {
    const product = getProduct(productId);
    if (!product) return;

    const exists = wishlist.includes(productId);

    if (exists) {
      wishlist = wishlist.filter((id) => id !== productId);
      showToast(`${product.name} removed from favourites.`);
    } else {
      wishlist.push(productId);
      showToast(`${product.name} added to favourites.`);
    }

    saveState();
    renderProducts();
    renderWishlist();
    updateWishlistCount();
  }

  function updateWishlistCount() {
    setText("#wishlist-count", wishlist.length);
  }

  function wishlistItemHTML(product) {
    return `
      <article class="wishlist-item" data-wishlist-id="${escapeHTML(product.id)}">
        <img
          class="wishlist-item-image"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
        >

        <div class="wishlist-item-details">
          <h4>${escapeHTML(product.name)}</h4>
          <p>${money(product.price)}</p>

          <div class="wishlist-item-actions">
            <button
              type="button"
              data-action="wishlist-add-to-cart"
              data-id="${escapeHTML(product.id)}"
            >Add to Cart</button>

            <button
              type="button"
              data-action="remove-from-wishlist"
              data-id="${escapeHTML(product.id)}"
            >Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderWishlist() {
    const wishlistElement = $("#wishlist-items");
    if (!wishlistElement) return;

    const items = wishlist
      .map((id) => getProduct(id))
      .filter(Boolean);

    wishlistElement.innerHTML = items.length
      ? items.map(wishlistItemHTML).join("")
      : `
        <div class="wishlist-empty">
          <div aria-hidden="true">♡</div>
          <h3>Your wishlist is empty</h3>
          <p>Save your favourite vegetarian dishes here.</p>
        </div>
      `;

    updateWishlistCount();
  }

  function removeFromWishlist(productId) {
    wishlist = wishlist.filter((id) => id !== productId);

    saveState();
    renderProducts();
    renderWishlist();

    showToast("Removed from favourites.");
  }

  /* ==========================================================
     13. DRAWERS AND MODALS
  ========================================================== */

  function showElement(element) {
    if (!element) return;

    element.hidden = false;
    element.removeAttribute("inert");
    element.setAttribute("aria-hidden", "false");

    element.classList.add("is-open", "open", "active", "show");
  }

  function hideElement(element) {
    if (!element) return;

    element.classList.remove("is-open", "open", "active", "show");
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("inert", "");

    element.hidden = true;
  }

  function openCart() {
    const drawer = $("#cart-drawer");
    const overlay = $("#cart-overlay");

    if (drawer) {
      drawer.hidden = false;
      drawer.removeAttribute("inert");
      drawer.setAttribute("aria-hidden", "false");
      drawer.classList.add("is-open", "open", "active", "show");
    }

    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("is-open", "open", "active", "show");
      overlay.setAttribute("aria-hidden", "false");
    }

    document.body.classList.add("cart-open");
    renderCart();
  }

  function closeCart() {
    hideElement($("#cart-drawer"));
    hideElement($("#cart-overlay"));
    document.body.classList.remove("cart-open");
  }

  function openWishlist() {
    const modal = $("#wishlist-modal");
    const overlay = $("#wishlist-overlay");

    showElement(modal);
    showElement(overlay);

    if (modal) {
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
    }

    document.body.classList.add("modal-open");
    renderWishlist();
  }

  function closeWishlist() {
    hideElement($("#wishlist-modal"));
    hideElement($("#wishlist-overlay"));
    document.body.classList.remove("modal-open");
  }

  function openCheckout() {
    const totals = calculateTotal();

    if (!cart.length) {
      showToast("Your cart is empty. Add something delicious first.", "warning");
      return;
    }

    if (totals.subtotal < CONFIG.minimumOrder) {
      showToast(
        `Minimum order amount is ${money(CONFIG.minimumOrder)}.`,
        "warning"
      );
      return;
    }

    closeCart();

    showElement($("#checkout-modal"));
    showElement($("#checkout-overlay"));

    const checkoutModal = $("#checkout-modal");

    if (checkoutModal) {
      checkoutModal.setAttribute("role", "dialog");
      checkoutModal.setAttribute("aria-modal", "true");
    }

    document.body.classList.add("modal-open");
    renderCart();
  }

  function closeCheckout() {
    hideElement($("#checkout-modal"));
    hideElement($("#checkout-overlay"));
    document.body.classList.remove("modal-open");
  }

  function openInvoice(order = lastOrder) {
    if (!order) {
      showToast("No invoice is available yet.", "warning");
      return;
    }

    lastOrder = order;
    writeStorage(CONFIG.storage.lastOrder, lastOrder);

    const invoiceContent = $("#invoice-content");

    if (invoiceContent) {
      invoiceContent.innerHTML = invoiceHTML(order);
    }

    showElement($("#invoice-modal"));

    document.body.classList.add("modal-open");
  }

  function closeInvoice() {
    hideElement($("#invoice-modal"));
    document.body.classList.remove("modal-open");
  }

  /* ==========================================================
     14. INVOICE GENERATION
  ========================================================== */

  function invoiceHTML(order) {
    const items = Array.isArray(order.items) ? order.items : [];

    const rows = items.map((item) => `
      <tr>
        <td>${escapeHTML(item.name)}</td>
        <td>${number(item.quantity)}</td>
        <td>${money(item.price)}</td>
        <td>${money(number(item.price) * number(item.quantity))}</td>
      </tr>
    `).join("");

    const customer = order.customer || {};
    const totals = order.totals || {};

    return `
      <div class="invoice-document">
        <header class="invoice-header">
          <div>
            <h2>CRAVE<span>CART</span></h2>
            <p>Fresh vegetarian food, delivered with love.</p>
          </div>

          <div class="invoice-meta">
            <h3>INVOICE</h3>
            <p><strong>Invoice:</strong> ${escapeHTML(order.invoiceNumber || order.id)}</p>
            <p><strong>Order ID:</strong> ${escapeHTML(order.id)}</p>
            <p><strong>Date:</strong> ${escapeHTML(formatDate(order.createdAt))}</p>
          </div>
        </header>

        <hr>

        <section class="invoice-customer">
          <h3>Bill To</h3>
          <p><strong>${escapeHTML(customer.name || "Customer")}</strong></p>
          <p>${escapeHTML(customer.address || "")}</p>
          <p>${escapeHTML(customer.city || "")} ${escapeHTML(customer.pincode || "")}</p>
          <p>Phone: ${escapeHTML(customer.phone || "")}</p>
          <p>Email: ${escapeHTML(customer.email || "")}</p>
        </section>

        <div class="invoice-table-wrap">
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="invoice-totals">
          <p><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></p>
          <p><span>Discount</span><strong>−${money(totals.discount)}</strong></p>
          <p><span>Delivery</span><strong>${money(totals.delivery)}</strong></p>
          <p><span>Tax</span><strong>${money(totals.tax)}</strong></p>
          <p class="invoice-grand-total"><span>Total</span><strong>${money(totals.total)}</strong></p>
        </div>

        <div class="invoice-payment">
          <p><strong>Payment method:</strong> ${escapeHTML(order.paymentMethod || "Cash on Delivery")}</p>
          <p><strong>Order status:</strong> ${escapeHTML(order.status || "Pending")}</p>
        </div>

        <footer class="invoice-footer">
          <h3>Thank you for choosing CraveCart!</h3>
          <p>This invoice was generated by the CraveCart demo website.</p>
          <p>Vegetarian food only • Freshness in every bite</p>
        </footer>
      </div>
    `;
  }

  function printInvoice() {
    if (!lastOrder) {
      showToast("Create an order first.", "warning");
      return;
    }

    const invoiceContent = $("#invoice-content");

    if (!invoiceContent) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      showToast("Allow pop-ups to print the invoice.", "warning");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>CraveCart Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #222;
            max-width: 900px;
            margin: 25px auto;
            padding: 20px;
          }
          h2 { letter-spacing: 2px; }
          h2 span { color: #f36a21; }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            gap: 25px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
          }
          .invoice-table th, .invoice-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          .invoice-totals {
            max-width: 350px;
            margin: 25px 0 25px auto;
          }
          .invoice-totals p {
            display: flex;
            justify-content: space-between;
          }
          .invoice-grand-total {
            border-top: 2px solid #222;
            padding-top: 10px;
            font-size: 20px;
          }
          .invoice-footer {
            text-align: center;
            margin-top: 50px;
          }
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        ${invoiceContent.innerHTML}
        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `);

    printWindow.document.close();
  }

  function downloadInvoice() {
    if (!lastOrder) {
      showToast("Create an order before downloading an invoice.", "warning");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CraveCart Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #222; }
          h2 span { color: #f36a21; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
          .invoice-totals { max-width: 350px; margin-left: auto; }
          .invoice-totals p { display: flex; justify-content: space-between; }
          .invoice-grand-total { border-top: 2px solid #222; padding-top: 10px; }
        </style>
      </head>
      <body>
        ${invoiceHTML(lastOrder)}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `CraveCart-Invoice-${lastOrder.invoiceNumber || lastOrder.id}.html`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    showToast("Invoice downloaded. Open it in your browser to print or save as PDF.");
  }

  /* ==========================================================
     15. CHECKOUT AND ORDER CREATION
  ========================================================== */

  function getCheckoutCustomer() {
    return {
      name: $("#customer-name")?.value.trim() || "",
      phone: $("#customer-phone")?.value.trim() || "",
      email: $("#customer-email")?.value.trim() || "",
      address: $("#customer-address")?.value.trim() || "",
      city: $("#customer-city")?.value.trim() || "",
      pincode: $("#customer-pincode")?.value.trim() || ""
    };
  }

  function validateCustomer(customer) {
    if (customer.name.length < 2) {
      return "Please enter your full name.";
    }

    if (!/^[0-9+\-\s()]{10,16}$/.test(customer.phone)) {
      return "Please enter a valid phone number.";
    }

    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return "Please enter a valid email address.";
    }

    if (customer.address.length < 5) {
      return "Please enter your complete delivery address.";
    }

    if (!customer.city) {
      return "Please enter your city.";
    }

    if (!/^[0-9]{6}$/.test(customer.pincode)) {
      return "Please enter a valid 6-digit PIN code.";
    }

    return "";
  }

  function handleCheckout(event) {
    event.preventDefault();

    const form = $("#checkout-form");

    if (form && !form.reportValidity()) {
      return;
    }

    const customer = getCheckoutCustomer();
    const validationError = validateCustomer(customer);

    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    if (!cart.length) {
      showToast("Your cart is empty.", "warning");
      closeCheckout();
      return;
    }

    // Re-check availability and stock before creating an order.
    const items = getCartItems();

    for (const item of items) {
      const product = getProduct(item.id);

      if (!product || !product.available || product.stock < item.quantity) {
        showToast(`${item.name} is no longer available in the requested quantity.`, "error");
        return;
      }
    }

    const totals = calculateTotal();
    const paymentMethod = $('input[name="paymentMethod"]:checked')?.value || "cod";

    const orderId = createId("CCORDER");
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.random()
      .toString(10)
      .slice(2, 8)}`;

    const order = {
      id: orderId,
      invoiceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending",
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod,
      customer,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      totals: {
        subtotal: Number(totals.subtotal.toFixed(2)),
        discount: Number(totals.discount.toFixed(2)),
        delivery: Number(totals.delivery.toFixed(2)),
        tax: Number(totals.tax.toFixed(2)),
        total: Number(totals.total.toFixed(2))
      },
      coupon: activeCoupon?.code || null
    };

    // Reduce demo inventory locally.
    items.forEach((item) => {
      const product = getProduct(item.id);

      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        if (product.stock === 0) {
          product.available = false;
        }
      }
    });

    orders.unshift(order);
    lastOrder = order;
    cart = [];
    activeCoupon = null;

    writeStorage(CONFIG.storage.products, products);
    saveState();

    closeCheckout();
    renderProducts();
    renderCategoryCounts();
    renderCart();

    showToast(`Order placed successfully! Order ID: ${orderId}`);

    openInvoice(order);

    // Optional integration hook for a future backend.
    document.dispatchEvent(new CustomEvent("cravecart:order-created", {
      detail: { order }
    }));
  }

  /* ==========================================================
     16. SEARCH AND SORT
  ========================================================== */

  function setupSearch() {
    const searchInput = $("#product-search");
    const clearButton = $("#clear-search");
    const searchToggle = $("#search-toggle");
    const searchPanel = $("#search-panel");

    searchInput?.addEventListener("input", () => {
      searchTerm = searchInput.value.trim();
      renderProducts();

      if (clearButton) {
        clearButton.hidden = searchInput.value.length === 0;
      }
    });

    clearButton?.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        searchTerm = "";
        renderProducts();
        searchInput.focus();
      }

      clearButton.hidden = true;
    });

    searchToggle?.addEventListener("click", () => {
      if (!searchPanel) return;

      const willOpen = searchPanel.hidden;

      searchPanel.hidden = !willOpen;

      if (willOpen) {
        searchInput?.focus();
      }
    });

    const sortSelect = $("#sort-products");

    sortSelect?.addEventListener("change", () => {
      sortMode = sortSelect.value;
      renderProducts();
    });
  }

  /* ==========================================================
     17. MOBILE NAVIGATION
  ========================================================== */

  function setupMobileMenu() {
    const toggle = $("#mobile-menu-toggle");
    const mobileNavigation = $("#mobile-navigation");

    if (!toggle || !mobileNavigation) return;

    toggle.addEventListener("click", () => {
      const isOpen = !mobileNavigation.hidden;

      mobileNavigation.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.classList.toggle("is-active", !isOpen);
    });

    $$("a", mobileNavigation).forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavigation.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.classList.remove("is-active");
      });
    });
  }

  /* ==========================================================
     18. NEWSLETTER DEMO
  ========================================================== */

  function setupNewsletter() {
    const form = $("#newsletter-form");
    const emailInput = $("#newsletter-email");
    const message = $("#newsletter-message");

    form?.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput?.value.trim() || "";

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (message) {
          message.textContent = "Please enter a valid email address.";
        }

        showToast("Please enter a valid email address.", "error");
        return;
      }

      const emails = readStorage(CONFIG.storage.newsletter, []);

      if (!emails.includes(email)) {
        emails.push(email);
        writeStorage(CONFIG.storage.newsletter, emails);
      }

      if (message) {
        message.textContent = "Thanks for subscribing!";
      }

      form.reset();
      showToast("Thanks for subscribing to CraveCart!");
    });
  }

  /* ==========================================================
     19. BACK TO TOP AND HEADER EFFECTS
  ========================================================== */

  function setupScrollEffects() {
    const backToTop = $("#back-to-top");
    const header = $("#site-header");

    const updateScrollState = () => {
      const shouldShow = window.scrollY > 400;

      if (backToTop) {
        backToTop.hidden = !shouldShow;
        backToTop.classList.toggle("is-visible", shouldShow);
      }

      if (header) {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
      }
    };

    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    backToTop?.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ==========================================================
     20. CLICK EVENT DELEGATION
  ========================================================== */

  function setupGlobalClickHandlers() {
    document.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-action]");

      if (actionElement) {
        const action = actionElement.dataset.action;
        const id = actionElement.dataset.id;

        switch (action) {
          case "add-to-cart":
            addToCart(id);
            break;

          case "toggle-wishlist":
            toggleWishlist(id);
            break;

          case "open-cart":
            openCart();
            break;

          case "open-wishlist":
            openWishlist();
            break;

          case "close-cart":
            closeCart();
            break;

          case "close-wishlist":
            closeWishlist();
            break;

          case "close-checkout":
            closeCheckout();
            break;

          case "close-invoice":
            closeInvoice();
            break;

          case "open-checkout":
            openCheckout();
            break;

          case "increase-quantity":
            changeCartQuantity(id, 1);
            break;

          case "decrease-quantity":
            changeCartQuantity(id, -1);
            break;

          case "remove-from-cart":
            removeFromCart(id);
            break;

          case "clear-cart":
            clearCart();
            break;

          case "remove-from-wishlist":
            removeFromWishlist(id);
            break;

          case "wishlist-add-to-cart":
            addToCart(id);
            break;

          case "apply-coupon":
            applyCoupon();
            break;

          case "print-invoice":
            printInvoice();
            break;

          case "download-invoice":
            downloadInvoice();
            break;

          default:
            break;
        }
      }

      const categoryCard = event.target.closest(".category-card[data-category]");

      if (categoryCard) {
        setActiveCategory(categoryCard.dataset.category);
      }

      const resetButton = event.target.closest("#reset-filters, #show-all-products");

      if (resetButton) {
        activeCategory = "all";
        searchTerm = "";

        const searchInput = $("#product-search");
        if (searchInput) searchInput.value = "";

        const clearButton = $("#clear-search");
        if (clearButton) clearButton.hidden = true;

        const sortSelect = $("#sort-products");
        if (sortSelect) {
          sortSelect.value = "featured";
          sortMode = "featured";
        }

        setActiveCategory("all");
      }

      // Close drawers/modals when their overlay is clicked.
      if (event.target.matches("#cart-overlay")) {
        closeCart();
      }

      if (event.target.matches("#wishlist-overlay")) {
        closeWishlist();
      }

      if (event.target.matches("#checkout-overlay")) {
        closeCheckout();
      }

      // Close elements through common close-button patterns.
      if (
        event.target.closest("[data-close-cart]") ||
        event.target.closest("[data-close-drawer]")
      ) {
        closeCart();
      }

      if (event.target.closest("[data-close-wishlist]")) {
        closeWishlist();
      }

      if (event.target.closest("[data-close-checkout]")) {
        closeCheckout();
      }

      if (event.target.closest("[data-close-invoice]")) {
        closeInvoice();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
        closeWishlist();
        closeCheckout();
        closeInvoice();
      }
    });

    $("#apply-coupon")?.addEventListener("click", applyCoupon);
    $("#print-invoice")?.addEventListener("click", printInvoice);
    $("#download-invoice")?.addEventListener("click", downloadInvoice);

    $("#checkout-form")?.addEventListener("submit", handleCheckout);
  }

  /* ==========================================================
     21. PRODUCT STORAGE REFRESH
     Keeps this frontend catalogue in sync with products saved
     locally by a compatible demo admin panel.
  ========================================================== */

  window.addEventListener("storage", (event) => {
    if (event.key === CONFIG.storage.products) {
      initialiseProducts();
      renderProducts();
      renderCategoryCounts();
      renderCart();
    }

    if (event.key === CONFIG.storage.orders) {
      orders = readStorage(CONFIG.storage.orders, []);
    }
  });

  /* ==========================================================
     22. INITIALISE WEBSITE
  ========================================================== */

  function initialiseWebsite() {
    initialiseProducts();
    loadState();

    // Remove cart entries that no longer exist.
    cart = cart.filter((item) => Boolean(getProduct(item.id)));

    // Remove wishlist entries that no longer exist.
    wishlist = wishlist.filter((id) => Boolean(getProduct(id)));

    const currentYear = $("#current-year");
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    const adminYear = $("#admin-year");
    if (adminYear) {
      adminYear.textContent = new Date().getFullYear();
    }

    setupSearch();
    setupMobileMenu();
    setupNewsletter();
    setupScrollEffects();
    setupGlobalClickHandlers();

    renderProducts();
    renderCategoryCounts();
    renderCart();
    renderWishlist();

    // Restore coupon field when the page is refreshed.
    if (activeCoupon?.code) {
      const couponInput = $("#coupon-code");
      if (couponInput) couponInput.value = activeCoupon.code;
    }

    const status = $("#app-status");
    if (status) {
      status.textContent = "CraveCart is ready.";
    }

    console.info(
      `CraveCart ready: ${products.length} vegetarian products loaded.`
    );

    document.dispatchEvent(new CustomEvent("cravecart:ready", {
      detail: {
        productCount: products.length,
        cartCount: cart.length,
        wishlistCount: wishlist.length
      }
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseWebsite, {
      once: true
    });
  } else {
    initialiseWebsite();
  }

  /* ==========================================================
     23. OPTIONAL PUBLIC API
     Useful for debugging in the browser console.
  ========================================================== */

  window.CraveCart = {
    getProducts: () => [...products],
    getCart: getCartItems,
    getWishlist: () => [...wishlist],
    getOrders: () => [...orders],
    addToCart,
    removeFromCart,
    clearCart,
    toggleWishlist,
    openCart,
    closeCart,
    openWishlist,
    closeWishlist,
    openCheckout,
    renderProducts,
    renderCart,
    renderWishlist,
    money
  };

})();
