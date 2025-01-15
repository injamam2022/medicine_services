const { getRole, createRole,roleById,updateRole,deleteRole, } = require("../controller/roleController");
const { authentication } = require("../controller/authController");
const router = require("express").Router();

router.route("/").get(getRole);
router.route("/create").post(authentication, createRole);
router
    .route('/:id')
    .get(authentication, roleById)
    .patch(authentication, updateRole)
    .delete(authentication ,deleteRole);

module.exports = router;
