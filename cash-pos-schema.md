## System Overview

This document defines the **MongoDB schema structure** for a simple **cash-based Point of Sale (POS)** system.

System characteristics:

* Single store
* Cash payments only
* Inventory tracked per product
* Staff users (cashiers/admin)
* Receipt-based transactions
* Daily cash sessions

The system will be integrated into a **MERN stack application**, while **database queries are executed via n8n workflows**.

The database design prioritizes:

* Simple structure
* Fast product lookup (barcode scanning)
* Embedded sale items
* Easy reporting

---

# Collections

The database contains the following collections:

```
categories
products
users
sales
cash_sessions
```

---

# 1. Categories Collection

Used to group products for POS UI display.

## Document Structure

```
categories
{
  _id: ObjectId
  name: String
  createdAt: Date
  updatedAt: Date
}
```

## Example

```
{
  "_id": ObjectId("..."),
  "name": "Beverages",
  "createdAt": ISODate(),
  "updatedAt": ISODate()
}
```

---

# 2. Products Collection

Represents items that can be sold.

## Document Structure

```
products
{
  _id: ObjectId
  name: String
  barcode: String
  sku: String
  categoryId: ObjectId

  price: Number
  cost: Number

  stockQuantity: Number
  reorderLevel: Number

  isActive: Boolean

  createdAt: Date
  updatedAt: Date
}
```

## Example

```
{
  "_id": ObjectId("..."),
  "name": "Coca Cola 500ml",
  "barcode": "6001234567890",
  "sku": "COC500",
  "categoryId": ObjectId("..."),

  "price": 15.99,
  "cost": 10.50,

  "stockQuantity": 120,
  "reorderLevel": 20,

  "isActive": true,

  "createdAt": ISODate(),
  "updatedAt": ISODate()
}
```

---

# 3. Users Collection

Represents staff members using the POS system.

## Document Structure

```
users
{
  _id: ObjectId
  name: String
  email: String
  passwordHash: String

  role: String

  isActive: Boolean

  createdAt: Date
}
```

## Allowed Roles

```
admin
cashier
```

## Example

```
{
  "_id": ObjectId("..."),
  "name": "Jane Smith",
  "email": "jane@store.com",
  "passwordHash": "...",

  "role": "cashier",
  "isActive": true,

  "createdAt": ISODate()
}
```

---

# 4. Sales Collection

Represents completed POS transactions.

Each sale contains an **embedded list of items purchased**.

Embedding line items avoids joins and improves query speed.

## Document Structure

```
sales
{
  _id: ObjectId

  receiptNumber: String

  cashierId: ObjectId
  cashSessionId: ObjectId

  items: [
    {
      productId: ObjectId
      name: String
      price: Number
      quantity: Number
      total: Number
    }
  ]

  subtotal: Number
  tax: Number
  total: Number

  paymentMethod: String

  createdAt: Date
}
```

## Example

```
{
  "_id": ObjectId("..."),

  "receiptNumber": "POS-000102",

  "cashierId": ObjectId("..."),
  "cashSessionId": ObjectId("..."),

  "items": [
    {
      "productId": ObjectId("..."),
      "name": "Coca Cola 500ml",
      "price": 15.99,
      "quantity": 2,
      "total": 31.98
    }
  ],

  "subtotal": 31.98,
  "tax": 0,
  "total": 31.98,

  "paymentMethod": "cash",

  "createdAt": ISODate()
}
```

---

# 5. Cash Sessions Collection

Represents a cashier’s shift.

Used for reconciling the register at the end of the shift.

## Document Structure

```
cash_sessions
{
  _id: ObjectId

  cashierId: ObjectId

  openingFloat: Number

  expectedCash: Number
  closingCash: Number

  openedAt: Date
  closedAt: Date

  status: String
}
```

## Allowed Status Values

```
open
closed
```

## Example

```
{
  "_id": ObjectId("..."),

  "cashierId": ObjectId("..."),

  "openingFloat": 500,

  "expectedCash": 3200,
  "closingCash": 3180,

  "openedAt": ISODate(),
  "closedAt": ISODate(),

  "status": "closed"
}
```

---

# Required Indexes

Indexes are necessary for POS speed and barcode scanning.

## Products

```
barcode index
```

```
db.products.createIndex({ barcode: 1 })
```

Optional:

```
db.products.createIndex({ name: "text" })
```

---

## Sales

```
db.sales.createIndex({ createdAt: -1 })
db.sales.createIndex({ receiptNumber: 1 })
db.sales.createIndex({ cashierId: 1 })
```

---

## Cash Sessions

```
db.cash_sessions.createIndex({ cashierId: 1 })
db.cash_sessions.createIndex({ openedAt: -1 })
```

---

# Core POS Operations

These operations should be implemented through **n8n workflows**.

---

# Operation: Lookup Product by Barcode

Query:

```
products.findOne({
  barcode: <barcode>,
  isActive: true
})
```

Purpose:

Used by the POS UI when scanning items.

---

# Operation: Create Sale

Steps:

1. Receive cart items
2. Calculate totals
3. Insert sale document
4. Decrease product stock

Insert:

```
sales.insertOne(saleDocument)
```

---

# Operation: Reduce Inventory

For each item sold:

```
products.updateOne(
  { _id: productId },
  { $inc: { stockQuantity: -quantity } }
)
```

---

# Operation: Open Cash Session

```
cash_sessions.insertOne({
  cashierId,
  openingFloat,
  status: "open",
  openedAt: new Date()
})
```

---

# Operation: Close Cash Session

```
cash_sessions.updateOne(
  { _id: sessionId },
  {
    $set: {
      closingCash,
      status: "closed",
      closedAt: new Date()
    }
  }
)
```

---

# Operation: Sales Reporting

Example daily sales query:

```
sales.find({
  createdAt: {
    $gte: startOfDay,
    $lt: endOfDay
  }
})
```

---

# Receipt Number Format

Recommended format:

```
POS-000001
POS-000002
POS-000003
```

This can be generated using:

* an incremental counter
* a workflow in n8n

---

# Recommended API Structure (MERN)

The frontend should call backend endpoints that trigger **n8n workflows**.

Example endpoints:

```
GET /products
GET /products/barcode/:barcode

POST /sales

POST /sessions/open
POST /sessions/close
```

---

# Future Extensions

This schema can be extended later to support:

```
card payments
refunds
customers
inventory adjustments
suppliers
purchase orders
multi-store POS
tax rules
discounts
```

---
