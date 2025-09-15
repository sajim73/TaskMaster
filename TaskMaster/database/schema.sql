-- SQL schema
-- ----------------------------
-- Categories Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- ----------------------------
-- Tasks Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    priority TEXT DEFAULT 'Medium',
    deadline DATETIME,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- ----------------------------
-- Settings Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme TEXT DEFAULT 'light',
    font_size TEXT DEFAULT 'medium',
    notifications BOOLEAN DEFAULT 1
);
