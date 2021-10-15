// pages/order/index.js
import { requestPayment, showToast } from "../../utils/asyncWx"
import { request } from "../../request/index"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
        tabs: [{
            id: 0,
            value: '全部',
            isActive: true
        }, {
            id: 1,
            value: '待付款',
            isActive: false
        }, {
            id: 2,
            value: '待发货',
            isActive: false
        }, {
            id: 3,
            value: '退款/退货',
            isActive: false
        }, ],
    },


    onShow() {
        //获取授权
        const token = wx.getStorageSync("token");
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index'
            });
            return;
        }
        //获取当前的小程序的页面栈-数组 长度最大是10页面
        let pages = getCurrentPages();
        console.log(pages);
        //数组中 索引最大的页面就是当前页面
        let currentPage = pages[pages.length - 1];
        //获取url上传来的type值
        const { type } = currentPage.options;
        this.getOrders(type)
        this.changeTitleByIndex(type - 1)
    },
    //获取订单列表的方法
    async getOrders(type) {
        const res = await request({ url: "/my/orders/all", data: { type } })
        this.setData({
            orders: res.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
        })
    },
    //点击切换
    handleItemChange(e) {
        const { index } = e.detail;
        this.changeTitleByIndex(index)
            //获取订单信息
        this.getOrders(index + 1)
    },
    //切换代码
    changeTitleByIndex(index) {
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    }
})