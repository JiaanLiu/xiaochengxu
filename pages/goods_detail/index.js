// pages/goods_detail/index.js
import { request } from "../../request/index"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        //商品收藏
        isCollect: false
    },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
        //获取onLoad的options
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;
        //获取商品详细数据
        const { goods_id } = options;
        this.getGoodsDetail(goods_id);
    },
    async getGoodsDetail(goods_id) {
        const res = await request({ url: '/goods/detail', data: { goods_id } });
        this.GoodsInfo = res;
        //收藏
        //1获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        //2判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                pics: res.pics,
                goods_price: res.goods_price,
                goods_name: res.goods_name,
                //修改接受的数据 图片格式 方便手机预览
                goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg')
            },
            isCollect
        })
    },
    //点击轮播图放大预览
    handlePrevewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        // console.log(urls);
        const current = e.currentTarget.dataset.url
        wx.previewImage({
            // 要放大的图片
            current,
            // 图片链接
            urls
        });
    },
    handleCartAdd(e) {
        //获取缓存中的购物车数组
        let cart = wx.getStorageSync('cart') || [];
        //判断 商品对象是否存在于购物车数组中
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            //不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo)
        } else {
            cart[index].num++
        }
        wx.setStorageSync('cart', cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 1000,
            mask: true
        });

    },
    //点击收藏
    handleCollect() {
        let isCollect = false;
        //1获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || [];
        //2判断该商品是否收藏过 返满足条件数组元素的索引
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        //3当index！=-1表示 已经收藏过
        if (index !== -1) {
            //能找到 已经收藏过了在数组中删除该商品
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
                duration: 500
            });
        } else {
            //没有收藏过
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
                duration: 500
            });
        };
        //4吧数组存入到缓存中
        wx.setStorageSync("collect", collect);
        //5修改data中的属性 isCollect
        this.setData({ isCollect })
    },
    handlePay() {
        let checked = "checked";
        let num = "num";
        let info = this.GoodsInfo;
        info[checked] = true;
        info[num] = 1;
        let cart = [];
        cart.push(info);
        wx.setStorageSync("cart", cart);
        console.log(cart);
        // 跳转支付页面
        wx.navigateTo({
            url: '/pages/pay/index'
        });
    }

})