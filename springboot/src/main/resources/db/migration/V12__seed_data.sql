DO $$
DECLARE
    -- Institute IDs
    inst_1 UUID := gen_random_uuid();
    inst_2 UUID := gen_random_uuid();
    inst_3 UUID := gen_random_uuid();
    inst_4 UUID := gen_random_uuid();
    inst_5 UUID := gen_random_uuid();

    -- Rank IDs (fetched from rank_master)
    rank_cadet UUID;
    rank_os UUID;
    rank_ab UUID;
    rank_3o UUID;
    rank_2o UUID;

    -- INDoS Master IDs
    indos_1 UUID := gen_random_uuid();
    indos_2 UUID := gen_random_uuid();
    indos_3 UUID := gen_random_uuid();
    indos_4 UUID := gen_random_uuid();
    indos_5 UUID := gen_random_uuid();

    -- Pre-Sea Course IDs
    course_1 UUID := gen_random_uuid();
    course_2 UUID := gen_random_uuid();
    course_3 UUID := gen_random_uuid();
    course_4 UUID := gen_random_uuid();
    course_5 UUID := gen_random_uuid();

    -- Enrollment IDs
    enroll_1 UUID := gen_random_uuid();
    enroll_2 UUID := gen_random_uuid();
    enroll_3 UUID := gen_random_uuid();
    enroll_4 UUID := gen_random_uuid();
    enroll_5 UUID := gen_random_uuid();

    -- Company IDs
    comp_1 UUID := gen_random_uuid();
    comp_2 UUID := gen_random_uuid();
    comp_3 UUID := gen_random_uuid();
    comp_4 UUID := gen_random_uuid();
    comp_5 UUID := gen_random_uuid();

    -- Vessel IDs
    vessel_1 UUID := gen_random_uuid();
    vessel_2 UUID := gen_random_uuid();
    vessel_3 UUID := gen_random_uuid();
    vessel_4 UUID := gen_random_uuid();
    vessel_5 UUID := gen_random_uuid();

    -- Berth IDs
    berth_1 UUID := gen_random_uuid();
    berth_2 UUID := gen_random_uuid();
    berth_3 UUID := gen_random_uuid();
    berth_4 UUID := gen_random_uuid();
    berth_5 UUID := gen_random_uuid();

    -- Berth Allocation IDs
    balloc_1 UUID := gen_random_uuid();
    balloc_2 UUID := gen_random_uuid();
    balloc_3 UUID := gen_random_uuid();
    balloc_4 UUID := gen_random_uuid();
    balloc_5 UUID := gen_random_uuid();

    -- Berth Seafarer Allocation IDs
    bsalloc_1 UUID := gen_random_uuid();
    bsalloc_2 UUID := gen_random_uuid();
    bsalloc_3 UUID := gen_random_uuid();
    bsalloc_4 UUID := gen_random_uuid();
    bsalloc_5 UUID := gen_random_uuid();

