-- TradeSense AI - Database Schema

-- 1. Users Table
-- Stores user identity and role (Admin)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Challenges Table
-- Stores the state of Prop Firm challenges (The "Truth")
CREATE TABLE IF NOT EXISTS user_challenges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'STARTER', 'PRO', 'ELITE'
    status TEXT NOT NULL, -- 'ACTIVE', 'FAILED', 'PASSED', 'EXPLORATION'
    
    -- Balance & Risk Metrcs
    initial_balance REAL NOT NULL,
    current_balance REAL NOT NULL,
    equity REAL NOT NULL,
    max_equity REAL NOT NULL, -- High watermark
    daily_starting_balance REAL NOT NULL, -- Reset daily for daily loss calc
    
    -- Rules Configuration (Snapshot at creation)
    profit_target REAL NOT NULL,
    max_daily_loss_limit REAL NOT NULL,
    max_total_loss_limit REAL NOT NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 3. Trades Table
-- Stores executed trades (History & Performance)
CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    challenge_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL, -- 'BUY' or 'SELL'
    
    -- Execution Data
    entry_price REAL NOT NULL,
    exit_price REAL, -- NULL if open
    lots REAL NOT NULL,
    pnl REAL DEFAULT 0,
    
    status TEXT NOT NULL, -- 'OPEN', 'CLOSED'
    opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME,
    
    FOREIGN KEY(challenge_id) REFERENCES user_challenges(id)
);

-- 4. Payments Table
-- Stores payment records
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    challenge_id TEXT,
    method TEXT NOT NULL, -- 'CMI', 'CRYPTO', 'PAYPAL'
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL, -- 'SUCCESS', 'PENDING', 'FAILED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(challenge_id) REFERENCES user_challenges(id)
);

-- 5. Admin Settings (Optional)
-- Dynamic configuration
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
