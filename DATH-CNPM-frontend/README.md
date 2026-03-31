# VESTRA E-Commerce

**VESTRA** là một nền tảng thương mại điện tử full-stack được xây dựng
bằng **PERN Stack** (PostgreSQL, Express, React, Node.js). Hệ thống hỗ
trợ đầy đủ chức năng e-commerce, phân quyền theo vai trò và tích hợp
thanh toán **VNPAY Sandbox** thông qua **Ngrok**.

------------------------------------------------------------------------

## 🚀 Features

### 💻 Frontend (React + Vite + MUI)

-   Giao diện hiện đại, responsive.
-   Tích hợp Material UI và custom components.
-   Tìm kiếm, lọc sản phẩm, giỏ hàng và thanh toán.
-   Dashboard theo vai trò:
    -   **User**
    -   **Shop Owner**
    -   **Admin**

### 🛠 Backend (Node.js + Express + Prisma)

-   Xác thực, phân quyền JWT.
-   API RESTful cho sản phẩm, đơn hàng, tài khoản.
-   Quản lý sản phẩm (dành cho Shop Owner).
-   Quản lý người dùng & báo cáo (dành cho Admin).
-   Tích hợp thanh toán **VNPAY Sandbox**.
-   Prisma ORM + PostgreSQL.

------------------------------------------------------------------------

## 📁 Project Structure

### Frontend

    frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── routes/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── README.md

### Backend

    backend/
    ├── prisma/
    │   ├── migrations/
    │   └── schema.prisma
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   ├── services/
    │   ├── models/
    │   ├── validators/
    │   └── utils/
    ├── app.js
    ├── nodemon.json
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## 🧪 Local Development Setup

### 0. Ngrok Setup (bắt buộc để test VNPAY)

1.  Cài đặt Ngrok: https://ngrok.com/

2.  Thêm token:

    ``` bash
    ngrok config add-authtoken <your_token>
    ```

3.  Chạy server:

    ``` bash
    ngrok http 3000
    ```

4.  Lấy URL public của Ngrok.

5.  Truy cập VNPAY Sandbox merchant:
    https://sandbox.vnpayment.vn/merchantv2/

6.  Login bằng tài khoản: *liên hệ nhóm*.

7.  Vào **Account Information → Edit Website → IPN URL** và dán URL mới.

------------------------------------------------------------------------

## 🛠 Backend Setup

### 1. Cài đặt dependencies:

``` bash
npm install
```

### 2. Tạo file `.env`

    DATABASE_URL="postgresql://postgres:<username>@localhost:5432/fashion_store?schema=public"

    JWT_SECRET="<secret_key>"

    PORT=3000

    # VNPAY Sandbox Config
    VNP_TMNCODE=<liên hệ nhóm>
    VNP_HASHSECRET=<liên hệ nhóm>
    VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
    VNP_RETURN_URL=http://localhost:3000/api/orders/vnpay_return

### 3. Chạy migration:

``` bash
npx prisma migrate dev
```

### 4. Start backend:

``` bash
npm run dev
```

Backend chạy trên: **http://localhost:3000**

------------------------------------------------------------------------

## 🎨 Frontend Setup

### 1. Cài dependencies:

``` bash
npm install
```

### 2. Chạy frontend:

``` bash
npm run dev
```

Frontend chạy trên: **http://localhost:5173**

------------------------------------------------------------------------

## 💳 VNPAY Testing

Tài khoản test ngân hàng VNPAY:\
👉 https://sandbox.vnpayment.vn/apis/vnpay-demo/

------------------------------------------------------------------------

## 📜 License

MIT License
