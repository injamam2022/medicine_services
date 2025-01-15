const { getFacility, createFacility,facilityById,updateFacility,deleteFacility, } = require("../controller/facilityController");
const { authentication } = require("../controller/authController");
const router = require("express").Router();

router.route("/").get(getFacility);
router.route("/create").post(authentication, createFacility);
router
    .route('/:id')
    .get(authentication, facilityById)
    .patch(authentication, updateFacility)
    .delete(authentication ,deleteFacility);

module.exports = router;
