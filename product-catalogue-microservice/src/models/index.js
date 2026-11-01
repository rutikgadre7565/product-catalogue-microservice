const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE || 'products.sqlite',
  logging: false
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  category: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'products',
  timestamps: false,
  defaultScope: { order: [['name', 'ASC']] }
});

Product.prototype.serialize = function () {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    price: this.price,
    available: this.available,
    category: this.category
  };
};

Product.findByName = function (name) {
  return Product.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
};
Product.findByCategory = function (category) {
  return Product.findAll({ where: { category: category.toUpperCase() } });
};
Product.findByAvailability = function (available) {
  return Product.findAll({ where: { available: Boolean(available) } });
};

module.exports = { sequelize, Product, Op };
