-- Seed data
-- Insert default categories
INSERT OR IGNORE INTO categories (name) VALUES ('Work');
INSERT OR IGNORE INTO categories (name) VALUES ('School');
INSERT OR IGNORE INTO categories (name) VALUES ('Personal');

-- Insert sample tasks
INSERT INTO tasks (title, description, category_id, priority, deadline, status)
VALUES ('Finish CSC 317 project', 'Complete TaskMaster backend', 1, 'High', '2025-09-30 23:59:59', 'Pending');

INSERT INTO tasks (title, description, category_id, priority, deadline, status)
VALUES ('Study for AI exam', 'Review all lecture notes', 2, 'Medium', '2025-09-25 18:00:00', 'Pending');

INSERT INTO tasks (title, description, category_id, priority, deadline, status)
VALUES ('Buy groceries', 'Milk, Eggs, Bread', 3, 'Low', '2025-09-16 17:00:00', 'Pending');

-- Insert default settings
INSERT OR IGNORE INTO settings (theme, font_size, notifications) 
VALUES ('light', 'medium', 1);
