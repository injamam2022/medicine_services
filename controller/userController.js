const { Sequelize, TIME } = require('sequelize');
const user = require('../db/models/user');
const role = require('../db/models/role');
const catchAsync = require('../utils/catchAsync');
const changeLog = require('../db/models/changelog');
const constant = require('../constants/constant');
const { retriveToken } = require('./authController');
const userFacility = require('../db/models/userfacility');
const department = require('../db/models/department');
const facility = require('../db/models/facility');

const MODULEID = 2;

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await user.findAndCountAll({
        //raw: true,
        attributes: [
            "userId","firstName","lastName","email",
            [Sequelize.col('role.roleId'), 'roleId'],
            [Sequelize.col('role.roleName'), 'roleName'],
            [Sequelize.col('role.department.departmentId'), 'departmentId'],
            [Sequelize.col('role.department.departmentName'), 'departmentName'],
        ],
        include: [
            {
                model: role,
                attributes: [],
                include:[{
                    model:department,
                    attributes: [],
                }]
            },
            {   
                //raw: true,
                model: userFacility,
                include:[
                    {
                    model:facility,
                }]
            }
        ],
    });
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});

const createUser = catchAsync(async (req, res, next) => {
    const body = req.body;
    const newProject = await user.create({
        roleId: body.roleId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        }   
    );

    let user_facility = body.facilities;
    let arr = [];
    for(var i=0; i < user_facility.length;i++){
        arr[i]={
            facilityId:user_facility[i],
            userId:newProject.userId
        };
    }
    await userFacility.bulkCreate(arr);

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
        status: 'success',
        data: newProject,
    });
});


const getUserById = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    let result = await user.findByPk(
        userId,
        {
            //raw: true,
            attributes: [
                "userId","firstName","lastName","email",
                [Sequelize.col('role.roleId'), 'roleId'],
                [Sequelize.col('role.roleName'), 'roleName'],
                [Sequelize.col('role.department.departmentId'), 'departmentId'],
                [Sequelize.col('role.department.departmentName'), 'departmentName'],
            ],
            include: [
                {
                    model: role,
                    attributes: [],
                    include:[{
                        model:department,
                        attributes: [],
                    }]
                },
                {   
                    //raw: true,
                    model: userFacility,
                    include:[
                        {
                        model:facility,
                    }]
                }
            ],
        });
    if (!result) {
        return next(new AppError('Invalid user id', 400));
    }
    let facilities = [];
    for(var i=0; i< result.user_facilities.length;i++){
        facilities[i] = result.user_facilities[i]['facilityId'];
    }
    result.setDataValue('facilities',facilities);
    return res.json({
        status: 'success',
        data: result   
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const body = req.body;

    const result = await user.findOne({
        where: { userId: userId },
    });

    if (!result) {
        return next(new AppError('Invalid user id', 400));
    }

    result.roleId = body.roleId;
    result.firstName = body.firstName;
    result.lastName = body.lastName;
    result.email = body.email;
    result.password = body.password;
    result.confirmPassword = body.confirmPassword;

    let user_facility = body.facilities;
    let arr = [];
    for(var i=0; i < user_facility.length;i++){
        arr[i]={
            facilityId:user_facility[i],
            userId:userId
        };
    }

    await userFacility.destroy({
        where: {
            userId:userId
        },
      });
      
    await userFacility.bulkCreate(arr);
    
    await changeLog.create({
        userId:userId,
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

const deleteUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;

    const result = await user.findOne({
        where: { userId: userId },
    });

    if (!result) {
        return next(new AppError('Invalid user id', 400));
    }

    await result.destroy();
    await changeLog.create({
        userId:userId,
        moduleId:constant.MODULE[MODULEID].id,
        changes:{
            action:`${constant.DELETE} ${constant.MODULE[MODULEID].name}`,
            change:constant.DELETE,
            changeTime:new Date()
        }
    });
    return res.json({
        status: 'success',
        message: 'Record deleted successfully',
    });
});

module.exports = { getAllUser,createUser,getUserById,updateUser,deleteUser };
