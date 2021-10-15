// pages/cart/index.js
import { showModal, showToast } from "../../utils/asyncWx"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },
    handleChooseAddress(e) {
        wx.chooseAddress({
            success: (address) => {
                console.log(address);
            },
            complete: (address) => {
                address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
                wx.setStorageSync('address', address);
            }
        });
    },
    onShow: function() {
        //获取缓存中的地址
        const address = wx.getStorageSync("address");
        //获取缓存中的加入购物车的数据
        const cart = wx.getStorageSync("cart") || [];

        this.setData({ address })
        this.setCart(cart)


    },
    setCart(cart) {
        //全部勾选时 全选框选中
        let allChecked = true;
        //总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
                if (v.checked) {
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num
                } else {
                    allChecked = false
                }
            })
            //判断数组是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        })
        wx.setStorageSync("cart", cart);
    },
    //单个取消或选择是影响全选框
    handleItemChange(e) {
        // console.log(e);
        //获取修改商品的id
        const goods_id = e.currentTarget.dataset.id;
        //获取购物车数组
        let { cart } = this.data;
        //找到被修改的商品对象
        let index = cart.findIndex(v => v.goods_id === goods_id);
        //选中状态取反
        cart[index].checked = !cart[index].checked;
        //修改过的数据重新缓存
        this.setCart(cart)
    },
    //全部取消或选择
    handleItemAllChange() {
        //获取数据
        let { cart, allChecked } = this.data;
        //点击取反效果
        allChecked = !allChecked;
        //循环修改cart数组中的checked
        cart.forEach(v => v.checked = allChecked);
        //修改后的值填回data和缓存中
        this.setCart(cart)
    },
    //商品数量+ -
    async handleItemNumEdit(e) {
        //获取传递过来的参数
        const { operation, id } = e.currentTarget.dataset;
        // console.log(operation, id);
        //获取数组信息
        const { cart } = this.data;
        //找到点击商品的索引
        const index = cart.findIndex(v => v.goods_id === id);
        //判断是否要执行删除
        if (cart[index].num === 1 && operation === -1) {
            //弹窗提示
            const res = await showModal({ content: "您是否要删除" });
            if (res.confirm) {
                //如果点击确认 执行删除对应索引
                // console.log(res);
                cart.splice(index, 1);
                this.setCart(cart)
            }
        } else {
            //进行修改数量
            cart[index].num += operation;
            //设置回缓存
            this.setCart(cart)
        }

    },
    //跳转支付页面
    async handlePay() {
        //判断客户是否填地址
        const { address, totalNum } = this.data;
        if (!address.userName) {
            await showToast({ title: "您还没有填写收货地址" });
            //短路写法
            return;
        }
        //判断是否有商品
        if (totalNum === 0) {
            await showToast({ title: "您还没有选购商品" });
            return;
        }
        //跳转支付页面
        wx.navigateTo({
            url: '/pages/pay/index'
        });
    }
})