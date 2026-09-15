-- ====================================================================
-- Campus Lost and Found Management System
-- Database Schema & Architecture
-- Developed by Team: SQL Titans
-- Members:
--  1. Rohit Jaganath Waghmare
--  2. Shivraj Gautam Jagdale
--  3. Nandkumar Ramraje Thalkari
--  4. Sagar Manoj Wagh
--  5. Jay Munde
-- ====================================================================

CREATE DATABASE IF NOT EXISTS campus_lost_found_db;
USE campus_lost_found_db;

-- 1. Administrators Table
CREATE TABLE IF NOT EXISTS administrators (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin (Password: Rohit@075)
INSERT INTO administrators (username, password_hash)
VALUES ('admin_rohit', SHA2('Rohit@075', 256));

-- 2. Items Master Table (Active Lost & Found Items)
CREATE TABLE IF NOT EXISTS campus_items (
    item_id VARCHAR(50) PRIMARY KEY,
    type ENUM('LOST', 'FOUND') NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    reporter_or_founder_name VARCHAR(100) NOT NULL,
    contact_phone_or_email VARCHAR(100) NOT NULL,
    meeting_handoff_spot VARCHAR(150),
    secret_question_or_proof TEXT NOT NULL,
    public_description TEXT NOT NULL,
    image_base64 LONGTEXT,
    status ENUM('ACTIVE', 'RECLAIMED') DEFAULT 'ACTIVE',
    date_registered DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Claims & Ownership Verification Pass Table
CREATE TABLE IF NOT EXISTS verification_claims (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(50) NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_phone VARCHAR(50) NOT NULL,
    submitted_answer TEXT NOT NULL,
    generated_claim_code VARCHAR(50) UNIQUE NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES campus_items(item_id) ON DELETE CASCADE
);

-- 4. Restored History Archives Table
CREATE TABLE IF NOT EXISTS archived_history (
    archive_id INT AUTO_INCREMENT PRIMARY KEY,
    item_title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    founder_name VARCHAR(100) NOT NULL,
    restored_owner_name VARCHAR(100) NOT NULL,
    verification_code VARCHAR(50) NOT NULL,
    restored_date DATE NOT NULL,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- TRIGGERS: Automatic Archiving on Verification Approval
-- ====================================================================

DELIMITER //
CREATE TRIGGER trigger_archive_claimed_item
AFTER INSERT ON verification_claims
FOR EACH ROW
BEGIN
    DECLARE v_title VARCHAR(150);
    DECLARE v_category VARCHAR(50);
    DECLARE v_founder VARCHAR(100);

    -- Get Active Item Info
    SELECT title, category, reporter_or_founder_name 
    INTO v_title, v_category, v_founder
    FROM campus_items
    WHERE item_id = NEW.item_id;

    -- Archive into History Log
    INSERT INTO archived_history (item_title, category, founder_name, restored_owner_name, verification_code, restored_date)
    VALUES (v_title, v_category, v_founder, NEW.claimant_name, NEW.generated_claim_code, CURDATE());

    -- Update Active Item Status
    UPDATE campus_items SET status = 'RECLAIMED' WHERE item_id = NEW.item_id;
END;
//
DELIMITER ;