BEGIN
    -- 1. Fetch Rank IDs
    SELECT id INTO rank_cadet FROM rank_master WHERE name = 'Deck Cadet' LIMIT 1;
    SELECT id INTO rank_os FROM rank_master WHERE name = 'Ordinary Seaman' LIMIT 1;
    SELECT id INTO rank_ab FROM rank_master WHERE name = 'Able Seaman' LIMIT 1;
    SELECT id INTO rank_3o FROM rank_master WHERE name = 'Third Officer' LIMIT 1;
    SELECT id INTO rank_2o FROM rank_master WHERE name = 'Second Officer' LIMIT 1;

    -- 2. Insert Institutes
    INSERT INTO institute (id, name) VALUES
        (inst_1, 'Maritime Training Academy'),
        (inst_2, 'Oceanic Studies Institute'),
        (inst_3, 'Global Marine College'),
        (inst_4, 'Pacific Seafarers School'),
        (inst_5, 'International Shipping Institute');

    -- 3. Insert INDoS Master records
    INSERT INTO indos_master (id, indos, first_name, rank_id, is_active) VALUES
        (indos_1, '11AA123', 'John', rank_cadet, true),
        (indos_2, '22BB234', 'David', rank_os, true),
        (indos_3, '33CC345', 'Robert', rank_ab, true),
        (indos_4, '44DD456', 'Michael', rank_3o, true),
        (indos_5, '55EE567', 'William', rank_2o, true);

    -- 4. Insert Pre-Sea Courses
    INSERT INTO pre_sea_courses (id, name, is_active, start_date, institute_id) VALUES
        (course_1, 'General Purpose Rating', true, '2026-09-01', inst_1),
        (course_2, 'Diploma in Nautical Science', true, '2026-10-01', inst_2),
        (course_3, 'B.Sc. Nautical Technology', true, '2026-09-15', inst_3),
        (course_4, 'Pre-sea Graduate Marine Engineering', true, '2026-11-01', inst_4),
        (course_5, 'Electro Technical Officer Course', true, '2026-12-01', inst_5);

    -- 5. Insert Enrollments
    INSERT INTO enrollment (id, pre_sea_course_id, indos_master_id, status, remarks) VALUES
        (enroll_1, course_1, indos_1, 'COMPLETED', 'Excellent performance'),
        (enroll_2, course_2, indos_2, 'COMPLETED', 'Cleared all exams'),
        (enroll_3, course_3, indos_3, 'COMPLETED', 'Top of the class'),
        (enroll_4, course_4, indos_4, 'COMPLETED', 'Completed practical training'),
        (enroll_5, course_5, indos_5, 'COMPLETED', 'Certified successfully');

    -- 6. Insert Companies
    INSERT INTO company (id, name, registration_no, is_active) VALUES
        (comp_1, 'Apex Shipping Line', 'REG-10001', true),
        (comp_2, 'Vanguard Maritime Group', 'REG-10002', true),
        (comp_3, 'Blue Water Carriers', 'REG-10003', true),
        (comp_4, 'Horizon Shipping Ltd', 'REG-10004', true),
        (comp_5, 'Stellar Marine services', 'REG-10005', true);

    -- 7. Insert Vessels
    INSERT INTO vessel (id, imo, name, flag, is_active, company_id) VALUES
        (vessel_1, 'IMO9123456', 'Apex Voyager', 'Panama', true, comp_1),
        (vessel_2, 'IMO9234567', 'Vanguard Pioneer', 'Singapore', true, comp_2),
        (vessel_3, 'IMO9345678', 'Blue Horizon', 'Liberia', true, comp_3),
        (vessel_4, 'IMO9456789', 'Horizon Explorer', 'Marshall Islands', true, comp_4),
        (vessel_5, 'IMO9567890', 'Stellar Quest', 'Bahamas', true, comp_5);

    -- 8. Insert Berths
    INSERT INTO berth (id, berth_name, is_active) VALUES
        (berth_1, 'Berth North-01', true),
        (berth_2, 'Berth North-02', true),
        (berth_3, 'Berth South-01', true),
        (berth_4, 'Berth East-01', true),
        (berth_5, 'Berth West-02', true);

    -- 9. Insert Berth Allocations
    INSERT INTO berth_allocation (id, berth_id, vessel_id, start_date, end_date) VALUES
        (balloc_1, berth_1, vessel_1, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (balloc_2, berth_2, vessel_2, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (balloc_3, berth_3, vessel_3, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (balloc_4, berth_4, vessel_4, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (balloc_5, berth_5, vessel_5, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00');

    -- 10. Insert Berth Seafarer Allocations
    INSERT INTO berth_seafarer_allocation (id, berth_id, indos_master_id, berth_allocation_id, start_date, end_date) VALUES
        (bsalloc_1, berth_1, indos_1, balloc_1, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (bsalloc_2, berth_2, indos_2, balloc_2, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (bsalloc_3, berth_3, indos_3, balloc_3, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (bsalloc_4, berth_4, indos_4, balloc_4, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00'),
        (bsalloc_5, berth_5, indos_5, balloc_5, '2026-08-01 08:00:00+00', '2026-08-05 18:00:00+00');

    -- 11. Insert Contracts
    INSERT INTO contract (id, indos_master_id, company_id, enrollment_id, berth_seafarer_allocation_id, status, sign_on_date, sign_on_port, sign_on_country, sign_off_date, sign_off_port, sign_off_country) VALUES
        (gen_random_uuid(), indos_1, comp_1, enroll_1, bsalloc_1, 'ACTIVE', '2026-08-01 08:00:00+00', 'Mumbai', 'India', '2027-02-01 08:00:00+00', 'Rotterdam', 'Netherlands'),
        (gen_random_uuid(), indos_2, comp_2, enroll_2, bsalloc_2, 'ACTIVE', '2026-08-01 08:00:00+00', 'Singapore', 'Singapore', '2027-02-01 08:00:00+00', 'Houston', 'USA'),
        (gen_random_uuid(), indos_3, comp_3, enroll_3, bsalloc_3, 'ACTIVE', '2026-08-01 08:00:00+00', 'Shanghai', 'China', '2027-02-01 08:00:00+00', 'Antwerp', 'Belgium'),
        (gen_random_uuid(), indos_4, comp_4, enroll_4, bsalloc_4, 'ACTIVE', '2026-08-01 08:00:00+00', 'Pusan', 'South Korea', '2027-02-01 08:00:00+00', 'Hamburg', 'Germany'),
        (gen_random_uuid(), indos_5, comp_5, enroll_5, bsalloc_5, 'ACTIVE', '2026-08-01 08:00:00+00', 'Tokyo', 'Japan', '2027-02-01 08:00:00+00', 'Le Havre', 'France');

END $$;
