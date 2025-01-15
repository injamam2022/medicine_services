const { createAccess,getAccess,getModuleAccess,getChangeLogs } = require('../controller/accessController');
const { authentication } = require('../controller/authController');
const router = require('express').Router();

router.route('/add-update').post(authentication,createAccess);
router
    .route('/:id')
    .get(authentication, getAccess)

router
    .route('/module/:id')
    .get(authentication, getModuleAccess)

router
    .route('/change-logs/:id')
    .get(authentication, getChangeLogs)

module.exports = router;

