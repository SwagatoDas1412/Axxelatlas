USE axxelatlas;

-- Optional: clear old seed data if you want repeatable local seeding.
-- Only use this in local/dev, not production.
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE data_requests;
TRUNCATE TABLE continuous_series_rules;
TRUNCATE TABLE product_contract_status;
TRUNCATE TABLE product_data_availability;
TRUNCATE TABLE product_links;
TRUNCATE TABLE products;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users
INSERT INTO users (
    name,
    email,
    password_hash,
    role
) VALUES
(
    'Admin User',
    'admin@axxela.in',
    'temporary_hash_change_later',
    'admin'
),
(
    'Researcher User',
    'researcher@axxela.in',
    'temporary_hash_change_later',
    'researcher'
);

-- Products
INSERT INTO products (
    product_name,
    symbol,
    exchange,
    market,
    asset_class,
    description,
    is_maintained,
    has_databento_support,
    has_massive_support,
    preferred_source,
    maintainer,
    status
) VALUES
(
    'E-mini S&P 500 Futures',
    'ES',
    'CME',
    'US Equities',
    'Index Futures',
    'E-mini S&P 500 futures contract.',
    TRUE,
    TRUE,
    FALSE,
    'internal_db',
    'QuantTeam',
    'active'
),
(
    'E-mini Nasdaq-100 Futures',
    'NQ',
    'CME',
    'US Equities',
    'Index Futures',
    'E-mini Nasdaq-100 futures contract.',
    TRUE,
    TRUE,
    FALSE,
    'internal_db',
    'QuantTeam',
    'active'
),
(
    'Crude Oil Futures',
    'CL',
    'NYMEX',
    'Energy',
    'Commodity Futures',
    'WTI crude oil futures contract.',
    TRUE,
    TRUE,
    FALSE,
    'internal_db',
    'QuantTeam',
    'active'
);

-- Data availability
INSERT INTO product_data_availability (
    product_id,
    data_type,
    granularity,
    source,
    start_date,
    end_date,
    update_frequency,
    last_verified_at,
    notes
) VALUES
(
    1,
    'ohlcv',
    '1m',
    'internal_db',
    '2018-01-01',
    NULL,
    'daily',
    NOW(),
    'Primary research-ready minute data.'
),
(
    1,
    'trades',
    'tick',
    'databento',
    '2012-01-01',
    NULL,
    'daily',
    NOW(),
    'Available externally through Databento.'
),
(
    2,
    'ohlcv',
    '1m',
    'internal_db',
    '2018-01-01',
    NULL,
    'daily',
    NOW(),
    'Primary research-ready minute data.'
),
(
    3,
    'settlement',
    'daily',
    'internal_db',
    '2010-01-01',
    NULL,
    'daily',
    NOW(),
    'Daily settlement data available.'
);

-- Product links
INSERT INTO product_links (
    product_id,
    link_type,
    title,
    url
) VALUES
(
    1,
    'contract_specs',
    'CME ES Contract Specs',
    'https://www.cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html'
),
(
    2,
    'contract_specs',
    'CME NQ Contract Specs',
    'https://www.cmegroup.com/markets/equities/nasdaq/e-mini-nasdaq-100.contractSpecs.html'
),
(
    3,
    'contract_specs',
    'CME CL Contract Specs',
    'https://www.cmegroup.com/markets/energy/crude-oil/light-sweet-crude.contractSpecs.html'
);

-- Active contract status
INSERT INTO product_contract_status (
    product_id,
    active_contract,
    active_contract_expiry,
    next_contract,
    next_contract_expiry,
    days_to_expiry,
    last_roll_date,
    next_expected_roll_date,
    source,
    last_updated_at,
    notes
) VALUES
(
    1,
    'ESU26',
    '2026-09-18',
    'ESZ26',
    '2026-12-18',
    NULL,
    NULL,
    NULL,
    'manual_seed',
    NOW(),
    'Sample active contract data. Replace later with actual contract calendar logic.'
),
(
    2,
    'NQU26',
    '2026-09-18',
    'NQZ26',
    '2026-12-18',
    NULL,
    NULL,
    NULL,
    'manual_seed',
    NOW(),
    'Sample active contract data. Replace later with actual contract calendar logic.'
),
(
    3,
    'CLQ26',
    '2026-07-21',
    'CLU26',
    '2026-08-20',
    NULL,
    NULL,
    NULL,
    'manual_seed',
    NOW(),
    'Sample active contract data. Replace later with actual contract calendar logic.'
);

-- Continuous series rules
INSERT INTO continuous_series_rules (
    product_id,
    rule_name,
    roll_method,
    roll_days_before_expiry,
    adjustment_method,
    description,
    notes
) VALUES
(
    1,
    'Default ES Continuous Rule',
    'volume',
    NULL,
    'back_adjusted',
    'Roll when next contract volume exceeds front contract volume.',
    'Confirm final production rule later.'
),
(
    2,
    'Default NQ Continuous Rule',
    'volume',
    NULL,
    'back_adjusted',
    'Roll when next contract volume exceeds front contract volume.',
    'Confirm final production rule later.'
),
(
    3,
    'Default CL Continuous Rule',
    'fixed_days',
    5,
    'back_adjusted',
    'Roll fixed number of business days before expiry.',
    'Confirm final production rule later.'
);

-- Sample data request
INSERT INTO data_requests (
    request_id,
    user_id,
    product_id,
    request_type,
    data_type,
    granularity,
    start_date,
    end_date,
    priority,
    status,
    description,
    admin_notes,
    assigned_to
) VALUES
(
    'REQ-000001',
    2,
    1,
    'backfill',
    'ohlcv',
    '1m',
    '2015-01-01',
    '2017-12-31',
    'medium',
    'submitted',
    'Need ES 1-minute OHLCV backfill before 2018 for research.',
    NULL,
    NULL
);