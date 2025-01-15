const user = require('../db/models/user');
const { Sequelize } = require('sequelize');
const access = require('../db/models/access');
const modules = require('../db/models/module');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userFacility = require('../db/models/userfacility');
const facility = require('../db/models/facility');


const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const retriveToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    const newUser = await user.create({
        roleId: body.roleId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
        return next(new AppError('Failed to create the user', 400));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.userId,
        roleId:result.roleId
    });

    return res.status(201).json({
        status: 'success',
        data: result,
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const result = await user.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const moduleAccess = await access.findAndCountAll({
        attributes: [
            "moduleId","addFlag","editFlag","viewFlag",
            [Sequelize.col('module.moduleName'), 'moduleName'],
            [Sequelize.col('module.label'), 'label'],
            [Sequelize.col('module.icon'), 'icon'],
            [Sequelize.col('module.route'), 'route']
        ],
        include: [{
            model: modules,
            attributes:[]
        }],
        raw:true,
        where: { roleId:result.roleId,viewFlag:true }}
        
    );

    if (moduleAccess.rows.length === 0) {
        return next(new AppError('No access in module.Please contact admin support', 401));
    }

    const facilityData = await userFacility.findAndCountAll({
        attributes: [
            "facilityId",
            [Sequelize.col('facility.locationName'), 'locationName'],
        ],
        include: [{
            model: facility,
            attributes:[]
        }],
        raw:true,
        where: { userId:result.userId }}
    );

    const token = generateToken({
        id: result.userId,
        roleId:result.roleId
    });

    return res.json({
        status: 'success',
        token,
        facilityData,
        moduleAccess
    });
});

const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
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
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    // 3. get the user detail from db and add to req object
    const freshUser = await user.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
});

const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(
                new AppError(
                    "You don't have permission to perform this action",
                    403
                )
            );
        }
        return next();
    };

    return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo,retriveToken };
