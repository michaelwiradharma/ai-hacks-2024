-- init.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- 'student' or 'instructor'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    reply_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    parent_reply_id INT REFERENCES replies(reply_id) ON DELETE CASCADE, -- allows nested replies
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


INSERT INTO posts (title, content, created_at) 
VALUES 
('[Final] Summer 2022', 'You can find the past exams here.\n
              When posting questions, please reference the exam type and question number in bold at the beginning in this format: Exam Type–Question Number\n
              For example: MT1–7d, or Final–3aiii', '06/02/24'),
('[SU24] Private Tutor', 'Looking for a private tutor for summer sessions.', '06/06/24'),
('[FA24] ASE (UCS/TA, UGSI) Application Deadline', 'Reminder: The application deadline for Fall 2024 ASE positions is approaching. Submit your applications soon!', '06/19/22');