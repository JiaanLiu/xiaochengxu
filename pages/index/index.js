//Page Object
import { request } from "../../request/index"
Page({
    data: {
        swiperList: [],
        catesList: [],
        floorList: []
    },
    //options(Object)
    onLoad: function(options) {
        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',

        //     success: (result) => {
        //         // console.log(result);
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     }
        // });
        this.getswiperList()
        this.getcatesList()
        this.getfloorList()
    },
    getswiperList() {
        request({ url: '/home/swiperdata' })
            .then(res => {
                //修改原数据的main改成index 才可以调换
                res.forEach(v => v.navigator_url = v.navigator_url.replace(/main/, 'index'))
                this.setData({
                    swiperList: res
                })
            })
    },
    getcatesList() {
        request({ url: '/home/catitems' })
            .then(res => {
                // console.log(res);
                this.setData({
                    catesList: res
                })
            })
    },
    getfloorList() {
        request({ url: '/home/floordata' })
            .then(res => {
                //修改借口数据的？改成/index？才能对应自己写的 跳转
                res.forEach(v => v.product_list.forEach(v => v.navigator_url = v.navigator_url.replace('?', '/index?')))
                this.setData({
                    floorList: res
                })
            })
    },
});