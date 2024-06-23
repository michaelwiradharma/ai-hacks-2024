-- backend/postgres/init.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- 'student' or 'instructor'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    parent_reply_id INT REFERENCES replies(id) ON DELETE CASCADE, -- allows nested replies
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    topic_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Insert data into users table
INSERT INTO users (username, email, password_hash, user_type)
VALUES
('peyrinkao', 'peyrinkao@berkeley.edu', 'abc', 'instructor'),
('matthewkao', 'matthewkao@berkeley.edu', 'abc', 'student'),
('johndoe', 'johndoe@berkeley.edu', 'xyz', 'student');

-- Insert data into posts table
INSERT INTO posts (title, user_id, content, created_at) 
VALUES 
('[Final] Summer 2022', 1, 'You can find the past exams here.\nWhen posting questions, please reference the exam type and question number in bold at the beginning in this format: Exam Type–Question Number\nFor example: MT1–7d, or Final–3aiii', '2024-06-02'),
('[SU24] Private Tutor', 1, 'Looking for a private tutor for summer sessions.', '2024-06-06'),
('[FA24] ASE (UCS/TA, UGSI) Application Deadline', 1, 'Reminder: The application deadline for Fall 2024 ASE positions is approaching. Submit your applications soon!', '2022-06-19'),
('HW 01 Released', 2, 'HW 01 is released and will be due Wednesday, June 26 at 11:59 pm.', '2024-06-20');

-- Insert data into replies table
INSERT INTO replies (post_id, user_id, parent_reply_id, content, created_at, updated_at)
VALUES
(1, 2, NULL, 'I have a question about MT1–7d.', '2024-06-03', '2024-06-03'),
(1, 3, 1, 'What is your specific question?', '2024-06-03', '2024-06-03'),
(2, 2, NULL, 'I am available for tutoring. Contact me for more details.', '2024-06-06', '2024-06-06'),
(2, 3, 3, 'Can you help with algorithms?', '2024-06-06', '2024-06-06'),
(3, 2, NULL, 'I am interested in applying. Where can I find more information?', '2024-06-19', '2024-06-19'),
(3, 3, 5, 'Check the university website for more details.', '2024-06-19', '2024-06-19');

-- Insert data into topics table
INSERT INTO topics (name, description)
VALUES
('boolean logic', 'Topics covering boolean logic including short circuiting.'),
('while loops', 'Discussion on while loops and their applications.'),
('conditionals', 'Topics related to if-else conditions and their usage.');
