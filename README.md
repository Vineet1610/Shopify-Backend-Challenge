# Shopify-Backend-Challenge
## API Documentation
### Create:
- **route**: /api/createInventory/
- **description**: Add inventory item to DB
- **request**: POST /api/createInventory/
    - **content-type**: application/json
    - **body**: object
        - **product**: product name
        - **amount**:  total amount of product left in inventory
- **response**: status code 200
    - **content-type**: application/json
    - **body**: Item added successfully
        - **product**: product name
        - **amount**:  total amount of product left in inventory

### Read:
- **route**: /api/inventory
- **description**: Get the non-deleted items from the DB (paginated with 10 items per index)
- **request**: GET /api/inventory
    - **content-type**: application/json
    - **query parameters**: 
        - **pageIndex**: An integer to know which items to send to frontend
- **response**: status code 200
    - **body**: 
        - **product**: product name
        - **amount**:  total amount of product left in inventory
        - **_id_**: product id
        - **updatedAt**: date at which the item was last updated

- **route**: /api/deleted/inventory
- **description**: Get the deleted items from DB (paginated with 10 items per index) for recently deleted
- **request**: GET /api/deleted/inventory
    - **content-type**: application/json
    - **query parameters**: 
        - **pageIndex**: An integer to know which items to send to frontend
- **response**: status code 200
    - **body**: 
        - **product**: product name
        - **amount**:  total amount of product left in inventory
        - **_id_**: product id

### Update:
- **route**: /api/update/product/
- **description**: Update the amount or product name
- **request**: PATCH /api/update/product/
    - **content-type**: application/json
    - **body**: object
        - **productId**: id of product
        - **product**: product name
        - **amount**:  total amount of product left in inventory
- **response**: status code 200
    - **body**: Product update successful

- **route**: /api/update/delete/
- **description**: Item deleted from inventory now added to recently deleted list along with comments
- **request**: PATCH /api/update/delete/
    - **content-type**: application/json
    - **body**: object
        - **productId**: id of product
        - **delete**: bool set to true
        - **deleteComment**:  Reason for deletion
- **response**: status code 200
    - **body**: Item deleted successfully

### Delete:
- **route**: /api/delete/:itemId/
- **description**: Permanently delete item from DB
- **request**: DELETE /api/delete/:itemId/
    - **content-type**: application/json
    - **params**:
        - **itemId**: id of product
- **response**: status code 200
    - **body**: Item permenantely deleted

## Instruction on how to test backend APIs
- Frontend not available for all APIs so test the APIs using Postman by following this documentation and comments on code
- App deployed on Replit but not working due to frontend not done completely so can use it on localhost at port 3000. First run "node server.js" and then open localhost:3000