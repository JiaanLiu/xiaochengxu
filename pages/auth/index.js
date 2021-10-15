// pages/auth/index.js
import { login } from "../../utils/asyncWx"
import { request } from "../../request/index"


Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    //获取token
    async handleGetUser(e) {
        try {
            // console.log(e);
            //获取用户信息
            const { encryptedData, rawData, iv, signature } = e.detail;
            //获取小程序登陆成功后的code
            const { code } = await login();
            const logonParams = { encryptedData, rawData, iv, signature, code }
                //发送请求 获取用户的token值
            const res = await request({ url: "/users/wxlogin", data: logonParams, method: "POST" })
            console.log(res);
            //获取token  原来应该是请求的数据res.token  
            const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
                //存储数据
            wx.setStorageSync("token", token);
            wx.navigateBack({
                //返回上一层 2是2层
                delta: 1
            });
        } catch (error) {
            //错误打印
            console.log(error);
        }
    },


})