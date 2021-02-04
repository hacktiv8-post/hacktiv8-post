'use strict';
const {hashPassword} = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: {
          args: true,
          msg: 'First Name is required'
        }
      }
    },
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "This email is not available. It has been used by another user.",
      },
      validate: {
        isEmail: {
          msg: "Email must be a valid email address",
        },
        notEmpty: {
          msg: "Please insert email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please insert password",
        },        
        len: {
          args: [8],
          msg: "Minimum password length is 8 characters"
        },
        isUpperCase(password) {
          if(!password.match(/[A-Z]/g)){
            throw { name: "password error", message: "password must include uppercase", status:400 }
          }
        },
        isLowerCase(password) {
          if(!password.match(/[a-z]/g)){
            throw { name: "password error", message: "password must include lowercase", status:400 }
          }
        },
        isNumeric(password) {
          if(!password.match(/[0-9]/g)){
            throw { name: "password error", message: "password must include numeric", status:400 }
          }
        }
      },
    },
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = hashPassword(user.password);
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};