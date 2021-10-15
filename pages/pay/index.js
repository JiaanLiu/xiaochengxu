// pages/cart/index.js
import { requestPayment, showToast } from "../../utils/asyncWx"
import { request } from "../../request/index"
// 支付按钮：1.先判断缓存中有没有token（支付权限）
// 2.没有跳转打授权页面，进行获取token
// 3.有token、、
//4.创建订单,获取订单编号
//5.发起预支付接口
//6.发起微信支付
//7.手动删除缓存中 已经被选中的商品
//8.删除后的数据填回缓存
//9.再跳转到页面
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow: function() {
        //获取缓存中的地址
        const address = wx.getStorageSync("address");
        //获取缓存中的加入购物车的数据
        let cart = wx.getStorageSync("cart") || [];
        //过滤后的购物车数组
        cart = cart.filter(v => v.checked);
        //总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
        });
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        });
    },
    //点击支付
    async handleOrderPay() {
        try {
            const token = wx.getStorageSync("token");
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index',
                });
                return;
            };
            //1创建订单
            //2准备请求头参数 参数列表在服务器查看
            // const header = { Authorization: token };
            //3准备请求体参数
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const cart = this.data.cart;
            let goods = [];
            cart.forEach(v => goods.push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }));
            const orderParams = { order_price, consignee_addr, goods };
            //4准备发送请求 获取订单编号
            const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
            //5发起 预支付接口
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
            //9删除缓存中选中的商品 然后填回缓存
            let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync("cart", newCart);
            //6发起微信支付 需要appid权限
            await requestPayment(pay);
            //7查看后台订单状态
            const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
            // console.log(res);
            await showToast({ title: "支付成功" });
            //8支付成功跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            });
        } catch (error) {
            //因权限问题 支付失败也跳转到订单页面
            await showToast({ title: "支付失败" }).then(res => {
                setTimeout(() => {
                    wx.navigateTo({
                        url: '/pages/order/index'
                    })
                }, 1000);
            });
            console.log(error);
        }
    }
})