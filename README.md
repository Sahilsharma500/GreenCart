# 🛒 GreenCart

A modern **MERN** e‑commerce platform with distinct **buyer** and **seller** experiences. The project features a responsive React + Tailwind frontend, secure Node/Express APIs, MongoDB persistence with Mongoose models, Stripe payments, and Cloudinary image storage.

**Live Frontend:** [https://green-cart-khaki-six.vercel.app/]
**Backend Base URL:** `https://greencart-backend-snowy.vercel.app/`

---

## 🔍 What this app does

* **Buyers** can browse products, view details, manage cart, save addresses, and checkout via **COD** or **Stripe**.
* **Sellers (Admin)** can authenticate separately, add products with multiple images, toggle stock, and view all orders.
* **Secure APIs** gated behind JWT middleware for **users** and **sellers**.

---

## 🧱 Architecture

* **Frontend:** React (Vite) + Tailwind CSS + Context API (global auth, cart, product/session state)
* **Backend:** Node.js + Express + Multer (for uploads) + Stripe SDK + Cloudinary SDK
* **Database:** MongoDB Atlas via Mongoose
* **Auth:** JWT for buyers and sellers with dedicated middlewares

```text
client/    React app (Vite + Tailwind)
server/    Express API (routes, controllers, models, middleware)
```

---

## ✨ Key Features

* 🔐 **JWT Auth** for buyer & seller with separate routes/guards
* 🛍️ **Product Catalog** with multi-image upload to **Cloudinary** (via Multer)
* 🛒 **Cart & Checkout** (COD and Stripe payment flow)
* 📦 **Orders** with status lifecycle and user/seller views
* 🏠 **Addresses** saved per user for faster checkout
* 📱 **Responsive** UI and clean UX

---

## 🚀 Getting Started


### 1) Clone & install

```bash
git clone https://github.com/Sahilsharma500/GreenCart.git
cd GreenCart

# frontend
cd client && npm install

# backend
cd ../server && npm install
```

### 2) Environment variables

Create **`client/.env`**

```bash
VITE_CURRENCY="$"
VITE_BACKEND_URL="http://localhost:4000"
```

Create **`server/.env`** (use your own secrets)

```bash
JWT_SECRET="<your_jwt_secret>"
NODE_ENV="development"

# Admin/Seller login
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="<strong_password>"

# MongoDB
MONGODB_URI="<mongodb_connection_string>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="<cloud_name>"
CLOUDINARY_API_KEY="<api_key>"
CLOUDINARY_API_SECRET="<api_secret>"

# Stripe
STRIPE_PUBLISHABLE_KEY="<pk_test_...>"
STRIPE_SECRET_KEY="<sk_test_...>"
STRIPE_WEBHOOK_SECRET="<whsec_...>"  # only if using webhooks
```


### 3) Run

```bash
# frontend
cd client
npm run dev

# backend
cd ../server
npm start
```

---

## 🧩 Frontend (Buyer & Seller)

### Buyer Experience

* **Auth:** Register/Login, JWT stored securely (e.g., httpOnly cookie or header-based usage via API).
* **Catalog:** Browse products with images, description list, offerPrice, and category.
* **Cart:** Add/update items, quantity management, total amount calculation.
* **Address Book:** Add and select address at checkout.
* **Checkout:** Choose **COD** or **Stripe**, then place an order.
* **Orders Page:** View past orders with status and amount.

### Seller (Admin) Experience

* **Auth:** Separate seller login & auth checks.
* **Add Product:** Upload multiple images (via Multer) → stored on Cloudinary.
* **Inventory:** Toggle `inStock` & manage product details.
* **Orders (Seller):** View all orders across users.

---

## 🗄️ Database Models (Mongoose)

### `Product`

| Field         | Type     | Required | Default | Notes                       |
| ------------- | -------- | -------- | ------- | --------------------------- |
| `name`        | String   | ✔️       | —       | Product title               |
| `description` | Array    | ✔️       | —       | List of bullet descriptions |
| `price`       | String   | ✔️       | —       | Base price (string)         |
| `offerPrice`  | Number   | ✔️       | —       | Discounted price            |
| `image`       | Array    | ✔️       | —       | Array of image URLs         |
| `category`    | String   | ✔️       | —       | Category name               |
| `inStock`     | Boolean  | —        | `true`  | Availability                |
| *timestamps*  | Mongoose | —        | auto    | `createdAt`, `updatedAt`    |

### `Address`

| Field       | Type   | Required | Notes         |
| ----------- | ------ | -------- | ------------- |
| `userId`    | String | ✔️       | Owner user id |
| `firstName` | String | ✔️       |               |
| `lastName`  | String | ✔️       |               |
| `email`     | String | ✔️       |               |
| `street`    | String | ✔️       |               |
| `city`      | String | ✔️       |               |
| `state`     | String | ✔️       |               |
| `zipcode`   | Number | ✔️       |               |
| `country`   | String | ✔️       |               |
| `phone`     | String | ✔️       |               |

### `Order`

| Field         | Type     | Required | Default        | Notes                                                         |
| ------------- | -------- | -------- | -------------- | ------------------------------------------------------------- |
| `userId`      | String   | ✔️       | —              | `ref: 'user'`                                                 |
| `items[]`     | Array    | ✔️       | —              | Each: `{ product: String (ref 'product'), quantity: Number }` |
| `amount`      | Number   | ✔️       | —              | Order total                                                   |
| `address`     | String   | ✔️       | —              | `ref: 'address'`                                              |
| `status`      | String   | —        | `Order Placed` | Lifecycle status                                              |
| `paymentType` | String   | ✔️       | —              | e.g., `COD` or `Stripe`                                       |
| `isPaid`      | Boolean  | ✔️       | `false`        | Payment flag                                                  |
| *timestamps*  | Mongoose | —        | auto           | `createdAt`, `updatedAt`                                      |

> If you also have a `User` model, document it similarly (email, password hash, cart, roles, etc.).

### Relationships (ER Overview)

```text
User 1 ── * Address
User 1 ── * Order
Order * ── 1 Address
Order * ── 1..* Product (via items[].product)
Product * ── 1 Seller/Admin (implicit ownership)
```

---

## 🔗 API (Routes & Endpoints)

> Base paths shown as examples: adjust to your actual mount points (e.g., `/api/user`, `/api/seller`, `/api/product`, ...).

### Auth — Buyer (`userRouter`)

| Method | Path        | Auth       | Description                   |
| ------ | ----------- | ---------- | ----------------------------- |
| POST   | `/register` | —          | Create a new user             |
| POST   | `/login`    | —          | Login user and issue JWT      |
| GET    | `/is-auth`  | `authUser` | Validate current user session |
| GET    | `/logout`   | `authUser` | Invalidate session/logout     |

### Auth — Seller/Admin (`sellerRouter`)

| Method | Path       | Auth         | Description             |
| ------ | ---------- | ------------ | ----------------------- |
| POST   | `/login`   | —            | Seller login            |
| GET    | `/is-auth` | `authSeller` | Validate seller session |
| GET    | `/logout`  | —            | Seller logout           |

### Products (`productRouter`)

| Method | Path     | Auth         | Body / Notes                                                                           |
| ------ | -------- | ------------ | -------------------------------------------------------------------------------------- |
| POST   | `/add`   | `authSeller` | `multipart/form-data` with images via `upload.array('images')`; product fields in body |
| GET    | `/list`  | —            | List all products                                                                      |
| GET    | `/id`    | —            | Get product by id (e.g., `?id=<productId>`)                                            |
| POST   | `/stock` | `authSeller` | Toggle/modify stock for a product                                                      |

### Orders (`orderRouter`)

| Method | Path      | Auth         | Description                                     |
| ------ | --------- | ------------ | ----------------------------------------------- |
| POST   | `/cod`    | `authUser`   | Place **Cash on Delivery** order                |
| POST   | `/stripe` | `authUser`   | Place **Stripe** order / create payment session |
| GET    | `/user`   | `authUser`   | Fetch current user’s orders                     |
| GET    | `/seller` | `authSeller` | Fetch all orders (seller overview)              |

### Cart (`cartRouter`)

| Method | Path      | Auth       | Description                       |
| ------ | --------- | ---------- | --------------------------------- |
| POST   | `/update` | `authUser` | Add/update/remove items from cart |

### Addresses (`addressRouter`)

| Method | Path   | Auth       | Description                          |
| ------ | ------ | ---------- | ------------------------------------ |
| POST   | `/add` | `authUser` | Add a new address                    |
| GET    | `/get` | `authUser` | Get addresses for the logged-in user |

> **Response shapes** follow the controller implementations (`controllers/*`). Add examples (request/response JSON) if you plan to share a Postman collection.


---

## 🔒 Security & Best Practices

* Hash passwords (e.g., bcrypt) and never log secrets
* Validate payloads (Joi/Zod) and sanitize inputs
* Use CORS properly (frontend origin only)
* Prefer httpOnly cookies or secure headers for JWT
* Add rate limiting & helmet for production

---

## 🗺️ Roadmap / Improvements
* Product search & advanced filters
* Wishlist & product reviews
* Pagination & caching (Redis)
* Order status updates via webhooks
* Multi-vendor support & role-based access control

---


