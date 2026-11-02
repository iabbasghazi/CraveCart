```javascript
/* ============================================================
   CRAVECART — COMPLETE FRONTEND JAVASCRIPT
   Version: 1.0.0
   Features:
   - Vegetarian product catalogue
   - Search, categories and sorting
   - Shopping cart and quantity management
   - Wishlist
   - Coupon discounts
   - Checkout and demo order creation
   - Invoice, print and download
   - LocalStorage persistence
   - Mobile navigation and notifications

   IMPORTANT:
   This is a FRONTEND DEMO.
   Real authentication, shared database, server-side coupon
   validation and online payments require a backend.
============================================================ */

"use strict";

(() => {
    /* ========================================================
       1. CONFIGURATION
    ======================================================== */

    const CONFIG = {
        currency: "INR",
        locale: "en-IN",

        storage: {
            products: "cravecart_products",
            cart: "cravecart_cart",
            wishlist: "cravecart_wishlist",
            orders: "cravecart_orders",
            coupon: "cravecart_coupon",
            lastOrder: "cravecart_last_order",
            customer: "cravecart_customer"
        },

        deliveryFee: 39,
        freeDeliveryMinimum: 499,
        minimumOrder: 99,
        taxRate: 0.05,

        maximumQuantity: 99,
        maximumVisibleProducts: 220,

        /*
         * Replace these demo coupons with a backend API
         * before using the website for real orders.
         */
        coupons: {
            CRAVE10: {
                type: "percent",
                value: 10,
                maxDiscount: 100,
                minimum: 199,
                description: "10% off, up to ₹100"
            },

            WELCOME50: {
                type: "fixed",
                value: 50,
                minimum: 299,
                description: "₹50 off on orders of ₹299 or more"
            },

            FREESHIP: {
                type: "shipping",
                value: 0,
                minimum: 0,
                description: "Free delivery"
            }
        }
    };


    /* ========================================================
       2. HELPERS
    ======================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    function money(value) {
        const amount = Number(value) || 0;

        return new Intl.NumberFormat(CONFIG.locale, {
            style: "currency",
            currency: CONFIG.currency,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(amount);
    }


    function number(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }


    function safeText(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function createId(prefix = "cc") {
        return (
            prefix +
            "-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2, 8)
        );
    }


    function readStorage(key, fallback) {
        try {
            const stored = localStorage.getItem(key);

            if (stored === null) {
                return fallback;
            }

            return JSON.parse(stored);
        } catch (error) {
            console.warn("CraveCart: Could not read storage:", key);
            return fallback;
        }
    }


    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("CraveCart: Could not save storage:", key);
            showToast(
                "Storage unavailable",
                "Your browser could not save this change.",
                "error"
            );
            return false;
        }
    }


    function setText(selector, value) {
        const element = $(selector);

        if (element) {
            element.textContent = value;
        }
    }


    function setHidden(selector, hidden) {
        const element = $(selector);

        if (element) {
            element.hidden = Boolean(hidden);
        }
    }


    function scrollToSection(selector) {
        const element = $(selector);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    function normaliseCategory(category) {
        return String(category || "")
            .trim()
            .toLowerCase()
            .replaceAll("&", "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }


    function getProductCategory(product) {
        return normaliseCategory(
            product.categorySlug ||
            product.category ||
            "snacks"
        );
    }


    function getImageUrl(url) {
        const fallback =
            "https://images.unsplash.com/photo-1547592180-85f173990554" +
            "?auto=format&fit=crop&w=800&q=80";

        if (typeof url !== "string" || !url.trim()) {
            return fallback;
        }

        try {
            const parsed = new URL(url, window.location.href);

            if (
                parsed.protocol !== "https:" &&
                parsed.protocol !== "http:"
            ) {
                return fallback;
            }

            return parsed.href;
        } catch {
            return fallback;
        }
    }


    function imageFallback(image) {
        image.onerror = null;

        image.src =
            "https://images.unsplash.com/photo-1547592180-85f173990554" +
            "?auto=format&fit=crop&w=800&q=80";
    }


    function updateAppStatus(message) {
        const status = $("#app-status");

        if (status) {
            status.textContent = message;
        }
    }


    /* ========================================================
       3. VEGETARIAN STARTER CATALOGUE

       These are sample products for the frontend demo.
       Prices and availability are illustrative.

       The products use direct image URLs rather than
       Google Images search-result URLs.

       Only vegetarian products are included.
    ======================================================== */

    const STARTER_PRODUCTS = [

        // PIZZA

        {
            id: "veg-pizza-001",
            name: "Classic Margherita Pizza",
            category: "pizza",
            price: 179,
            originalPrice: 229,
            description: "Classic tomato sauce, mozzarella and basil.",
            image:
                "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
            badge: "Bestseller",
            rating: 4.8,
            stock: 30,
            featured: true
        },

        {
            id: "veg-pizza-002",
            name: "Farmhouse Veg Pizza",
            category: "pizza",
            price: 249,
            originalPrice: 299,
            description: "Bell peppers, onions, mushrooms and cheese.",
            image:
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            badge: "Popular",
            rating: 4.7,
            stock: 25,
            featured: true
        },

        {
            id: "veg-pizza-003",
            name: "Paneer Tikka Pizza",
            category: "pizza",
            price: 269,
            originalPrice: 319,
            description: "Tandoori paneer, peppers and creamy cheese.",
            image:
                "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
            badge: "Chef's Pick",
            rating: 4.9,
            stock: 20
        },

        {
            id: "veg-pizza-004",
            name: "Golden Corn Pizza",
            category: "pizza",
            price: 199,
            originalPrice: 249,
            description: "Sweet corn, mozzarella and Italian herbs.",
            image:
                "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
            badge: "Value Pick",
            rating: 4.5,
            stock: 24
        },


        // BURGERS

        {
            id: "veg-burger-001",
            name: "Crispy Veg Burger",
            category: "burger",
            price: 99,
            originalPrice: 129,
            description: "Crunchy vegetable patty, lettuce and house sauce.",
            image:
                "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80",
            badge: "Bestseller",
            rating: 4.6,
            stock: 40,
            featured: true
        },

        {
            id: "veg-burger-002",
            name: "Paneer Crunch Burger",
            category: "burger",
            price: 149,
            originalPrice: 179,
            description: "Crispy paneer, fresh vegetables and mint mayo.",
            image:
                "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=800&q=80",
            badge: "Popular",
            rating: 4.8,
            stock: 22
        },

        {
            id: "veg-burger-003",
            name: "Double Cheese Veg Burger",
            category: "burger",
            price: 169,
            originalPrice: 199,
            description: "Vegetable patty with double cheese.",
            image:
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            badge: "Cheesy",
            rating: 4.7,
            stock: 18
        },

        {
            id: "veg-burger-004",
            name: "Aloo Tikki Burger",
            category: "burger",
            price: 89,
            originalPrice: 109,
            description: "Spiced potato patty with tangy Indian chutney.",
            image:
                "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
            badge: "Budget Pick",
            rating: 4.5,
            stock: 35
        },


        // INDIAN

        {
            id: "veg-indian-001",
            name: "Paneer Butter Masala",
            category: "indian",
            price: 229,
            originalPrice: 269,
            description: "Paneer cubes in a rich tomato-butter gravy.",
            image:
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
            badge: "Bestseller",
            rating: 4.9,
            stock: 20,
            featured: true
        },

        {
            id: "veg-indian-002",
            name: "Veg Dum Biryani",
            category: "indian",
            price: 189,
            originalPrice: 229,
            description: "Fragrant basmati rice with vegetables and spices.",
            image:
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
            badge: "Popular",
            rating: 4.8,
            stock: 30,
            featured: true
        },

        {
            id: "veg-indian-003",
            name: "Chole Bhature",
            category: "indian",
            price: 149,
            originalPrice: 179,
            description: "Spiced chickpeas served with fluffy bhature.",
            image:
                "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
            badge: "North Indian",
            rating: 4.7,
            stock: 25
        },

        {
            id: "veg-indian-004",
            name: "Dal Makhani",
            category: "indian",
            price: 179,
            originalPrice: 219,
            description: "Slow-cooked black lentils in a creamy gravy.",
            image:
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
            badge: "Comfort Food",
            rating: 4.7,
            stock: 22
        },

        {
            id: "veg-indian-005",
            name: "Masala Dosa",
            category: "indian",
            price: 119,
            originalPrice: 149,
            description: "Crispy dosa with potato masala and chutneys.",
            image:
                "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
            badge: "South Indian",
            rating: 4.6,
            stock: 25
        },

        {
            id: "veg-indian-006",
            name: "Veg Hakka Noodles",
            category: "indian",
            price: 159,
            originalPrice: 189,
            description: "Stir-fried noodles with crunchy vegetables.",
            image:
                "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
            badge: "Quick Bite",
            rating: 4.5,
            stock: 26
        },


        // CHINESE

        {
            id: "veg-chinese-001",
            name: "Veg Manchurian",
            category: "chinese",
            price: 159,
            originalPrice: 189,
            description: "Vegetable dumplings in a savoury Indo-Chinese sauce.",
            image:
                "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
            badge: "Popular",
            rating: 4.6,
            stock: 20
        },

        {
            id: "veg-chinese-002",
            name: "Veg Fried Rice",
            category: "chinese",
            price: 139,
            originalPrice: 169,
            description: "Fried rice with fresh vegetables and mild seasoning.",
            image:
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
            badge: "Classic",
            rating: 4.5,
            stock: 28
        },

        {
            id: "veg-chinese-003",
            name: "Chilli Paneer",
            category: "chinese",
            price: 199,
            originalPrice: 239,
            description: "Paneer tossed with peppers and chilli sauce.",
            image:
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
            badge: "Spicy",
            rating: 4.7,
            stock: 18
        },

        {
            id: "veg-chinese-004",
            name: "Veg Spring Rolls",
            category: "chinese",
            price: 119,
            originalPrice: 149,
            description: "Crispy rolls filled with seasoned vegetables.",
            image:
                "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
            badge: "Crispy",
            rating: 4.5,
            stock: 24
        },


        // SNACKS

        {
            id: "veg-snack-001",
            name: "Golden French Fries",
            category: "snacks",
            price: 89,
            originalPrice: 109,
            description: "Golden potato fries with a light seasoning.",
            image:
                "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
            badge: "Bestseller",
            rating: 4.6,
            stock: 40
        },

        {
            id: "veg-snack-002",
            name: "Crispy Onion Rings",
            category: "snacks",
            price: 99,
            originalPrice: 129,
            description: "Golden onion rings served with a dip.",
            image:
                "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80",
            badge: "Crunchy",
            rating: 4.4,
            stock: 25
        },

        {
            id: "veg-snack-003",
            name: "Paneer Tikka",
            category: "snacks",
            price: 189,
            originalPrice: 229,
            description: "Marinated paneer grilled with peppers and spices.",
            image:
                "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
            badge: "Chef's Pick",
            rating: 4.8,
            stock: 20
        },

        {
            id: "veg-snack-004",
            name: "Veg Cheese Sandwich",
            category: "snacks",
            price: 109,
            originalPrice: 139,
            description: "Toasted bread with vegetables and melted cheese.",
            image:
                "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
            badge: "Quick Bite",
            rating: 4.5,
            stock: 26
        },

        {
            id: "veg-snack-005",
            name: "Crispy Samosa",
            category: "snacks",
            price: 39,
            originalPrice: 49,
            description: "Traditional potato and pea-filled samosa.",
            image:
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
            badge: "Indian Classic",
            rating: 4.5,
            stock: 50
        },


        // DESSERTS

        {
            id: "veg-dessert-001",
            name: "Chocolate Brownie",
            category: "dessert",
            price: 99,
            originalPrice: 129,
            description: "Rich chocolate brownie with a soft centre.",
            image:
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
            badge: "Chocolate",
            rating: 4.8,
            stock: 25
        },

        {
            id: "veg-dessert-002",
            name: "Classic Cheesecake",
            category: "dessert",
            price: 149,
            originalPrice: 179,
            description: "Creamy cheesecake with a biscuit base.",
            image:
                "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
            badge: "Premium",
            rating: 4.7,
            stock: 15
        },

        {
            id: "veg-dessert-003",
            name: "Chocolate Ice Cream",
            category: "dessert",
            price: 79,
            originalPrice: 99,
            description: "Smooth chocolate-flavoured frozen dessert.",
            image:
                "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
            badge: "Sweet Treat",
            rating: 4.6,
            stock: 30
        },

        {
            id: "veg-dessert-004",
            name: "Gulab Jamun",
            category: "dessert",
            price: 69,
            originalPrice: 89,
            description: "Soft milk-solid dumplings in sweet syrup.",
            image:
                "https://images.unsplash.com/photo-1666190092159-5f8f5f4b4c0c?auto=format&fit=crop&w=800&q=80",
            badge: "Indian Sweet",
            rating: 4.6,
            stock: 25
        },


        // DRINKS

        {
            id: "veg-drink-001",
            name: "Fresh Lemon Soda",
            category: "drinks",
            price: 59,
            originalPrice: 79,
            description: "Refreshing lemon soda served chilled.",
            image:
                "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=800&q=80",
            badge: "Refreshing",
            rating: 4.5,
            stock: 40
        },

        {
            id: "veg-drink-002",
            name: "Mango Smoothie",
            category: "drinks",
            price: 119,
            originalPrice: 149,
            description: "Creamy mango smoothie with a fruity flavour.",
            image:
                "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80",
            badge: "Fruit Favourite",
            rating: 4.7,
            stock: 20
        },

        {
            id: "veg-drink-003",
            name: "Cold Coffee",
            category: "drinks",
            price: 99,
            originalPrice: 129,
            description: "Chilled coffee blended until smooth and creamy.",
            image:
                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
            badge: "Coffee",
            rating: 4.6,
            stock: 28
        },

        {
            id: "veg-drink-004",
            name: "Strawberry Milkshake",
            category: "drinks",
            price: 109,
            originalPrice: 139,
            description: "Creamy strawberry-flavoured milkshake.",
            image:
                "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
            badge: "Sweet Sip",
            rating: 4.5,
            stock: 20
        }
    ];


    /* ========================================================
       4. APP STATE
    ======================================================== */

    let products = [];
    let cart = [];
    let wishlist = [];
    let orders = [];

    let activeCategory = "all";
    let searchTerm = "";
    let sortMode = "featured";
    let appliedCoupon = null;
    let lastOrder = null;

    let invoiceOrder = null;
    let toastCounter = 0;


    /* ========================================================
       5. PRODUCT NORMALISATION AND STORAGE
    ======================================================== */

    function normaliseProduct(product, index = 0) {
        const safeProduct = product && typeof product === "object"
            ? product
            : {};

        const price = Math.max(0, number(safeProduct.price));

        return {
            ...safeProduct,

            id: String(
                safeProduct.id ||
                safeProduct.productId ||
                `product-${index + 1}`
            ),

            name: String(safeProduct.name || "Vegetarian Dish"),

            category: getProductCategory(safeProduct),

            price,

            originalPrice: Math.max(
                price,
                number(
                    safeProduct.originalPrice ??
                    safeProduct.mrp ??
                    price
                )
            ),

            description: String(
                safeProduct.description ||
                "A delicious vegetarian favourite."
            ),

            image: getImageUrl(
                safeProduct.image ||
                safeProduct.imageUrl ||
                safeProduct.photo
            ),

            badge: String(safeProduct.badge || ""),

            rating: Math.min(
                5,
                Math.max(0, number(safeProduct.rating || 4.5))
            ),

            stock: Math.max(
                0,
                Math.floor(number(safeProduct.stock ?? 50))
            ),

            featured: Boolean(safeProduct.featured),

            available: safeProduct.available !== false &&
                       safeProduct.isAvailable !== false
        };
    }


    function loadProducts() {
        const saved = readStorage(CONFIG.storage.products, null);

        if (Array.isArray(saved) && saved.length > 0) {
            products = saved
                .slice(0, CONFIG.maximumVisibleProducts)
                .map(normaliseProduct);
        } else {
            products = STARTER_PRODUCTS.map(normaliseProduct);
            writeStorage(CONFIG.storage.products, products);
        }

        /*
         * An existing admin-created product catalogue may use
         * a different schema. normaliseProduct handles common
         * field names but does not replace the backend.
         */
    }


    function saveProducts() {
        writeStorage(CONFIG.storage.products, products);
    }


    function loadCart() {
        const saved = readStorage(CONFIG.storage.cart, []);

        if (!Array.isArray(saved)) {
            cart = [];
            return;
        }

        cart = saved
            .map(item => ({
                id: String(item.id || item.productId || ""),
                quantity: Math.max(
                    1,
                    Math.min(
                        CONFIG.maximumQuantity,
                        Math.floor(number(item.quantity || 1))
                    )
                )
            }))
            .filter(item =>
                products.some(product => product.id === item.id)
            );

        saveCart();
    }


    function saveCart() {
        writeStorage(CONFIG.storage.cart, cart);
    }


    function loadWishlist() {
        const saved = readStorage(CONFIG.storage.wishlist, []);

        wishlist = Array.isArray(saved)
            ? [...new Set(saved.map(String))]
                .filter(id => products.some(product => product.id === id))
            : [];

        saveWishlist();
    }


    function saveWishlist() {
        writeStorage(CONFIG.storage.wishlist, wishlist);
    }


    function loadOrders() {
        const saved = readStorage(CONFIG.storage.orders, []);
        orders = Array.isArray(saved) ? saved : [];
    }


    function saveOrders() {
        writeStorage(CONFIG.storage.orders, orders);
    }


    function findProduct(productId) {
        return products.find(product => product.id === String(productId));
    }


    function getCartQuantity(productId) {
        const item = cart.find(entry => entry.id === String(productId));
        return item ? item.quantity : 0;
    }


    function getCartProducts() {
        return cart
            .map(item => {
                const product = findProduct(item.id);

                if (!product) {
                    return null;
                }

                return {
                    ...product,
                    quantity: item.quantity,
                    lineTotal: product.price * item.quantity
                };
            })
            .filter(Boolean);
    }


    function getCartItemCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }


    function getSubtotal() {
        return getCartProducts().reduce(
            (total, item) => total + item.lineTotal,
            0
        );
    }


    function getCouponDiscount(subtotal = getSubtotal()) {
        if (!appliedCoupon) {
            return 0;
        }

        const coupon = CONFIG.coupons[appliedCoupon];

        if (!coupon || subtotal < coupon.minimum) {
            return 0;
        }

        if (coupon.type === "percent") {
            const discount = subtotal * (coupon.value / 100);

            return Math.min(
                discount,
                number(coupon.maxDiscount || discount)
            );
        }

        if (coupon.type === "fixed") {
            return Math.min(coupon.value, subtotal);
        }

        return 0;
    }


    function getDeliveryFee(subtotal = getSubtotal()) {
        if (subtotal <= 0) {
            return 0;
        }

        if (subtotal >= CONFIG.freeDeliveryMinimum) {
            return 0;
        }

        if (
            appliedCoupon &&
            CONFIG.coupons[appliedCoupon]?.type === "shipping"
        ) {
            return 0;
        }

        return CONFIG.deliveryFee;
    }


    function getTax(subtotal = getSubtotal()) {
        return Math.round(subtotal * CONFIG.taxRate * 100) / 100;
    }


    function getTotal() {
        const subtotal = getSubtotal();
        const delivery = getDeliveryFee(subtotal);
        const tax = getTax(subtotal);
        const discount = getCouponDiscount(subtotal);

        return Math.max(
            0,
            Math.round((subtotal + delivery + tax - discount) * 100) / 100
        );
    }


    function persistCoupon() {
        writeStorage(CONFIG.storage.coupon, appliedCoupon);
    }


    function loadCoupon() {
        const saved = readStorage(CONFIG.storage.coupon, null);

        if (
            typeof saved === "string" &&
            Object.prototype.hasOwnProperty.call(CONFIG.coupons, saved)
        ) {
            appliedCoupon = saved;
        } else {
            appliedCoupon = null;
        }
    }


    /* ========================================================
       6. TOAST NOTIFICATIONS
    ======================================================== */

    function showToast(title, message = "", type = "success") {
        const container = $("#toast-container");

        if (!container) {
            console.log(`[CraveCart] ${title}: ${message}`);
            return;
        }

        toastCounter += 1;

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.dataset.toastId = String(toastCounter);
        toast.setAttribute("role", "status");

        const iconMap = {
            success: "fa-circle-check",
            error: "fa-circle-exclamation",
            warning: "fa-triangle-exclamation",
            info: "fa-circle-info"
        };

        toast.innerHTML = `
            <span class="toast-icon">
                <i class="fa-solid ${iconMap[type] || iconMap.info}"></i>
            </span>

            <span class="toast-content">
                <strong>${safeText(title)}</strong>
                <small>${safeText(message)}</small>
            </span>

            <button
                type="button"
                class="toast-close"
                aria-label="Dismiss notification"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("show", "is-visible", "active");
        });

        const removeToast = () => {
            toast.classList.remove("show", "is-visible", "active");

            window.setTimeout(() => {
                toast.remove();
            }, 250);
        };

        $(".toast-close", toast)?.addEventListener("click", removeToast);

        window.setTimeout(removeToast, 4000);
    }


    /* ========================================================
       7. PRODUCT CATALOGUE RENDERING
    ======================================================== */

    function getFilteredProducts() {
        let result = products.filter(product => product.available);

        if (activeCategory !== "all") {
            result = result.filter(
                product => product.category === activeCategory
            );
        }

        if (searchTerm) {
            const query = searchTerm.toLowerCase();

            result = result.filter(product => {
                const searchable = [
                    product.name,
                    product.description,
                    product.category,
                    product.badge
                ]
                    .join(" ")
                    .toLowerCase();

                return searchable.includes(query);
            });
        }

        switch (sortMode) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;

            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;

            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;

            case "popular":
                result.sort((a, b) => b.rating - a.rating);
                break;

            case "featured":
            default:
                result.sort((a, b) => {
                    if (a.featured !== b.featured) {
                        return Number(b.featured) - Number(a.featured);
                    }

                    return b.rating - a.rating;
                });
        }

        return result;
    }


    function renderProductCard(product) {
        const isSaved = wishlist.includes(product.id);
        const quantity = getCartQuantity(product.id);
        const hasDiscount = product.originalPrice > product.price;
        const discountPercent = hasDiscount
            ? Math.round(
                ((product.originalPrice - product.price) /
                    product.originalPrice) * 100
            )
            : 0;

        const isOutOfStock = product.stock <= 0;

        return `
            <article
                class="product-card"
                data-product-id="${safeText(product.id)}"
            >
                <div class="product-image-wrap">

                    <img
                        class="product-image"
                        src="${safeText(product.image)}"
                        alt="${safeText(product.name)}"
                        loading="lazy"
                        decoding="async"
                        onerror="imageFallback(this)"
                    >

                    <span class="product-veg-indicator" title="Vegetarian">
                        <span></span>
                    </span>

                    ${
                        product.badge
                            ? `
                                <span class="product-badge">
                                    ${safeText(product.badge)}
                                </span>
                            `
                            : ""
                    }

                    ${
                        discountPercent > 0
                            ? `
                                <span class="product-discount">
                                    ${discountPercent}% OFF
                                </span>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="product-wishlist-button ${isSaved ? "is-favourite active" : ""}"
                        data-action="toggle-wishlist"
                        data-id="${safeText(product.id)}"
                        aria-label="${isSaved ? "Remove from" : "Add to"} wishlist"
                        aria-pressed="${isSaved}"
                    >
                        <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>

                </div>

                <div class="product-card-body">

                    <div class="product-card-meta">
                        <span class="product-category">
                            ${safeText(product.category.replaceAll("-", " "))}
                        </span>

                        <span class="product-rating">
                            <i class="fa-solid fa-star"></i>
                            ${product.rating.toFixed(1)}
                        </span>
                    </div>

                    <h3 class="product-title">
                        ${safeText(product.name)}
                    </h3>

                    <p class="product-description">
                        ${safeText(product.description)}
                    </p>

                    <div class="product-card-bottom">

                        <div class="product-price-wrap">
                            <strong class="product-price">
                                ${money(product.price)}
                            </strong>

                            ${
                                hasDiscount
                                    ? `
                                        <del class="product-original-price">
                                            ${money(product.originalPrice)}
                                        </del>
                                    `
                                    : ""
                            }
                        </div>

                        ${
                            isOutOfStock
                                ? `
                                    <button
                                        type="button"
                                        class="add-to-cart-button"
                                        disabled
                                    >
                                        Out of stock
                                    </button>
                                `
                                : quantity > 0
                                    ? `
                                        <button
                                            type="button"
                                            class="add-to-cart-button added"
                                            data-action="add-to-cart"
                                            data-id="${safeText(product.id)}"
                                        >
                                            <i class="fa-solid fa-plus"></i>
                                            Add more
                                        </button>
                                    `
                                    : `
                                        <button
                                            type="button"
                                            class="add-to-cart-button"
                                            data-action="add-to-cart"
                                            data-id="${safeText(product.id)}"
                                        >
                                            <i class="fa-solid fa-plus"></i>
                                            Add
                                        </button>
                                    `
                        }

                    </div>

                </div>
            </article>
        `;
    }


    function renderProducts() {
        const grid = $("#products-grid");

        if (!grid) {
            console.error("CraveCart: #products-grid was not found.");
            return;
        }

        const filtered = getFilteredProducts();

        grid.innerHTML = filtered
            .map(renderProductCard)
            .join("");

        setHidden("#no-results", filtered.length !== 0);

        setText(
            "#product-results-count",
            `${filtered.length} ${filtered.length === 1 ? "dish" : "dishes"} found`
        );

        updateActiveFilters();

        setText(
            "#show-all-products span",
            activeCategory === "all" && !searchTerm
                ? "You're viewing the full menu"
                : "Explore full menu"
        );

        const showAllButton = $("#show-all-products");

        if (showAllButton) {
            showAllButton.disabled =
                activeCategory === "all" && !searchTerm;
        }
    }


    function updateActiveFilters() {
        const container = $("#active-filters");

        if (!container) {
            return;
        }

        const parts = [
            `
                <span class="filter-status">
                    <i class="fa-solid fa-leaf"></i>
                    Vegetarian menu
                </span>
            `
        ];

        if (activeCategory !== "all") {
            parts.push(`
                <button
                    type="button"
                    class="filter-chip"
                    data-action="clear-category"
                >
                    ${safeText(activeCategory.replaceAll("-", " "))}
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `);
        }

        if (searchTerm) {
            parts.push(`
                <button
                    type="button"
                    class="filter-chip"
                    data-action="clear-search"
                >
                    "${safeText(searchTerm)}"
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `);
        }

        container.innerHTML = parts.join("");
    }


    function updateCategoryButtons() {
        $$("#category-list [data-category]").forEach(button => {
            const category = normaliseCategory(button.dataset.category);

            const active = category === activeCategory;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }


    function selectCategory(category) {
        activeCategory = normaliseCategory(category || "all");

        if (!activeCategory) {
            activeCategory = "all";
        }

        updateCategoryButtons();
        renderProducts();

        scrollToSection("#products");
    }


    function resetFilters() {
        activeCategory = "all";
        searchTerm = "";
        sortMode = "featured";

        const searchInput = $("#product-search");
        const sortSelect = $("#sort-products");

        if (searchInput) {
            searchInput.value = "";
        }

        if (sortSelect) {
            sortSelect.value = "featured";
        }

        updateCategoryButtons();
        renderProducts();

        showToast(
            "Filters reset",
            "You're viewing the vegetarian menu.",
            "success"
        );
    }


    /* ========================================================
       8. PRODUCT STOCK DISPLAY
    ======================================================== */

    function updateStockForProduct(productId, amount) {
        const product = findProduct(productId);

        if (!product) {
            return false;
        }

        product.stock = Math.max(0, product.stock + amount);

        saveProducts();
        renderProducts();

        return true;
    }


    /* ========================================================
       9. CART OPERATIONS
    ======================================================== */

    function addToCart(productId, quantity = 1) {
        const product = findProduct(productId);

        if (!product) {
            showToast("Product unavailable", "This item could not be found.", "error");
            return;
        }

        if (!product.available || product.stock <= 0) {
            showToast("Out of stock", "This item is currently unavailable.", "warning");
            return;
        }

        const amount = Math.max(
            1,
            Math.floor(number(quantity))
        );

        const existing = cart.find(item => item.id === product.id);
        const currentQuantity = existing ? existing.quantity : 0;

        if (currentQuantity + amount > product.stock) {
            showToast(
                "Stock limit",
                `Only ${product.stock} item(s) are available.`,
                "warning"
            );
            return;
        }

        if (currentQuantity + amount > CONFIG.maximumQuantity) {
            showToast(
                "Quantity limit",
                `You can add up to ${CONFIG.maximumQuantity} of one item.`,
                "warning"
            );
            return;
        }

        if (existing) {
            existing.quantity += amount;
        } else {
            cart.push({
                id: product.id,
                quantity: amount
            });
        }

        saveCart();
        renderCart();
        renderProducts();

        showToast(
            "Added to cart",
            `${product.name} added successfully.`,
            "success"
        );
    }


    function changeCartQuantity(productId, change) {
        const item = cart.find(entry => entry.id === String(productId));
        const product = findProduct(productId);

        if (!item || !product) {
            return;
        }

        const nextQuantity = item.quantity + number(change);

        if (nextQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (nextQuantity > product.stock) {
            showToast(
                "Stock limit",
                `Only ${product.stock} item(s) are available.`,
                "warning"
            );
            return;
        }

        if (nextQuantity > CONFIG.maximumQuantity) {
            showToast(
                "Quantity limit",
                `Maximum ${CONFIG.maximumQuantity} per item.`,
                "warning"
            );
            return;
        }

        item.quantity = nextQuantity;

        saveCart();
        renderCart();
        renderProducts();
    }


    function removeFromCart(productId) {
        const product = findProduct(productId);

        cart = cart.filter(item => item.id !== String(productId));

        saveCart();
        renderCart();
        renderProducts();

        if (product) {
            showToast(
                "Item removed",
                `${product.name} removed from your cart.`,
                "info"
            );
        }
    }


    function clearCart() {
        if (cart.length === 0) {
            return;
        }

        cart = [];
        appliedCoupon = null;

        const couponInput = $("#coupon-code");

        if (couponInput) {
            couponInput.value = "";
        }

        persistCoupon();
        saveCart();
        renderCart();

        showToast("Cart cleared", "All items have been removed.", "info");
    }


    function renderCartItems() {
        const container = $("#cart-items");

        if (!container) {
            return;
        }

        const items = getCartProducts();

        if (items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-state" id="cart-empty-state">

                    <div class="empty-state-icon">
                        <i class="fa-solid fa-bag-shopping"></i>
                    </div>

                    <h3>Your cart is feeling lonely</h3>

                    <p>
                        Add something delicious from our vegetarian menu.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        data-action="close-cart"
                    >
                        Explore Menu
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                </div>
            `;

            return;
        }

        container.innerHTML = items.map(item => `
            <article
                class="cart-item"
                data-cart-item-id="${safeText(item.id)}"
            >

                <img
                    class="cart-item-image"
                    src="${safeText(item.image)}"
                    alt="${safeText(item.name)}"
                    loading="lazy"
                    onerror="imageFallback(this)"
                >

                <div class="cart-item-info">

                    <h3 class="cart-item-name">
                        ${safeText(item.name)}
                    </h3>

                    <p class="cart-item-price">
                        ${money(item.price)}
                    </p>

                    <div class="cart-item-controls">

                        <button
                            type="button"
                            class="quantity-button"
                            data-action="decrease-quantity"
                            data-id="${safeText(item.id)}"
                            aria-label="Decrease quantity"
                        >
                            <i class="fa-solid fa-minus"></i>
                        </button>

                        <span class="cart-item-quantity">
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-button"
                            data-action="increase-quantity"
                            data-id="${safeText(item.id)}"
                            aria-label="Increase quantity"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>

                </div>

                <div class="cart-item-end">

                    <strong class="cart-item-line-total">
                        ${money(item.lineTotal)}
                    </strong>

                    <button
                        type="button"
                        class="remove-cart-item"
                        data-action="remove-cart-item"
                        data-id="${safeText(item.id)}"
                        aria-label="Remove ${safeText(item.name)}"
                    >
                        <i class="fa-regular fa-trash-can"></i>
                    </button>

                </div>

            </article>
        `).join("");
    }


    function renderCart() {
        renderCartItems();

        const subtotal = getSubtotal();
        const delivery = getDeliveryFee(subtotal);
        const tax = getTax(subtotal);
        const discount = getCouponDiscount(subtotal);
        const total = getTotal();
        const count = getCartItemCount();

        setText("#cart-count", String(count));
        setText("#wishlist-count", String(wishlist.length));
        setText("#cart-heading-count", String(count));

        setText("#cart-subtotal", money(subtotal));
        setText("#cart-delivery", delivery === 0 && subtotal > 0 ? "FREE" : money(delivery));
        setText("#cart-tax", money(tax));
        setText("#cart-discount", `-${money(discount)}`);
        setText("#cart-total", money(total));
        setText("#checkout-total", money(total));
        setText("#checkout-review-total", money(total));

        setHidden("#discount-row", discount <= 0);

        const progressText = $("#delivery-progress-text");
        const progressBar = $("#cart-progress-bar");

        if (progressText && progressBar) {
            const progress = Math.min(
                100,
                (subtotal / CONFIG.freeDeliveryMinimum) * 100
            );

            progressBar.style.width = `${progress}%`;

            if (subtotal <= 0) {
                progressText.textContent =
                    `Add items to get started. Free delivery above ${money(CONFIG.freeDeliveryMinimum)}.`;
            } else if (subtotal >= CONFIG.freeDeliveryMinimum) {
                progressText.textContent = "Congratulations! You've unlocked free delivery.";
            } else {
                progressText.textContent =
                    `Add ${money(CONFIG.freeDeliveryMinimum - subtotal)} more for free delivery.`;
            }
        }

        const checkoutButton = $('[data-action="checkout"]');

        if (checkoutButton) {
            checkoutButton.disabled =
                subtotal < CONFIG.minimumOrder;

            checkoutButton.title =
                subtotal < CONFIG.minimumOrder
                    ? `Minimum order is ${money(CONFIG.minimumOrder)}`
                    : "Proceed to checkout";
        }

        const couponMessage = $("#coupon-message");

        if (couponMessage && !appliedCoupon) {
            couponMessage.textContent = "";
            couponMessage.classList.remove("success", "error");
        }

        updateAppStatus(`${count} item(s) in cart.`);
    }


    /* ========================================================
       10. COUPONS
    ======================================================== */

    function applyCoupon() {
        const input = $("#coupon-code");
        const message = $("#coupon-message");

        if (!input) {
            return;
        }

        const code = input.value.trim().toUpperCase();

        if (!code) {
            showCouponMessage("Enter a coupon code first.", "error");
            return;
        }

        const coupon = CONFIG.coupons[code];

        if (!coupon) {
            appliedCoupon = null;
            persistCoupon();
            renderCart();

            showCouponMessage(
                "Invalid coupon code. Try CRAVE10, WELCOME50 or FREESHIP.",
                "error"
            );

            return;
        }

        const subtotal = getSubtotal();

        if (subtotal < coupon.minimum) {
            showCouponMessage(
                `Add ${money(coupon.minimum - subtotal)} more to use ${code}.`,
                "error"
            );
            return;
        }

        appliedCoupon = code;
        persistCoupon();

        renderCart();

        showCouponMessage(
            `Coupon ${code} applied: ${coupon.description}.`,
            "success"
        );

        showToast("Coupon applied", coupon.description, "success");
    }


    function showCouponMessage(message, type) {
        const element = $("#coupon-message");

        if (!element) {
            showToast("Coupon", message, type);
            return;
        }

        element.textContent = message;
        element.classList.remove("success", "error");
        element.classList.add(type);
    }


    function removeCoupon() {
        appliedCoupon = null;
        persistCoupon();
        renderCart();

        showCouponMessage("Coupon removed.", "info");
    }


    /* ========================================================
       11. WISHLIST
    ======================================================== */

    function toggleWishlist(productId) {
        const product = findProduct(productId);

        if (!product) {
            return;
        }

        const existingIndex = wishlist.indexOf(product.id);

        if (existingIndex >= 0) {
            wishlist.splice(existingIndex, 1);

            showToast(
                "Removed from wishlist",
                product.name,
                "info"
            );
        } else {
            wishlist.push(product.id);

            showToast(
                "Saved to wishlist",
                product.name,
                "success"
            );
        }

        saveWishlist();
        renderWishlist();
        renderProducts();
        renderCart();
    }


    function renderWishlist() {
        const container = $("#wishlist-items");

        if (!container) {
            return;
        }

        const savedProducts = wishlist
            .map(findProduct)
            .filter(Boolean);

        setText("#wishlist-count", String(savedProducts.length));

        if (savedProducts.length === 0) {
            container.innerHTML = `
                <div class="wishlist-empty-state">

                    <div class="empty-state-icon">
                        <i class="fa-regular fa-heart"></i>
                    </div>

                    <h3>No favourites saved yet</h3>

                    <p>
                        Tap the heart on a dish to save it here.
                    </p>

                </div>
            `;

            return;
        }

        container.innerHTML = savedProducts.map(product => `
            <article class="wishlist-item" data-wishlist-id="${safeText(product.id)}">

                <img
                    class="wishlist-item-image"
                    src="${safeText(product.image)}"
                    alt="${safeText(product.name)}"
                    loading="lazy"
                    onerror="imageFallback(this)"
                >

                <div class="wishlist-item-info">

                    <h3>${safeText(product.name)}</h3>

                    <strong>${money(product.price)}</strong>

                    <div class="wishlist-item-actions">

                        <button
                            type="button"
                            class="primary-button"
                            data-action="wishlist-add-to-cart"
                            data-id="${safeText(product.id)}"
                            ${product.stock <= 0 ? "disabled" : ""}
                        >
                            <i class="fa-solid fa-bag-shopping"></i>
                            Add to cart
                        </button>

                        <button
                            type="button"
                            class="icon-button"
                            data-action="toggle-wishlist"
                            data-id="${safeText(product.id)}"
                            aria-label="Remove from wishlist"
                        >
                            <i class="fa-solid fa-heart"></i>
                        </button>

                    </div>

                </div>

            </article>
        `).join("");
    }


    /* ========================================================
       12. MODAL AND DRAWER MANAGEMENT
    ======================================================== */

    function setOpenState(element, open) {
        if (!element) {
            return;
        }

        element.hidden = !open;

        element.classList.toggle("is-open", open);
        element.classList.toggle("open", open);
        element.classList.toggle("active", open);
        element.classList.toggle("show", open);

        element.setAttribute("aria-hidden", String(!open));

        if ("inert" in element) {
            element.inert = !open;
        }

        if (open) {
            element.removeAttribute("inert");
        } else {
            element.setAttribute("inert", "");
        }
    }


    function openCart() {
        closeWishlist();
        closeCheckout();
        closeInvoice();

        setOpenState($("#cart-overlay"), true);
        setOpenState($("#cart-drawer"), true);

        document.body.classList.add("cart-open", "modal-open");

        renderCart();

        window.setTimeout(() => {
            $('[data-action="close-cart"]')?.focus();
        }, 50);
    }


    function closeCart() {
        setOpenState($("#cart-overlay"), false);
        setOpenState($("#cart-drawer"), false);

        document.body.classList.remove("cart-open");

        if (
            !$("#wishlist-modal")?.classList.contains("is-open") &&
            !$("#checkout-modal")?.classList.contains("is-open") &&
            !$("#invoice-modal")?.classList.contains("is-open")
        ) {
            document.body.classList.remove("modal-open");
        }
    }


    function openWishlist() {
        closeCart();
        closeCheckout();
        closeInvoice();

        renderWishlist();

        setOpenState($("#wishlist-overlay"), true);
        setOpenState($("#wishlist-modal"), true);

        document.body.classList.add("wishlist-open", "modal-open");
    }


    function closeWishlist() {
        setOpenState($("#wishlist-overlay"), false);
        setOpenState($("#wishlist-modal"), false);

        document.body.classList.remove("wishlist-open");

        if (
            !$("#cart-drawer")?.classList.contains("is-open") &&
            !$("#checkout-modal")?.classList.contains("is-open") &&
            !$("#invoice-modal")?.classList.contains("is-open")
        ) {
            document.body.classList.remove("modal-open");
        }
    }


    function openCheckout() {
        if (getSubtotal() < CONFIG.minimumOrder) {
            showToast(
                "Minimum order",
                `Your subtotal must be at least ${money(CONFIG.minimumOrder)}.`,
                "warning"
            );
            return;
        }

        closeCart();
        closeWishlist();
        closeInvoice();

        fillCustomerForm();

        setText("#checkout-review-total", money(getTotal()));

        setOpenState($("#checkout-overlay"), true);
        setOpenState($("#checkout-modal"), true);

        document.body.classList.add("checkout-open", "modal-open");
    }


    function closeCheckout() {
        setOpenState($("#checkout-overlay"), false);
        setOpenState($("#checkout-modal"), false);

        document.body.classList.remove("checkout-open");

        if (
            !$("#cart-drawer")?.classList.contains("is-open") &&
            !$("#wishlist-modal")?.classList.contains("is-open") &&
            !$("#invoice-modal")?.classList.contains("is-open")
        ) {
            document.body.classList.remove("modal-open");
        }
    }


    function openInvoice(order) {
        if (!order) {
            return;
        }

        invoiceOrder = order;

        closeCart();
        closeWishlist();
        closeCheckout();

        renderInvoice(order);

        setOpenState($("#invoice-overlay"), true);
        setOpenState($("#invoice-modal"), true);

        document.body.classList.add("invoice-open", "modal-open");
    }


    function closeInvoice() {
        setOpenState($("#invoice-overlay"), false);
        setOpenState($("#invoice-modal"), false);

        document.body.classList.remove("invoice-open");

        if (
            !$("#cart-drawer")?.classList.contains("is-open") &&
            !$("#wishlist-modal")?.classList.contains("is-open") &&
            !$("#checkout-modal")?.classList.contains("is-open")
        ) {
            document.body.classList.remove("modal-open");
        }
    }


    function closeAllPanels() {
        closeCart();
        closeWishlist();
        closeCheckout();
        closeInvoice();
        closeMobileMenu();
        closeSearch();
    }


    /* ========================================================
       13. CHECKOUT CUSTOMER DETAILS
    ======================================================== */

    function fillCustomerForm() {
        const customer = readStorage(CONFIG.storage.customer, {});

        const fields = {
            "#customer-name": customer.name,
            "#customer-phone": customer.phone,
            "#customer-email": customer.email,
            "#customer-address": customer.address,
            "#customer-city": customer.city,
            "#customer-pincode": customer.pincode
        };

        Object.entries(fields).forEach(([selector, value]) => {
            const field = $(selector);

            if (field && value && !field.value) {
                field.value = value;
            }
        });
    }


    function getCustomerDetails() {
        return {
            name: $("#customer-name")?.value.trim() || "",
            phone: $("#customer-phone")?.value.trim() || "",
            email: $("#customer-email")?.value.trim() || "",
            address: $("#customer-address")?.value.trim() || "",
            city: $("#customer-city")?.value.trim() || "",
            pincode: $("#customer-pincode")?.value.trim() || ""
        };
    }


    function saveCustomerDetails(customer) {
        /*
         * Demo convenience only.
         * Avoid saving sensitive personal data on shared devices.
         * Production applications should use a secure backend.
         */
        writeStorage(CONFIG.storage.customer, customer);
    }


    function validateCustomer(customer) {
        if (
            !customer.name ||
            !customer.phone ||
            !customer.address ||
            !customer.city ||
            !customer.pincode
        ) {
            showToast(
                "Missing details",
                "Please complete all required checkout fields.",
                "error"
            );
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(customer.phone)) {
            showToast(
                "Invalid phone number",
                "Enter a valid 10-digit Indian mobile number.",
                "error"
            );

            $("#customer-phone")?.focus();
            return false;
        }

        if (!/^[1-9]\d{5}$/.test(customer.pincode)) {
            showToast(
                "Invalid PIN code",
                "Enter a valid 6-digit PIN code.",
                "error"
            );

            $("#customer-pincode")?.focus();
            return false;
        }

        if (
            customer.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
        ) {
            showToast(
                "Invalid email",
                "Please enter a valid email address.",
                "error"
            );

            $("#customer-email")?.focus();
            return false;
        }

        return true;
    }


    /* ========================================================
       14. PLACE ORDER
    ======================================================== */

    function placeOrder(event) {
        event.preventDefault();

        const form = $("#checkout-form");

        if (form && !form.reportValidity()) {
            return;
        }

        if (cart.length === 0) {
            showToast(
                "Your cart is empty",
                "Add a product before placing an order.",
                "warning"
            );

            closeCheckout();
            return;
        }

        /*
         * Re-check product availability before creating the
         * demo order. A real application must do this on server.
         */
        for (const item of cart) {
            const product = findProduct(item.id);

            if (
                !product ||
                !product.available ||
                product.stock < item.quantity
            ) {
                showToast(
                    "Stock changed",
                    `${product?.name || "An item"} is no longer available in that quantity.`,
                    "error"
                );

                return;
            }
        }

        const customer = getCustomerDetails();

        if (!validateCustomer(customer)) {
            return;
        }

        const subtotal = getSubtotal();
        const delivery = getDeliveryFee(subtotal);
        const tax = getTax(subtotal);
        const discount = getCouponDiscount(subtotal);
        const total = getTotal();

        const paymentMethod =
            $('input[name="paymentMethod"]:checked')?.value || "cod";

        const order = {
            id: createId("CC"),
            orderNumber: `CC${Date.now().toString().slice(-8)}`,
            invoiceNumber: `INV-${new Date().getFullYear()}-${Math.random()
                .toString(36)
                .slice(2, 8)
                .toUpperCase()}`,

            createdAt: new Date().toISOString(),

            status: "pending",
            paymentMethod,
            paymentStatus: "pending",

            customer,

            items: getCartProducts().map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                lineTotal: item.lineTotal
            })),

            subtotal,
            delivery,
            tax,
            discount,
            coupon: appliedCoupon,
            total,

            currency: CONFIG.currency
        };

        /*
         * Reduce local demo stock.
         * This is not a replacement for server-side inventory.
         */
        order.items.forEach(item => {
            const product = findProduct(item.id);

            if (product) {
                product.stock = Math.max(
                    0,
                    product.stock - item.quantity
                );
            }
        });

        orders.unshift(order);

        saveOrders();
        saveProducts();
        saveCustomerDetails(customer);

        lastOrder = order;
        writeStorage(CONFIG.storage.lastOrder, order);

        cart = [];
        appliedCoupon = null;

        saveCart();
        persistCoupon();

        const couponInput = $("#coupon-code");

        if (couponInput) {
            couponInput.value = "";
        }

        closeCheckout();

        renderProducts();
        renderCart();
        renderWishlist();

        openInvoice(order);

        showToast(
            "Order placed!",
            `Your demo order number is ${order.orderNumber}.`,
            "success"
        );

        updateAppStatus(
            `Order ${order.orderNumber} created successfully.`
        );
    }


    /* ========================================================
       15. INVOICE RENDERING
    ======================================================== */

    function formatDate(dateValue) {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return new Intl.DateTimeFormat(CONFIG.locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }


    function renderInvoice(order) {
        const container = $("#invoice-content");

        if (!container || !order) {
            return;
        }

        const items = Array.isArray(order.items) ? order.items : [];
        const customer = order.customer || {};

        container.innerHTML = `
            <div class="invoice-document" id="invoice-print-area">

                <div class="invoice-brand-row">

                    <div>
                        <div class="invoice-brand-name">
                            <span>Crave</span>Cart
                        </div>

                        <p class="invoice-brand-tagline">
                            Vegetarian goodness, delivered.
                        </p>
                    </div>

                    <span class="invoice-status-badge">
                        ${safeText(order.status || "pending")}
                    </span>

                </div>

                <div class="invoice-number-row">

                    <div>
                        <span>Order number</span>
                        <strong>${safeText(order.orderNumber || order.id)}</strong>
                    </div>

                    <div>
                        <span>Invoice number</span>
                        <strong>${safeText(order.invoiceNumber || "Not assigned")}</strong>
                    </div>

                    <div>
                        <span>Order date</span>
                        <strong>${safeText(formatDate(order.createdAt))}</strong>
                    </div>

                </div>

                <div class="invoice-customer-section">

                    <h3>Delivery details</h3>

                    <strong>${safeText(customer.name || "")}</strong>

                    <p>${safeText(customer.phone || "")}</p>

                    ${
                        customer.email
                            ? `<p>${safeText(customer.email)}</p>`
                            : ""
                    }

                    <p>
                        ${safeText(customer.address || "")}<br>
                        ${safeText(customer.city || "")}
                        ${customer.pincode ? ` — ${safeText(customer.pincode)}` : ""}
                    </p>

                </div>

                <div class="invoice-items-section">

                    <h3>Order items</h3>

                    <div class="invoice-table-wrap">

                        <table class="invoice-table">

                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td>${safeText(item.name)}</td>
                                        <td>${number(item.quantity)}</td>
                                        <td>${money(item.price)}</td>
                                        <td>${money(item.lineTotal)}</td>
                                    </tr>
                                `).join("")}
                            </tbody>

                        </table>

                    </div>

                </div>

                <div class="invoice-summary">

                    <div>
                        <span>Subtotal</span>
                        <strong>${money(order.subtotal)}</strong>
                    </div>

                    <div>
                        <span>Delivery</span>
                        <strong>${number(order.delivery) === 0 ? "FREE" : money(order.delivery)}</strong>
                    </div>

                    <div>
                        <span>Tax (${Math.round(CONFIG.taxRate * 100)}% demo calculation)</span>
                        <strong>${money(order.tax)}</strong>
                    </div>

                    ${
                        number(order.discount) > 0
                            ? `
                                <div class="invoice-discount">
                                    <span>
                                        Discount
                                        ${order.coupon ? `(${safeText(order.coupon)})` : ""}
                                    </span>
                                    <strong>-${money(order.discount)}</strong>
                                </div>
                            `
                            : ""
                    }

                    <div class="invoice-grand-total">
                        <span>Total paid / payable</span>
                        <strong>${money(order.total)}</strong>
                    </div>

                </div>

                <div class="invoice-payment-note">

                    <i class="fa-solid fa-circle-info"></i>

                    <p>
                        Payment method: ${safeText(
                            String(order.paymentMethod || "cod").toUpperCase()
                        )}.
                        This is a demo invoice generated by the CraveCart
                        frontend; it is not a tax invoice issued by a registered seller.
                    </p>

                </div>

                <div class="invoice-thank-you">
                    <i class="fa-solid fa-heart"></i>
                    Thank you for choosing CraveCart!
                </div>

            </div>
        `;
    }


    function buildInvoiceHTML(order) {
        const items = Array.isArray(order.items) ? order.items : [];
        const customer = order.customer || {};

        const rows = items.map(item => `
            <tr>
                <td>${safeText(item.name)}</td>
                <td>${number(item.quantity)}</td>
                <td>${money(item.price)}</td>
                <td>${money(item.lineTotal)}</td>
            </tr>
        `).join("");

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>CraveCart Invoice ${safeText(order.orderNumber)}</title>

                <style>
                    body {
                        max-width: 850px;
                        margin: 35px auto;
                        padding: 24px;
                        color: #222;
                        font: 14px/1.6 Arial, sans-serif;
                    }

                    h1 {
                        color: #e65e20;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 25px;
                    }

                    th, td {
                        padding: 11px;
                        border-bottom: 1px solid #ddd;
                        text-align: left;
                    }

                    .totals {
                        max-width: 350px;
                        margin: 25px 0 0 auto;
                    }

                    .totals p {
                        display: flex;
                        justify-content: space-between;
                    }

                    .grand-total {
                        padding-top: 12px;
                        border-top: 2px solid #222;
                        font-size: 19px;
                        font-weight: bold;
                    }

                    .note {
                        margin-top: 30px;
                        padding: 12px;
                        background: #f4f4f4;
                        font-size: 12px;
                    }

                    @media print {
                        body {
                            margin: 0;
                            padding: 10px;
                        }
                    }
                </style>
            </head>

            <body>

                <h1>CraveCart</h1>
                <p>Vegetarian goodness, delivered.</p>

                <h2>Order invoice</h2>

                <p><strong>Order:</strong> ${safeText(order.orderNumber)}</p>
                <p><strong>Invoice:</strong> ${safeText(order.invoiceNumber)}</p>
                <p><strong>Date:</strong> ${safeText(formatDate(order.createdAt))}</p>
                <p><strong>Status:</strong> ${safeText(order.status)}</p>

                <h3>Customer</h3>
                <p>${safeText(customer.name)}</p>
                <p>${safeText(customer.phone)}</p>
                <p>${safeText(customer.email)}</p>
                <p>
                    ${safeText(customer.address)}<br>
                    ${safeText(customer.city)}
                    ${safeText(customer.pincode)}
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>

                <div class="totals">
                    <p><span>Subtotal</span><strong>${money(order.subtotal)}</strong></p>
                    <p><span>Delivery</span><strong>${money(order.delivery)}</strong></p>
                    <p><span>Tax</span><strong>${money(order.tax)}</strong></p>
                    <p><span>Discount</span><strong>-${money(order.discount)}</strong></p>
                    <p class="grand-total"><span>Total</span><strong>${money(order.total)}</strong></p>
                </div>

                <div class="note">
                    Demo invoice only. This is not a tax invoice from a
                    registered seller. Tax and payment details are illustrative.
                </div>

            </body>
            </html>
        `;
    }


    function downloadInvoice() {
        const order = invoiceOrder || lastOrder;

        if (!order) {
            showToast(
                "No invoice available",
                "Place a demo order first.",
                "warning"
            );
            return;
        }

        /*
         * If jsPDF has been added to index.html, use it.
         * Otherwise download a printable HTML invoice.
         */
        const jsPDF = window.jspdf?.jsPDF;

        if (jsPDF) {
            const doc = new jsPDF();

            let y = 18;

            doc.setFontSize(20);
            doc.text("CraveCart Invoice", 14, y);

            y += 12;

            doc.setFontSize(10);
            doc.text(`Order: ${order.orderNumber}`, 14, y);
            y += 7;

            doc.text(`Invoice: ${order.invoiceNumber}`, 14, y);
            y += 7;

            doc.text(`Date: ${formatDate(order.createdAt)}`, 14, y);
            y += 7;

            doc.text(`Customer: ${order.customer?.name || ""}`, 14, y);
            y += 12;

            doc.setFontSize(11);
            doc.text("Items", 14, y);
            y += 8;

            doc.setFontSize(9);

            for (const item of order.items || []) {
                if (y > 260) {
                    doc.addPage();
                    y = 18;
                }

                const line =
                    `${item.name} x ${item.quantity} — ${money(item.lineTotal)}`;

                doc.text(line.slice(0, 100), 14, y);
                y += 7;
            }

            y += 6;

            if (y > 260) {
                doc.addPage();
                y = 18;
            }

            doc.text(`Subtotal: ${money(order.subtotal)}`, 14, y);
            y += 7;

            doc.text(`Delivery: ${money(order.delivery)}`, 14, y);
            y += 7;

            doc.text(`Tax: ${money(order.tax)}`, 14, y);
            y += 7;

            doc.text(`Discount: -${money(order.discount)}`, 14, y);
            y += 9;

            doc.setFontSize(13);
            doc.text(`Total: ${money(order.total)}`, 14, y);

            y += 12;

            doc.setFontSize(8);
            doc.text(
                "Demo invoice only; not a registered seller's tax invoice.",
                14,
                Math.min(y, 285)
            );

            doc.save(`${order.invoiceNumber || order.orderNumber}.pdf`);

            showToast(
                "Invoice downloaded",
                "Your PDF invoice is ready.",
                "success"
            );

            return;
        }

        const html = buildInvoiceHTML(order);
        const blob = new Blob([html], {
            type: "text/html;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${order.invoiceNumber || order.orderNumber}.html`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        showToast(
            "Invoice downloaded",
            "HTML invoice downloaded. Open it and use Print → Save as PDF.",
            "success"
        );
    }


    function printInvoice() {
        const order = invoiceOrder || lastOrder;

        if (!order) {
            showToast(
                "No invoice available",
                "Place a demo order first.",
                "warning"
            );
            return;
        }

        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            showToast(
                "Popup blocked",
                "Allow popups to print the invoice, or use Download Invoice.",
                "warning"
            );
            return;
        }

        printWindow.document.open();
        printWindow.document.write(buildInvoiceHTML(order));
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    }


    /* ========================================================
       16. SEARCH PANEL
    ======================================================== */

    function openSearch() {
        const panel = $("#search-panel");

        if (!panel) {
            $("#product-search")?.focus();
            scrollToSection("#products");
            return;
        }

        panel.hidden = false;
        panel.classList.add("is-open", "active");

        const input = $("#product-search");

        window.setTimeout(() => input?.focus(), 50);
    }


    function closeSearch() {
        const panel = $("#search-panel");

        if (!panel) {
            return;
        }

        panel.hidden = true;
        panel.classList.remove("is-open", "active");
    }


    function handleSearchInput(event) {
        searchTerm = event.target.value.trim();

        renderProducts();
    }


    function clearSearch() {
        const input = $("#product-search");

        if (input) {
            input.value = "";
        }

        searchTerm = "";

        renderProducts();
    }


    /* ========================================================
       17. MOBILE MENU
    ======================================================== */

    function openMobileMenu() {
        const menu = $("#mobile-navigation");

        if (!menu) {
            return;
        }

        menu.hidden = false;
        menu.classList.add("is-open", "active");

        const toggle = $("#mobile-menu-toggle");

        if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
        }
    }


    function closeMobileMenu() {
        const menu = $("#mobile-navigation");

        if (!menu) {
            return;
        }

        menu.hidden = true;
        menu.classList.remove("is-open", "active");

        const toggle = $("#mobile-menu-toggle");

        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    }


    function toggleMobileMenu() {
        const menu = $("#mobile-navigation");

        if (!menu) {
            return;
        }

        if (menu.hidden) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }


    /* ========================================================
       18. NEWSLETTER DEMO
    ======================================================== */

    function handleNewsletter(event) {
        event.preventDefault();

        const input = $("#newsletter-email");
        const message = $("#newsletter-message");

        if (!input || !input.value.trim()) {
            showToast(
                "Email required",
                "Enter your email address to continue.",
                "warning"
            );
            return;
        }

        const email = input.value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast(
                "Invalid email",
                "Please enter a valid email address.",
                "error"
            );
            return;
        }

        /*
         * Demo only. A real newsletter requires an email service
         * or a backend endpoint and consent handling.
         */
        const subscribers = readStorage("cravecart_newsletter_demo", []);

        if (!subscribers.includes(email)) {
            subscribers.push(email);

            writeStorage(
                "cravecart_newsletter_demo",
                subscribers
            );
        }

        if (message) {
            message.textContent =
                "Thanks for subscribing! This is a local demo signup.";

            message.classList.add("success");
        }

        input.value = "";

        showToast(
            "You're on the list!",
            "Demo signup saved in this browser.",
            "success"
        );
    }


    /* ========================================================
       19. PRODUCT SORTING
    ======================================================== */

    function handleSortChange(event) {
        sortMode = event.target.value || "featured";
        renderProducts();
    }


    /* ========================================================
       20. PAYMENT OPTION UI
    ======================================================== */

    function updatePaymentSelection() {
        $$(".payment-option").forEach(option => {
            const radio = $('input[type="radio"]', option);

            option.classList.toggle(
                "selected",
                Boolean(radio?.checked)
            );
        });
    }


    /* ========================================================
       21. BACK TO TOP
    ======================================================== */

    function updateBackToTop() {
        const button = $("#back-to-top");

        if (!button) {
            return;
        }

        const visible = window.scrollY > 500;

        button.classList.toggle("visible", visible);
        button.classList.toggle("active", visible);
        button.setAttribute("aria-hidden", String(!visible));
    }


    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* ========================================================
       22. HEADER SCROLL EFFECT
    ======================================================== */

    function updateHeaderOnScroll() {
        const header = $("#site-header");

        if (!header) {
            return;
        }

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 20
        );
    }


    /* ========================================================
       23. CLICK EVENT DELEGATION
    ======================================================== */

    function handleDocumentClick(event) {
        const actionElement = event.target.closest("[data-action]");

        if (actionElement) {
            const action = actionElement.dataset.action;
            const id = actionElement.dataset.id;

            switch (action) {
                case "add-to-cart":
                    addToCart(id);
                    return;

                case "toggle-wishlist":
                    toggleWishlist(id);
                    return;

                case "open-cart":
                    openCart();
                    return;

                case "close-cart":
                    closeCart();
                    return;

                case "open-wishlist":
                    openWishlist();
                    return;

                case "close-wishlist":
                    closeWishlist();
                    return;

                case "checkout":
                    openCheckout();
                    return;

                case "close-checkout":
                    closeCheckout();
                    return;

                case "close-invoice":
                    closeInvoice();
                    return;

                case "increase-quantity":
                    changeCartQuantity(id, 1);
                    return;

                case "decrease-quantity":
                    changeCartQuantity(id, -1);
                    return;

                case "remove-cart-item":
                    removeFromCart(id);
                    return;

                case "wishlist-add-to-cart":
                    addToCart(id);
                    openCart();
                    return;

                case "clear-category":
                    activeCategory = "all";
                    updateCategoryButtons();
                    renderProducts();
                    return;

                case "clear-search":
                    clearSearch();
                    return;

                case "clear-cart":
                    clearCart();
                    return;

                case "remove-coupon":
                    removeCoupon();
                    return;

                default:
                    break;
            }
        }

        const categoryButton = event.target.closest(
            "#category-list [data-category]"
        );

        if (categoryButton) {
            selectCategory(categoryButton.dataset.category);
            return;
        }

        const mobileLink = event.target.closest(
            "#mobile-navigation a"
        );

        if (mobileLink) {
            closeMobileMenu();
            return;
        }

        if (event.target.closest("#cart-overlay")) {
            closeCart();
            return;
        }

        if (event.target.closest("#wishlist-overlay")) {
            closeWishlist();
            return;
        }

        if (event.target.closest("#checkout-overlay")) {
            closeCheckout();
            return;
        }

        if (event.target.closest("#invoice-overlay")) {
            closeInvoice();
        }
    }


    /* ========================================================
       24. KEYBOARD ACCESSIBILITY
    ======================================================== */

    function handleKeydown(event) {
        if (event.key === "Escape") {
            closeAllPanels();
        }

        /*
         * Basic modal focus containment.
         * Production applications should use a full, tested
         * focus-trap implementation for every modal.
         */
        if (event.key === "Tab") {
            const openModal = [
                $("#cart-drawer"),
                $("#wishlist-modal"),
                $("#checkout-modal"),
                $("#invoice-modal")
            ].find(element =>
                element &&
                !element.hidden &&
                element.getAttribute("aria-hidden") === "false"
            );

            if (!openModal) {
                return;
            }

            const focusable = $$(
                'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                openModal
            ).filter(element => element.offsetParent !== null);

            if (focusable.length === 0) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    }


    /* ========================================================
       25. NEWSLETTER / FORM SUBMISSION
    ======================================================== */

    function attachFormEvents() {
        $("#checkout-form")?.addEventListener("submit", placeOrder);

        $("#newsletter-form")?.addEventListener(
            "submit",
            handleNewsletter
        );

        $("#apply-coupon")?.addEventListener("click", applyCoupon);

        $("#coupon-code")?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                applyCoupon();
            }
        });

        $("#print-invoice")?.addEventListener("click", printInvoice);

        $("#download-invoice")?.addEventListener(
            "click",
            downloadInvoice
        );

        $("#product-search")?.addEventListener(
            "input",
            handleSearchInput
        );

        $("#sort-products")?.addEventListener(
            "change",
            handleSortChange
        );

        $("#search-toggle")?.addEventListener("click", () => {
            const panel = $("#search-panel");

            if (panel && !panel.hidden) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        $("#clear-search")?.addEventListener("click", clearSearch);

        $("#mobile-menu-toggle")?.addEventListener(
            "click",
            toggleMobileMenu
        );

        $("#reset-filters")?.addEventListener(
            "click",
            resetFilters
        );

        $("#show-all-products")?.addEventListener("click", () => {
            activeCategory = "all";
            searchTerm = "";

            if ($("#product-search")) {
                $("#product-search").value = "";
            }

            if ($("#sort-products")) {
                $("#sort-products").value = "featured";
            }

            sortMode = "featured";

            updateCategoryButtons();
            renderProducts();

            scrollToSection("#products");
        });

        $("#back-to-top")?.addEventListener("click", scrollToTop);

        $("#checkout-form")?.addEventListener("change", event => {
            if (event.target.matches('input[name="paymentMethod"]')) {
                updatePaymentSelection();
            }
        });

        $("#cart-items")?.addEventListener("click", handleCartItemClick);
    }


    function handleCartItemClick(event) {
        /*
         * The global delegated handler already handles cart actions.
         * This listener intentionally remains available if the cart
         * template is later separated into its own component.
         */
    }


    /* ========================================================
       26. NAVIGATION HELPERS
    ======================================================== */

    function attachNavigationEvents() {
        $$(".main-navigation a, .mobile-navigation a").forEach(link => {
            link.addEventListener("click", () => {
                closeMobileMenu();
                closeSearch();
            });
        });

        $$('a[href^="#"]').forEach(link => {
            link.addEventListener("click", event => {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target = $(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (history.replaceState) {
                    history.replaceState(null, "", targetId);
                }
            });
        });
    }


    /* ========================================================
       27. SCROLL EFFECTS
    ======================================================== */

    function attachScrollEvents() {
        window.addEventListener(
            "scroll",
            () => {
                updateBackToTop();
                updateHeaderOnScroll();
            },
            { passive: true }
        );

        updateBackToTop();
        updateHeaderOnScroll();
    }


    /* ========================================================
       28. INITIALISE YEAR
    ======================================================== */

    function updateCurrentYear() {
        setText("#current-year", String(new Date().getFullYear()));
    }


    /* ========================================================
       29. INITIALISE APP
    ======================================================== */

    function init() {
        loadProducts();
        loadCart();
        loadWishlist();
        loadOrders();
        loadCoupon();

        lastOrder = readStorage(CONFIG.storage.lastOrder, null);

        updateCurrentYear();

        updateCategoryButtons();

        renderProducts();
        renderCart();
        renderWishlist();

        attachFormEvents();
        attachNavigationEvents();
        attachScrollEvents();

        document.addEventListener("click", handleDocumentClick);
        document.addEventListener("keydown", handleKeydown);

        /*
         * Hide the initial HTML loading placeholder once the
         * product catalogue has rendered.
         */
        const grid = $("#products-grid");

        if (grid) {
            grid.setAttribute("aria-live", "polite");
        }

        console.info(
            `CraveCart ready: ${products.length} products loaded.`
        );

        updateAppStatus(
            `CraveCart loaded with ${products.length} vegetarian products.`
        );
    }


    /* ========================================================
       30. GLOBAL HELPERS FOR IMAGE FALLBACK

       These functions are exposed only because the HTML uses
       onerror="imageFallback(this)" for remote product images.
    ======================================================== */

    window.imageFallback = imageFallback;


    /* ========================================================
       31. START
    ======================================================== */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }


    /* ========================================================
       32. OPTIONAL DEBUG API

       Useful for learning and debugging in browser DevTools.
       Do not expose this debug API in a production build.
    ======================================================== */

    window.CraveCartDemo = {
        getProducts: () => products.map(product => ({ ...product })),
        getCart: () => getCartProducts(),
        getWishlist: () => [...wishlist],
        getOrders: () => [...orders],
        getTotal,
        resetFilters,
        clearCart
    };

})();
```
