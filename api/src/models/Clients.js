const { DataTypes, UUIDV1 } = require("sequelize");

//* Definiendo la función que crea el modelo Clients
module.exports = (sequelize) => {
  sequelize.define(
    "Client",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        // initialAutoIncrement: 160,
        // defaultValue: 160,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      adress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    { timestamps: false }
  );
};
