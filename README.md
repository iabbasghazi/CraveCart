## 📁 Folder Structure

The following is the proposed full-stack folder structure.

```text
CraveCart/
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   │
│   ├── admin.html
│   ├── admin.css
│   ├── admin.js
│   │
│   └── assets/
│       ├── images/
│       │   ├── logo.png
│       │   ├── placeholders/
│       │   └── banners/
│       └── icons/
│
├── backend/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── coupons.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── invoices.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   └── invoiceController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   │
│   ├── services/
│   │   ├── pricingService.js
│   │   ├── couponService.js
│   │   ├── inventoryService.js
│   │   └── invoiceService.js
│   │
│   ├── db/
│   │   ├── database.js
│   │   └── migrations/
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── response.js
│   │
│   └── tests/
│       ├── products.test.js
│       ├── coupons.test.js
│       └── orders.test.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── screenshots/
│   ├── project-report.md
│   ├── database-design.md
│   ├── api-documentation.md
│   └── testing.md
│
├── .gitignore
├── README.md
└── LICENSE
```


# 🍕 CraveCart — Premium Vegetarian Food Ordering Platform

<p align="center">
  <img src="https://i.postimg.cc/HkrL3C15/Crave-Cart-Glowing-Food-Delivery-Logo.png" alt="CraveCart Logo" width="180">
</p>

<h3 align="center">
  Fresh Food. Premium Experience. Delivered with Love.
</h3>

<p align="center">
  A modern, premium and responsive vegetarian food ordering platform built as a BCA academic project.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-BCA%20Academic%20Project-orange?style=for-the-badge" alt="BCA Project">
  <img src="https://img.shields.io/badge/Food-100%25%20Vegetarian-228B22?style=for-the-badge" alt="Vegetarian Only">
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-blue?style=for-the-badge" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge" alt="Backend">
</p>

---

## 📌 Table of Contents

