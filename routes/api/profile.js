const express = require('express');
const router = express.Router();

// @route GET api/profile/test
// @desc Tets profile route
// @access  Public

router.get('/test', (req, res)=>{
    res.json({
        msg: "users works"
    })
});

module.exports = router;