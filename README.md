# Solabucks Coffee Website

A complete coffee ordering website with login, menu, order placement, and order confirmation.

## Features

1. **Login Page** - User registration and login
2. **Main Page** - Menu, About Solabucks, Contact, Order
3. **Order Received Page** - Order confirmation with Customer ID, Phone, Order items, Price

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **Database:** MySQL

---

## Step-by-Step Setup

### Step 1: MySQL Database Setup

1. Open **phpMyAdmin** (http://localhost/phpmyadmin) or MySQL command line
2. Create the database by running the SQL file:

```bash
mysql -u root -p < database.sql
```

Or copy the contents of `database.sql` and run it in phpMyAdmin's SQL tab.

3. **Default MySQL credentials** (XAMPP):
   - Host: `localhost`
   - User: `root`
   - Password: *(empty)*
   - Port: `3306`

### Step 2: Python Backend Setup

1. **Install Python** (3.8+) if not already installed

2. **Navigate to backend folder:**
```bash
cd c:\xampp\htdocs\solabucks-order\backend
```

3. **Create virtual environment (optional but recommended):**
```bash
python -m venv venv
venv\Scripts\activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Configure database** - Edit `backend/app.py` if your MySQL credentials differ:
   - Default: `root` user, no password, database `solabucks`
   - Or set environment variables: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`

6. **Run the backend server:**
```bash
python app.py
```

The API will run at **http://localhost:5000**

### Step 3: Run the Frontend

1. **Option A - XAMPP:** Place the project in `htdocs` and open:
   ```
   http://localhost/solabucks-order/login.html
   ```

2. **Option B - Live Server (VS Code):** Right-click `login.html` → "Open with Live Server"

3. **Option C - Direct file:** Open `login.html` in browser (CORS may block API calls - use XAMPP or Live Server)

---

## Project Structure

```
solabucks-order/
├── login.html          # Login & Register page
├── index.html          # Main page (Menu, About, Contact, Order)
├── order_received.html # Order confirmation page
├── style.css           # All styles
├── script.js           # Cart, Auth, Order logic
├── database.sql        # MySQL schema
├── README.md           # This file
└── backend/
    ├── app.py          # Flask API
    └── requirements.txt
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |
| POST | `/api/order` | Place order |
| GET | `/api/order/<order_id>` | Get order details |
| GET | `/api/health` | Health check |

---

## User Flow

1. **Login** → Create account or login at `login.html`
2. **Browse** → View menu, add items to cart
3. **Order** → Fill name, phone, email → Place Order
4. **Confirmation** → Redirected to `order_received.html?order_id=SB...` with full order details

---

## Troubleshooting

- **"Cannot connect to server"** → Make sure Python backend is running (`python app.py`)
- **Database connection failed** → Check MySQL is running (XAMPP Control Panel) and credentials in `app.py`
- **CORS errors** → Use a local server (XAMPP/Live Server), not `file://`
- **Order not found** → Ensure you're using the correct `order_id` from the redirect URL
