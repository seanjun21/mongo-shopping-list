var express = require('express');
var Item = require('../services/item');
var router = express.Router();
// static routes
router.get('/items', function(req, res) {
    Item.list(function(err, items) {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(items);
    });
});

router.post('/items', function(req, res) {
    Item.save(req.body.name, function(err, item) {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(201).json(item);
    });
});
// dynamic routes
router.put('/items/:id', function(req, res) {
    Item.update(req.params.id, req.body.name, function(err, items) {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(items);
    });
});

router.delete('/items/:id', function(req, res) {
    Item.del(req.params.id, function(err, items) {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(items);
    });
});
module.exports = router;