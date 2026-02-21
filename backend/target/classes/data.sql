-- AyurSutra Seed Data for H2
-- Password for all users: password123 (BCrypt encoded: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)

-- Insert Practitioner
INSERT INTO users (name, email, password, role) VALUES ('Dr. Arjun Sharma', 'arjun@ayursutra.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PRACTITIONER');

-- Insert Patients
INSERT INTO users (name, email, password, role) VALUES ('Priya Patel', 'priya@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT');
INSERT INTO users (name, email, password, role) VALUES ('Rahul Verma', 'rahul@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT');

-- Create Patient Profiles (since H2 cleans every time, we can use static IDs if we match the insertion order)
-- User IDs in H2 will be 1, 2, 3
INSERT INTO patient_profiles (user_id, prakriti, notes) VALUES (2, 'Vata-Pitta', 'Chronic back pain, looking for detoxification.');
INSERT INTO patient_profiles (user_id, prakriti, notes) VALUES (3, 'Kapha', 'Digestive issues and lethargy.');

-- Create a Therapy Plan for Priya
INSERT INTO therapy_plans (patient_id, practitioner_id, phase, description, start_date) 
VALUES (2, 1, 'PURVAKARMA', 'Initial detoxification and oil massage phase.', CURRENT_DATE);

-- Create a Session for Priya
INSERT INTO therapy_sessions (therapy_plan_id, procedure_name, scheduled_date, status, notes)
VALUES (1, 'Abhyanga (Oil Massage)', CURRENT_TIMESTAMP, 'SCHEDULED', 'Ensure the oil is warm.');
