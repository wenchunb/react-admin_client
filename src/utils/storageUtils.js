import store from 'store'
const USER_INFO = 'user_info'
const storage = {
// 存储store
saveUserStore(user){
    store.set(USER_INFO, user)
},
// 读取store
readUserStore(){
   return store.get(USER_INFO) || {}
},
// 删除store
removeUserStore(){
    store.remove(USER_INFO)
}
}
export default storage