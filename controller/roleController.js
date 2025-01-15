const { Sequelize } = require("sequelize");
const role = require("../db/models/role");
const catchAsync = require("../utils/catchAsync");
const changeLog = require('../db/models/changelog');
const constant = require('../constants/constant');
const { retriveToken } = require("./authController");
const department = require("../db/models/department");
const MODULEID = 1;

const getRole = catchAsync(async (req, res, next) => {
  const roles = await role.findAndCountAll(
    {
      attributes: [
            "roleId","roleName",
            [Sequelize.col('department.departmentId'), 'departmentId'],
            [Sequelize.col('department.departmentName'), 'departmentName'],
        ],
        include: [{
            model: department,
            attributes: []
        },
      ],
    }
  );
  return res.status(200).json({
    status: "success",
    data: roles,
  });
});

const createRole = catchAsync(async (req, res, next) => {
  const body = req.body;
  const createNewRole = await role.create(body);
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
    data: createNewRole,
  });
});

const roleById = catchAsync(async (req, res, next) => {
  const roleId = req.params.id;
  const result = await role.findByPk(
    roleId,
      {
        attributes: [
              "roleId","roleName",
              [Sequelize.col('department.departmentId'), 'departmentId'],
              [Sequelize.col('department.departmentName'), 'departmentName'],
          ],
          include: [{
              model: department,
              attributes: []
          },
        ],
      }
    );
  if (!result) {
      return next(new AppError('Invalid role id', 400));
  }
    return res.json({
        status: 'success',
        data: result,
        
    });
});

const updateRole = catchAsync(async (req, res, next) => {
  const roleId = req.params.id;
  const body = req.body;

  const result = await role.findOne({
      where: { roleId: roleId },
  });

  if (!result) {
      return next(new AppError('Invalid role id', 400));
  }

  result.roleName = body.roleName;
  result.departmentId = body.departmentId;
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

const deleteRole = catchAsync(async (req, res, next) => {
  const roleId = req.params.id;

  const result = await role.findOne({
      where: { roleId: roleId },
  });

  if (!result) {
      return next(new AppError('Invalid user id', 400));
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

module.exports = { getRole, createRole,roleById,updateRole, deleteRole };
