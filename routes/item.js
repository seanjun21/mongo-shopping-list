var express = require('express');
var Item = require('../services/item');
var router = express.Router();
// static routes
router.get('/items', function(request, response) {
    Item.list(function(err, items) {
        if (err) {
            return response.status(400).json(err);
        }
        response.json(items);
    });
});

router.post('/items', function(request, response) {
    Item.save(request.body.name, function(err, item) {
        if (err) {
            return response.status(400).json(err);
        }
        response.status(201).json(item);
    });
});

// dynamic routes
router.get('/items/:id', function(request, response) {
    Item.lookUp(request.params.id, function(err, item) {
        if (err) {
            return response.status(400).json(err);
        }
        response.json(item);
    });
});

router.put('/items/:id', function(request, response) {
    Item.update(request.params.id, request.body.name, function(err, item) {
        if (err) {
            return response.status(400).json(err);
        }
        response.json(item);
    });
});

router.delete('/items/:id', function(request, response) {
    Item.del(request.params.id, function(err, items) {
        if (err) {
            return response.status(400).json(err);
        }
        response.json(items);
    });
});
module.exports = router;