const _ = require("lodash");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const removeVietnameseTones = (str) => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str;
};

module.exports = {
  getInfoData,
  removeVietnameseTones,
};