- [Introduction](#-introduction)
- [Project Objectives](#-project-objectives)
- [Project Screenshots](#-project-screenshots)
- [Key Features](#-key-features)
- [Product Categories](#-product-categories)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Database Design](#-database-design)
- [How the Project Works](#-how-the-project-works)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Security](#-security)
- [Testing](#-testing)
- [Future Enhancements](#-future-enhancements)
- [Academic Purpose](#-academic-purpose)
- [Author](#-author)
- [License](#-license)

---

## 🍽️ Introduction

**CraveCart** is a modern online food ordering website designed to provide customers with a convenient, attractive and user-friendly food shopping experience.

The platform focuses exclusively on vegetarian food products. Customers can explore food items, search by name, browse categories, add products to their cart, manage favourites, apply discount coupons and proceed through the checkout process.

CraveCart also includes an administrative dashboard for managing products, prices, inventory, promotional coupons and customer orders.

The project combines an interactive frontend with a backend API and database to demonstrate the fundamentals of full-stack web development.

The website is designed with a premium black-and-orange visual identity, responsive layouts, smooth animations and food photography.

### Project Highlights

- Premium vegetarian food ordering experience.
- Target catalogue of 220+ vegetarian products.
- Responsive customer website.
- Interactive shopping cart and wishlist.
- Administrative product and order management.
- Coupon and discount management.
- Order invoices and PDF downloads.
- Backend API and database integration.
- GitHub-based source control.
- Render-based backend deployment.

> **Note:** Features described in this README represent the project's intended design. Update this document as each feature is implemented and tested.

---

## 🎯 Project Objectives

The primary objectives of CraveCart are:

1. Develop a modern and responsive food ordering interface.
2. Provide customers with an easy way to discover vegetarian dishes.
3. Implement shopping cart and wishlist functionality.
4. Calculate item totals, delivery charges, discounts and taxes.
5. Generate professional order invoices.
6. Enable administrators to manage products and orders.
7. Create a centralized coupon management system.
8. Demonstrate backend API development and database operations.
9. Apply authentication and authorization to administrative functions.
10. Learn Git, GitHub, deployment and software testing.

---

## 🖼️ Project Screenshots

Screenshots help visitors understand the website before running the code.

### 1. Homepage

![CraveCart Homepage](docs/screenshots/homepage.png)

*Premium homepage with food categories, featured products and promotional sections.*

### 2. Product Catalogue

![CraveCart Products](docs/screenshots/products.png)

*Vegetarian food catalogue with product images, prices and category filters.*

### 3. Shopping Cart

![CraveCart Shopping Cart](docs/screenshots/cart.png)

*Interactive cart with quantity controls, discounts, delivery charges and order totals.*

### 4. Admin Dashboard

![CraveCart Admin Dashboard](docs/screenshots/admin-dashboard.png)

*Administrative dashboard for product, order and sales management.*

### 5. Invoice

![CraveCart Invoice](docs/screenshots/invoice.png)

*Professional order invoice with item details, discounts and the final amount.*

**To add screenshots:**

Create the `docs/screenshots/` directory and save your actual website screenshots using the filenames shown above.

Until these files exist in the repository, GitHub may display broken image placeholders. Replace them with actual screenshots after implementing the corresponding features.

---

## ✨ Key Features

### 🛍️ Customer Website

- Modern and responsive user interface.
- Premium black-and-orange theme.
- Food categories and product collections.
- Product search and sorting.
- Product descriptions and pricing.
- Product discounts and availability labels.
- Featured and bestselling product sections.
- Responsive navigation.
- Smooth scrolling and interface animations.
- Loading states and empty-state messages.

### 🥗 Vegetarian Product Catalogue

The catalogue is planned to contain at least 220 unique vegetarian food products.

Every product can include:

- Product ID.
- Product name.
- Category.
- Description.
- Maximum Retail Price (MRP).
- Selling price.
- Product image URL.
- Discount percentage.
- Availability status.
- Stock quantity.
- Preparation time.
- Featured-product status.

Only vegetarian products should be included. Egg-containing products will not be included if the project follows a strict egg-free policy.

### 🛒 Shopping Cart

- Add products to the cart.
- Increase or decrease quantities.
- Remove individual items.
- Clear the cart.
- Calculate the subtotal.
- Apply eligible discount coupons.
- Calculate delivery charges.
- Display applicable taxes.
- Calculate the final amount.
- Save cart state between page visits.
- Validate product availability before checkout.

### ❤️ Wishlist

- Add products to favourites.
- Remove products from favourites.
- View saved products.
- Add wishlist items to the cart.
- Preserve favourites between visits where supported.

### 🎟️ Coupon Management

Administrators can manage promotional coupons through the admin dashboard.

Planned coupon settings include:

- Coupon code.
- Percentage or fixed discount.
- Minimum order value.
- Maximum discount amount.
- Start and expiry dates.
- Usage limits.
- Customer usage limits.
- Eligible products or categories.
- Active and inactive status.

The backend must validate coupons when creating orders. Frontend validation alone is not sufficient for real transactions.

### 🧾 Checkout and Invoices

- Customer details form.
- Delivery address.
- Phone number validation.
- Order summary.
- Coupon discount breakdown.
- Delivery fee and tax details.
- Unique order ID.
- Invoice number.
- Printable invoice.
- PDF invoice download.
- Order confirmation.
- Order history where supported.

### 🔐 Admin Dashboard

- Secure administrative login.
- Product creation, editing and deletion.
- Product price and image management.
- Category management.
- Stock and availability management.
- Coupon creation and management.
- Order listing and search.
- Order status updates.
- Customer order details.
- Sales summaries and reports.
- CSV export where implemented.
- Administrative activity logging.

### 📦 Inventory and Order Management

- Track product stock.
- Mark unavailable products.
- Display low-stock warnings.
- Validate stock before accepting orders.
- Track order status.
- Manage cancellations according to the configured rules.

### 📱 Responsive Design

The website is designed to support:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile phones.

---

## 🥦 Product Categories

The target catalogue contains 220+ vegetarian products distributed across these categories.

| Category | Planned Products |
|---|---:|
| Pizza | 20 |
| Burgers and Sandwiches | 20 |
| Biryani and Rice | 20 |
| Indian Main Course | 20 |
| Chinese Food | 20 |
| Momos and Starters | 20 |
| South Indian Food | 15 |
| Snacks and Fries | 15 |
| Cakes and Desserts | 20 |
| Drinks and Shakes | 15 |
| Combos and Meals | 15 |
| **Total** | **220** |

Examples include Margherita Pizza, Paneer Tikka Pizza, Veg Burger, Veg Biryani, Shahi Paneer, Dal Makhani, Hakka Noodles, Veg Momos, Masala Dosa, Chocolate Brownie and Mango Shake.

These counts describe the planned catalogue and should be updated to match the actual product data.

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, layout and animations |
| JavaScript | Client-side functionality |
| Responsive CSS | Mobile and tablet compatibility |
| jsPDF or equivalent | Client-side PDF generation, if used |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend API framework |
| PostgreSQL | Relational database |
| Database driver or ORM | Database communication |
| Authentication middleware | Protecting administrative routes |
| Server-side validation | Validating requests and order totals |

### Development and Deployment

| Tool | Purpose |
|---|---|
| Visual Studio Code | Code editor |
| Git | Version control |
| GitHub | Source code hosting |
| GitHub Pages | Static frontend hosting |
| Render | Backend hosting |
| Render PostgreSQL or compatible PostgreSQL provider | Database hosting |

The final dependencies depend on the actual implementation. Remove technologies that are not used in the finished project.

---

## 🏗️ Project Architecture

CraveCart separates the customer-facing website from the backend API.

```text
                 CUSTOMER
                     |
                     v
          +----------------------+
          |  CRAVECART FRONTEND  |
          | HTML / CSS / JS      |
          |    GitHub Pages      |
          +----------------------+
                     |
                     | HTTPS API requests
                     v
          +----------------------+
          |   EXPRESS BACKEND    |
          |       Render         |
          +----------------------+
                     |
          +----------+-----------+
          |          |           |
          v          v           v
      Products    Coupons      Orders
          |          |           |
          +----------+-----------+
                     |
                     v
          +----------------------+
          |     PostgreSQL       |
          |       Database       |
          +----------------------+
```

### Architecture Explanation

1. The frontend displays products and provides the shopping interface.
2. The backend exposes API endpoints for products, coupons, users and orders.
3. The database stores persistent product and order information.
4. The admin dashboard communicates with protected backend endpoints.
5. The backend validates product prices, coupon eligibility and inventory before accepting an order.
6. The invoice uses the saved order information.
7. The frontend and backend communicate over HTTPS.

GitHub Pages hosts static files only. The Express backend and PostgreSQL database must be deployed separately.

---

## 📁 Folder Structure

The following is the proposed full-stack folder structure.

```text
CraveCart/
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   │
│   ├── admin.html
│   ├── admin.css
│   ├── admin.js
│   │
│   └── assets/
│       ├── images/
│       │   ├── logo.png
│       │   ├── placeholders/
│       │   └── banners/
│       └── icons/
│
├── backend/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── coupons.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── invoices.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   └── invoiceController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   │
│   ├── services/
│   │   ├── pricingService.js
│   │   ├── couponService.js
│   │   ├── inventoryService.js
│   │   └── invoiceService.js
│   │
│   ├── db/
│   │   ├── database.js
│   │   └── migrations/
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── response.js
│   │
│   └── tests/
│       ├── products.test.js
│       ├── coupons.test.js
│       └── orders.test.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── screenshots/
│   ├── project-report.md
│   ├── database-design.md
│   ├── api-documentation.md
│   └── testing.md
│
├── .gitignore
├── README.md
└── LICENSE
```

### Important Folder Notes

- `frontend/` contains the customer website and admin interface.
- `backend/routes/` defines API endpoints.
- `backend/controllers/` handles API requests.
- `backend/services/` contains business logic.
- `backend/middleware/` protects routes and validates requests.
- `backend/db/` manages database connections and migrations.
- `database/schema.sql` defines database tables.
- `database/seed.sql` contains initial development data.
- `docs/` contains project documentation and screenshots.

This is a planned structure, not a claim that every listed file already exists.

---

## 🗄️ Database Design

The database will use PostgreSQL.

### Planned Tables

| Table | Purpose |
|---|---|
| `users` | Customer accounts |
| `admin_users` | Administrative accounts and roles |
| `categories` | Product categories |
| `products` | Product information and pricing |
| `product_variants` | Sizes and customisation options |
| `carts` | Persistent carts, if supported |
| `cart_items` | Products in carts |
| `addresses` | Saved customer addresses |
| `coupons` | Coupon rules and validity |
| `coupon_redemptions` | Recorded coupon usage |
| `orders` | Order details and status |
| `order_items` | Products purchased in an order |
| `payments` | Payment references and status |
| `reviews` | Customer ratings and feedback |
| `inventory_logs` | Stock changes |
| `admin_activity_logs` | Administrative actions |

### Database Relationships

- One category can contain many products.
- One customer can place many orders.
- One order can contain many order items.
- One product can appear in many order items.
- One coupon can be redeemed by eligible customers.
- Inventory changes can be recorded for auditing.

Order items should store snapshots of the product name and purchase price so that historical invoices remain correct even if the catalogue changes later.

---

## ⚙️ How the Project Works

### Customer Workflow

1. The customer opens the CraveCart website.
2. The frontend loads products from the backend API.
3. The customer searches or filters the catalogue.
4. The customer adds vegetarian products to the cart.
5. The customer enters an eligible coupon code.
6. The backend validates the coupon.
7. The customer provides delivery information.
8. The backend validates the order and recalculates its total.
9. The order is stored in the database.
10. The customer views the order confirmation and invoice.
11. The customer can print or download the invoice.

### Admin Workflow

1. The administrator opens the admin login page.
2. The backend verifies the administrator's credentials.
3. The administrator receives access to authorized dashboard functions.
4. The administrator manages products, categories and coupons.
5. Product and coupon changes are saved to the database.
6. Customers receive updated catalogue information through the API.
7. The administrator reviews orders and updates their statuses.

---

## 💻 Installation and Setup

### Prerequisites

Install the following tools:

- Visual Studio Code.
- Node.js and npm.
- Git.
- A PostgreSQL database.
- A modern web browser.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CraveCart
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Create a local `.env` file inside `backend/`.

Example:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_local_postgresql_connection_string
FRONTEND_URL=http://localhost:5500
SESSION_SECRET=replace_with_a_long_random_secret
```

Use actual local database credentials and a securely generated session secret.

**Never commit `.env` to GitHub.**

### Step 4: Set Up the Database

Create a PostgreSQL database and apply the database migrations or schema.

For example, if the project uses SQL files:

```bash
psql "YOUR_DATABASE_CONNECTION_STRING" -f ../database/schema.sql
```

Run the seed script after creating the required tables:

```bash
psql "YOUR_DATABASE_CONNECTION_STRING" -f ../database/seed.sql
```

The exact commands may need adjustment depending on the configured database and migration system.

### Step 5: Start the Backend

```bash
npm run dev
```

If the project does not define a development script, use the script specified in `package.json`.

### Step 6: Open the Frontend

Open `frontend/index.html` using a local development server such as the VS Code Live Server extension.

Opening the HTML file directly with `file://` may cause API or browser security issues.

### Step 7: Configure the API URL

During local development, the frontend should point to the local backend.

For production, it should point to the deployed Render API.

Example configuration:

```javascript
const API_BASE_URL = "YOUR_BACKEND_API_URL";
```

Use the actual API URL and keep environment-specific configuration separate where appropriate.

---

## 🔑 Environment Variables

Backend secrets and configuration should be managed through environment variables.

| Variable | Purpose |
|---|---|
| `PORT` | Backend listening port |
| `NODE_ENV` | Development or production mode |
| `DATABASE_URL` | PostgreSQL connection string |
| `FRONTEND_URL` | Allowed frontend origin |
| `SESSION_SECRET` | Session security secret |

Additional variables may be required for email, payments, image storage or other integrations.

Do not place passwords, database credentials or private API keys in frontend JavaScript.

---

## 🌍 Deployment

### Frontend — GitHub Pages

1. Push the frontend source code to GitHub.
2. Open the repository settings.
3. Find the Pages configuration.
4. Select the appropriate publishing source and folder.
5. Publish the static frontend.
6. Configure the production API URL.
7. Test the deployed website.

GitHub Pages does not execute Node.js or Express backend code.

### Backend — Render

1. Push the backend code to GitHub.
2. Create a new Render Web Service.
3. Connect the repository.
4. Configure the backend root directory as `backend`, if using the proposed structure.
5. Set the build command to install dependencies.
6. Configure the start command according to `package.json`.
7. Add the required environment variables.
8. Deploy the service.
9. Check the health endpoint and backend logs.

### Database — PostgreSQL

Create a PostgreSQL database through a suitable provider.

Configure `DATABASE_URL` securely and run the required migrations and seed scripts.

For production, use appropriate backups, access controls and database connection security.

### Final Deployment Checks

- The frontend can reach the backend.
- CORS permits the intended frontend origin.
- The database connection works.
- Product images load.
- Coupon validation works.
- Orders are saved correctly.
- Admin-only endpoints reject unauthorized requests.
- PDF invoices contain correct order totals.

---

## 🛡️ Security

Security is an important part of the CraveCart design.

Planned security practices include:

- Hashing passwords with a suitable password-hashing algorithm.
- Verifying authentication on the backend.
- Protecting administrative API endpoints.
- Validating incoming request data.
- Using parameterized SQL queries.
- Applying rate limits to sensitive endpoints.
- Using HTTPS in production.
- Protecting sessions and sensitive state-changing requests.
- Keeping secrets in environment variables.
- Validating coupon eligibility on the backend.
- Recalculating prices and totals on the server.
- Checking stock before accepting orders.
- Limiting access to customer information.
- Recording important administrative actions.

> A password check implemented only in `admin.html` or `admin.js` is not secure authentication. Real authorization must be enforced by the backend.

---

## 🧪 Testing

The project should be tested before the final college demonstration.

### Customer Website Tests

- Products load correctly.
- Product images display or use a fallback.
- Search returns matching products.
- Category filters work.
- Cart quantities update correctly.
- Removing an item updates the totals.
- Wishlist functions work.
- Invalid coupons are rejected.
- Eligible coupons apply the correct discount.
- Checkout validates required fields.
- The final order amount is calculated correctly.
- PDF invoices can be downloaded and opened.

### Admin Tests

- Invalid credentials are rejected.
- Unauthorized users cannot access protected APIs.
- Admins can create, update and deactivate products.
- Coupon changes are saved to the database.
- Expired coupons are rejected.
- Order statuses update correctly.
- Invalid data is rejected by the backend.
- Stock cannot be oversold under concurrent requests.

### Deployment Tests

- Frontend works on mobile and desktop.
- Backend responds correctly.
- Database data persists.
- API requests use HTTPS.
- Browser console contains no critical errors.
- Environment secrets are not exposed.

---

## 🔮 Future Enhancements

Potential future features include:

- Customer account registration and login.
- Real payment gateway integration.
- Email order confirmations.
- Live order status notifications.
- Delivery tracking.
- Loyalty points and rewards.
- Product reviews and ratings.
- Smart product recommendations.
- Combo meal builder.
- Progressive Web App support.
- Advanced sales analytics.
- Automated database backups.
- Bulk product import from CSV.
- Image storage through a dedicated image-hosting service.

These features can be implemented incrementally based on project requirements and available hosting resources.

---

## 🎓 Academic Purpose

CraveCart is intended to demonstrate practical concepts from a Bachelor of Computer Applications (BCA) programme.

The project can be used to explain:

- Frontend development.
- Responsive web design.
- JavaScript programming.
- REST API design.
- CRUD operations.
- Relational database design.
- SQL queries and relationships.
- Authentication and authorization.
- Input validation.
- Software testing.
- Git and GitHub.
- Cloud deployment.

The final project report should describe the features that are actually implemented and tested.

---

## 👨‍💻 Author

**Project Name:** CraveCart  
**Project Type:** BCA Academic Project  
**Domain:** Vegetarian Food Ordering Platform  
**Frontend:** HTML, CSS and JavaScript  
**Backend:** Node.js and Express  
**Database:** PostgreSQL  
**Source Control:** Git and GitHub  
**Deployment:** GitHub Pages and Render  

**Developed for educational and demonstration purposes.**

---

## 📄 License

Choose and add an appropriate license before publicly distributing the project.

If the project uses third-party food photography, fonts, icons or libraries, follow their respective license and attribution requirements.

---

<p align="center">
  <strong>CraveCart — Fresh Food. Premium Experience. ❤️</strong>
</p>

<p align="center">
  Made with dedication for a BCA academic project.
</p>
