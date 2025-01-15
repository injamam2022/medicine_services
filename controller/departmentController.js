const { Sequelize } = require("sequelize");
const department = require("../db/models/department");
const catchAsync = require("../utils/catchAsync");
const changeLog = require('../db/models/changelog');
const constant = require('../constants/constant');
const { retriveToken } = require("./authController");
const role = require("../db/models/role");
const MODULEID = 0;

const getdepartment = catchAsync(async (req, res, next) => {
  const departments = await department.findAndCountAll();
  return res.status(200).json({
    status: "success",
    data: departments,
  });
});

const createdepartment = catchAsync(async (req, res, next) => {
  const body = req.body;
  const createNewdepartment = await department.create(body);
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
    data: createNewdepartment,
  });
});

const departmentById = catchAsync(async (req, res, next) => {
  const departmentId = req.params.id;
  const result = await department.findByPk(
    departmentId,
    );
  if (!result) {
      return next(new AppError('Invalid department id', 400));
  }
    return res.json({
        status: 'success',
        data: result,
        
    });
});

const departmentWiseRole = catchAsync(async (req, res, next) => {
  const departmentId = req.params.id;
  const result = await role.findAndCountAll(
    {
      where:{departmentId}
    }
    );
  if (!result) {
      return next(new AppError('Invalid id', 400));
  }
    return res.json({
        status: 'success',
        data: result,
        
    });
});

const updatedepartment = catchAsync(async (req, res, next) => {
  const departmentId = req.params.id;
  const body = req.body;

  const result = await department.findOne({
      where: { departmentId: departmentId },
  });

  if (!result) {
      return next(new AppError('Invalid id', 400));
  }

  result.departmentName = body.departmentName;
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

const deletedepartment = catchAsync(async (req, res, next) => {
  const departmentId = req.params.id;

  const result = await department.findOne({
      where: { departmentId: departmentId },
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

module.exports = { getdepartment, createdepartment,departmentById,updatedepartment, deletedepartment,departmentWiseRole };
