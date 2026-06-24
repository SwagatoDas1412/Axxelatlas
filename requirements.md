# Researcher Product Data Tool

## Objective

Build an internal researcher-facing tool to discover product-level data availability, maintenance status, data sources, product metadata, active contracts, expiry information, and submit/track data requests.

## User Roles

### Researcher

Can:
- View product catalog
- View product detail pages
- View active contract and expiry information
- Submit data requests
- View own request history

Cannot:
- Access Admin Panel
- Edit product metadata
- Change request statuses

### Admin

Can:
- Access everything a researcher can
- View Admin Panel
- Add/edit products
- Update data availability
- Update Databento/Massive/internal source support
- Update active contract and expiry metadata
- Add CME/vendor/exchange links
- Edit continuous series rules
- View and manage all data requests

## MVP Features

1. Login
2. Role-based access: researcher/admin
3. Product catalog page
4. Product detail page
5. Data availability table
6. Product links section
7. Continuous series rule section
8. Current active contract and nearest expiry section
9. Data request form
10. My Requests page
11. Admin Panel
12. Admin product management
13. Admin request management


## Pages

### Researcher Pages

- /login
- /products
- /products/:productId
- /requests

### Admin Pages

- /admin
- /admin/products
- /admin/products/:productId/edit
- /admin/requests


