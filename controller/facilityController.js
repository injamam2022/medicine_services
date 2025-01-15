const { Sequelize } = require("sequelize");
const facility = require("../db/models/facility");
const catchAsync = require("../utils/catchAsync");
const changeLog = require('../db/models/changelog');
const constant = require('../constants/constant');
const { retriveToken } = require("./authController");
const department = require("../db/models/department");
const MODULEID = 4;

const getFacility = catchAsync(async (req, res, next) => {
  const facilitys = await facility.findAndCountAll();
  return res.status(200).json({
    status: "success",
    data: facilitys,
  });
});

const createFacility = catchAsync(async (req, res, next) => {
  const body = req.body;
  const createNewFacility = await facility.create(body);
  let idToken = '';
  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ) {
      // Bearer asfdasdfhjasdflkkasdf
      idToken = req.headers.authorization.split(' ')[1];
  }
  const tokenDetails = retriveToken(idToken);
  await changeLog.create({
    userId:tokenDetails.id,
    moduleId:constant.MODULE[MODULEID].id,
    changes:{
        action:`${constant.ADD} ${constant.MODULE[MODULEID].name}`,
        change:constant.ADD,
        changeTime:new Date()
    }
  });

  return res.status(201).json({
    status: "success",
    data: createNewFacility,
  });
});

const facilityById = catchAsync(async (req, res, next) => {
  const facilityId = req.params.id;
  const result = await facility.findByPk(
    facilityId,
    );
  if (!result) {
      return next(new AppError('Invalid facility id', 400));
  }
    return res.json({
        status: 'success',
        data: result,
        
    });
});

const updateFacility = catchAsync(async (req, res, next) => {
  const facilityId = req.params.id;
  const body = req.body;

  const result = await facility.findOne({
      where: { facilityId },
  });

  if (!result) {
      return next(new AppError('Invalid facility id', 400));
  }

  result.locationName = body.locationName;
  result.phone = body.phone;
  result.postcode = body.postcode;
  result.stateId  = body.stateId;
  result.countryId = body.countryId;
  result.city = body.city;


  let idToken = '';
  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ) {
      // Bearer asfdasdfhjasdflkkasdf
      idToken = req.headers.authorization.split(' ')[1];
  }
  const tokenDetails = retriveToken(idToken);
    await changeLog.create({
      userId:tokenDetails.id,
      moduleId:constant.MODULE[MODULEID].id,
      changes:{
          action:`${constant.EDIT} ${constant.MODULE[MODULEID].name}`,
          change:constant.EDIT,
          changeTime:new Date()
      }
  });

   const updatedResult = await result.save();
      return res.json({
          status: 'success',
          data: updatedResult,
      }) 
});

const deleteFacility = catchAsync(async (req, res, next) => {
  const facilityId = req.params.id;

  const result = await facility.findOne({
      where: { facilityId },
  });

  if (!result) {
      return next(new AppError('Invalid id', 400));
  }

  await result.destroy();

  let idToken = '';
  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ) {
      // Bearer asfdasdfhjasdflkkasdf
      idToken = req.headers.authorization.split(' ')[1];
  }
    const tokenDetails = retriveToken(idToken);
      await changeLog.create({
        userId:tokenDetails.id,
        moduleId:constant.MODULE[MODULEID].id,
        changes:{
            action:`${constant.EDIT} ${constant.MODULE[MODULEID].name}`,
            change:constant.EDIT,
            changeTime:new Date()
        }
    });

  return res.json({
      status: 'success',
      message: 'Record deleted successfully',
  });

});

module.exports = { getFacility, createFacility,facilityById,updateFacility, deleteFacility };
