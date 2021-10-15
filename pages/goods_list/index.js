// pages/goods_list/index.js
import { request } from "../../request/index"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            value: '综合',
            isActive: true
        }, {
            id: 1,
            value: '销量',
            isActive: false
        }, {
            id: 2,
            value: '价格',
            isActive: false
        }, ],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10

    },
    totalPages: 1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options);
        this.QueryParams.cid = options.cid || "";
        this.QueryParams.query = options.query || "";
        this.getGoodsList()
    },
    handleItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams });
        // console.log(res);
        //总共多少个
        const total = res.total
            //计算总页数                个数/ 页容量10   
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
            // console.log(this.QueryParams);
        this.setData({
            //拼接
            goodsList: this.data.goodsList.concat(res.goods)
        })
        wx.stopPullDownRefresh()
    },
    onReachBottom() {
        if (this.QueryParams.pagenum >= this.totalPages) {
            // console.log('wu');
            //短暂显示 wx-showtoast
            wx.showToast({
                title: '这是最后一页啦'
            });
        } else {
            this.QueryParams.pagenum++;
            this.getGoodsList()
        }
    },
    onPullDownRefresh() {
        this.setData({
            goodsList: []
        })
        this.QueryParams.pagenum = 1
        this.getGoodsList()
    }
})