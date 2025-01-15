const { authentication, restrictTo } = require('../controller/authController');
const { getAllUser,createUser, getUserById,updateUser,deleteUser} = require('../controller/userController');

const router = require('express').Router();

router.route('/').get(authentication , getAllUser);
router.route('/create').post(authentication, createUser);
router
    .route('/:id')
    .get(authentication, getUserById)
    .patch(authentication, updateUser)
    .delete(authentication ,deleteUser);

module.exports = router;
