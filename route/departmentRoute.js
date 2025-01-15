const { getdepartment, createdepartment,departmentById,updatedepartment,deletedepartment,departmentWiseRole } = 
require("../controller/departmentController");
const { authentication } = require("../controller/authController");
const router = require("express").Router();

router.route("/").get(getdepartment);
router.route("/create").post(authentication, createdepartment);
router
    .route('/:id')
    .get(authentication, departmentById)
    .patch(authentication, updatedepartment)
    .delete(authentication ,deletedepartment);

router
    .route('/roles/:id')
    .get(authentication, departmentWiseRole)

module.exports = router;
