import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
const BASE = "";
// 登录请求
export const reqLogin = (username, password) =>
  ajax(BASE + "/login", { username, password }, "POST");
// 获取一级二级分类
export const reqGetCategory = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });
// 添加分类
export const reqAddCategory = (parentId, categoryName) =>
  ajax(BASE + "/manage/category/add", { parentId, categoryName }, "POST");
// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");
// 获取商品列表
export const reqGetProduct = (pageNum, pageSize) =>
  ajax(BASE + "/manage/product/list", { pageNum, pageSize });
// 根据id获取商品分类名称
export const reqGetCategoryName = (categoryId) => ajax(BASE+"/manage/category/info",{categoryId})
// 搜索商品
export const reqSearchProduct = (pageNum, pageSize, searchName, searchType) =>
  ajax(BASE+"/manage/product/search", { pageNum, pageSize, [searchType]:searchName });
// 对商品上架下架
export const reqUpdateProductStatus = (productId,status) => ajax(BASE+"/manage/product/updateStatus",{productId,status},"POST")
// 删除上传的图片
export const reqDelUploadPic = (name) => ajax(BASE+"/manage/img/delete",{name},"POST")
// 添加更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE+"/manage/product/"+ (product._id ? "update" : "add"),product,"POST")
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE+"/manage/role/add",{roleName},"POST")
// 获取角色信息
export const reqRoleList = () => ajax(BASE+"/manage/role/list")
// 更新角色权限
export const reqUpdateRoleMenu = (role) => ajax(BASE+"/manage/role/update",role,"POST")
// 获取天气情况
export const reqWeather = (province, city, county) => {
  return new Promise((reslove, reject) => {
    const url = `https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cindex%7Calarm%7Climit%7Ctips%7Crise&province=${province}&city=${city}&county=${county}`;
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 200) {
        reslove(data.data.forecast_1h[0].weather);
      } else {
        message.error("天气请求失败", err);
      }
    });
  });
};
