const { Sequelize } = require("sequelize");
const access = require("../db/models/access");
const modules = require('../db/models/module');
const catchAsync = require("../utils/catchAsync");
const { retriveToken } = require("./authController");
const changeLog = require('../db/models/changelog');
const constant = require('../constants/constant');
const user = require("../db/models/user");
const MODULEID = 3;


const createAccess = catchAsync(async (req, res, next) => {
  const body = req.body;

  await access.destroy({
    where: {
      roleId: body[0]['roleId'],
    },
  });
  
  const data = await access.bulkCreate(body);
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
    data: data,
  });
});

const getAccess = catchAsync(async (req, res, next) => {
  let roles = await modules.findAndCountAll(
    {
      attributes: [
        "moduleId","moduleName","label","icon","route",
        [Sequelize.col('accesses.roleId'), 'roleId'],
        [Sequelize.col('accesses.addFlag'), 'addFlag'],
        [Sequelize.col('accesses.editFlag'), 'editFlag'],
        [Sequelize.col('accesses.viewFlag'), 'viewFlag'],
        [Sequelize.col('accesses.deleteFlag'), 'deleteFlag'],
      ],
      include: [{
          model: access,
          attributes: [],
          where: { roleId:req.params.id},
          required: false,
      },
    ],
      raw:true,
   });

   for(var i=0;i<roles.count;i++){
      if(roles.rows[i].addFlag === null){
        roles.rows[i].addFlag = false;
      }
      if(roles.rows[i].editFlag === null){
        roles.rows[i].editFlag = false;
      }
      if(roles.rows[i].viewFlag === null){
        roles.rows[i].viewFlag = false;
      }
      if(roles.rows[i].deleteFlag === null){
        roles.rows[i].deleteFlag = false;
      }
   }
  return res.status(200).json({
    status: "success",
    data: roles,
  });
});

const getModuleAccess = catchAsync(async (req, res, next) => {
  const moduleId = req.params.id;
  let idToken = '';
  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ) {
      // Bearer asfdasdfhjasdflkkasdf
      idToken = req.headers.authorization.split(' ')[1];
  }
  if (!idToken) {
      return next(new AppError('Please login to get access', 401));
  }
  // 2. token verification
  const tokenDetail = retriveToken(idToken);
  const roles = await access.findAll(
    {
      attributes: [
        "moduleId","addFlag","editFlag","viewFlag","deleteFlag",
        [Sequelize.col('module.moduleName'), 'moduleName'],
        [Sequelize.col('module.label'), 'label'],
        [Sequelize.col('module.icon'), 'icon'],
        [Sequelize.col('module.route'), 'route']
      ],
      include: [{
          model: modules,
          attributes: []
      }],
      raw:true,
      where: { roleId:tokenDetail.roleId,moduleId:moduleId},
  });

  
  return res.status(200).json({
    status: "success",
    data: roles[0],
  });
});

const getChangeLogs = catchAsync(async (req, res, next) => {
  const moduleId = req.params.id;
  const roles = await changeLog.findAndCountAll(
    {
      attributes: [
        "changeLogId","moduleId","userId",
        [Sequelize.col('user.firstName'), 'firstName'],
        [Sequelize.col('user.lastName'), 'lastName'],
        "changes",
      ],
      include: [{
          model: user,
          attributes:[]
          
      }],
      raw:true,
      where: { moduleId:moduleId},
  });

  
  return res.status(200).json({
    status: "success",
    data: roles,
  });
});

module.exports = { createAccess,getAccess, getModuleAccess,getChangeLogs };
