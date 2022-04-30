const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const {createServer} = require('http');
const cors = require('cors');
require('dotenv').config({path: __dirname + '/../.env'});
const Inventory = require('./model/Inventory');

const app = express();
app.use(body_parser.json());

// Add cors origin frontend
app.use(cors({origin: "http://localhost:3000"}));

// Log incoming requests
app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

// Database connection
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database connected successfully...");
    })
    .catch((error) => {
        console.log(error);
    });

// Create Inventory item
// Request body -> {'product': product name, 'amount': total left}
app.post("/api/createInventory/", (req, res) => {
    if(!('product' in req.body))
    {
        return res.status(400).json({error: "No product sent in the body"});
    }
    if(!('amount' in req.body))
    {
        return res.status(400).json({error: "No amount sent in the body"});
    }
    
    let productItem = req.body.product;
    let amountItem = req.body.amount;
    const item = new Inventory({
        product: productItem,
        amount: amountItem
    });

    item
        .save()
        .then((inventory) => {
            return res.status(200).json(inventory);
        })
        .catch((error) => {
            console.log(err);
            return res.status(500).json({error: error});
        });
});

// Get non-deleted inventory items
// Request body -> {'pageIndex': page index to retrieve 10 items}
app.get("/api/inventory", (req, res) => {
    if(!('pageIndex' in req.query))
    {
        return res.status(400).json({error: "No pageIndex sent in the body"});
    }
    let skipPages = (req.query.pageIndex * 10) - 10;
    Inventory.find({})
        .skip(skipPages)
        .limit(10)
        .sort({createdAt: -1})
        .then((items) => {
            if(!items) return res.status(404).json({message: "No inventory found"});
            if(items.length === 0) return res.status(404).json({message: "No items in inventory found"});
            let products = [];
            for(let i = 0; i < items.length; i++)
            {
                if(!(items[i].delete))
                {
                    products.push(items[i]);
                }
            }

            return res.status(200).json(products);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err}); 
        });
});

// Get deleted inventory items
// Request body -> {'pageIndex': page index to retrieve 10 items}
app.get("/api/deleted/inventory", (req, res) => {
    if(!('pageIndex' in req.query))
    {
        return res.status(400).json({error: "No pageIndex sent in the body"});
    }
    let skipPages = (req.query.pageIndex * 10) - 10;
    Inventory.find({})
        .skip(skipPages)
        .limit(10)
        .sort({createdAt: -1})
        .then((items) => {
            if(!items) return res.status(404).json({message: "No inventory found"});
            if(items.length === 0) return res.status(404).json({message: "No items in inventory found"});
            let deletedProducts = [];
            for(let i = 0; i < items.length; i++)
            {
                if(items[i].delete)
                {
                    deletedProducts.push(items[i]);
                }
            }

            return res.status(200).json(deletedProducts);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err}); 
        });
});

// Update inventory items
// Request body -> {productId: product id, 'product': product name}
app.patch('/api/update/product/', (req, res) => {
    if(!('productId' in req.body))
    {
        return res.status(400).json({error: "No product ID sent in the body"});
    }
    if(!('product' in req.body))
    {
        return res.status(400).json({error: "No product sent in the body"});
    }
    if(!('amount' in req.body))
    {
        return res.status(400).json({error: "No amount sent in the body"});
    }

    let productId = req.body.productId;
    let productItem = req.body.product;
    let amountItem = parseInt(req.body.amount);
    if (productItem !== null && productItem !== undefined && productItem !== "")
    {
        if(amountItem !== null && amountItem !== undefined && amountItem >= 0)
        {
            // Update product item inventory
            Inventory.updateOne({_id: productId}, {product: productItem, amount: amountItem})
                .exec()
                .then(() => {
                    return res.status(200).json({message: "Product update successful"})
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({error: err});
                });
        }
    }
    else
    {
        return res.status(400).json({error: "Product should not be null, undefined or empty string"});
    }
});

// Update delete of item
// Request body -> {productId: product id, delete: true, deleteComment: why item is deleted}
app.patch('/api/update/delete/', (req, res) => {
    if(!('productId' in req.body))
    {
        return res.status(400).json({error: "No product ID sent in the body"});
    }
    if(!('delete' in req.body))
    {
        return res.status(400).json({error: "No delete sent in the body"});
    }
    if(!('deleteComment' in req.body))
    {
        return res.status(400).json({error: "No delete comment sent in the body"});
    }

    let comment = req.body.deleteComment;
    if (comment !== null && comment !== undefined)
    {
        Inventory.updateOne({_id: req.body.productId}, {delete: req.body.delete, deleteComment: comment})
            .exec()
            .then(() => {
                return res.status(200).json({message: "Item deleted successfully"});
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({error: err});
            });
    }
});

// Permanently delete item
// Request body -> {productId: product id}
app.delete('/api/delete/:itemId/', (req, res) => {
    if(req.params.itemId === null || req.params.itemId === undefined)
    {
        return res.status(400).json({error: "No product ID sent in the body"});
    }

    Inventory.deleteOne({_id: req.params.itemId})
        .then((item) => {
            if(item.deletedCount === 0)
            {
                return res.status(404).json({message: "Item not found"}); 
            }
            return res.status(200).json({message: "Item permanently deleted"});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err});
        });
});

app.use(express.static('../frontend'));

const PORT = process.env.PORT || 5000;
createServer(app).listen(PORT, function(err){
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});