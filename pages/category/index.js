// pages/category/index.js
import { request } from "../../request/index"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: [],
        rightContent: [],
        currentIndex: 0,
        scrolltop: 0
    },
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取本地存储的数据
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            //请求数据
            this.getCates();
        } else {
            //数据没有过期则读取缓存  
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates(); //如果 超过10秒 则重新发送请求
            } else {
                //否则使用缓存数据
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name)
                let rightContent = this.Cates[0].children
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    async getCates() {
        // request({
        //     url: '/categories'
        // }).then(res => {
        const res = await request({ url: "/categories" });
        this.Cates = res
            // console.log(this.Cates);
            //把接口的数据存入到本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    handleItemTap(e) {
        // console.log(e);
        const { index } = e.currentTarget.dataset
        this.setData({
            currentIndex: index,
            rightContent: this.Cates[index].children,
            scrolltop: 0
        })
    }

})