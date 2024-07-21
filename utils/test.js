function removeVietnameseTones(str) {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str;
}

const result = removeVietnameseTones("Nguyễn Minh Chí");
console.log("RESULT:::", result);
