// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: {},
        //收藏数量
        collectNum: 0
    },

    onShow() {
        const userinfo = wx.getStorageSync("userinfo");
        const collectNum = wx.getStorageSync("collect") || [];
        this.setData({
            userinfo,
            collectNum: collectNum.length
        })
    },

})