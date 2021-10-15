// pages/search/index.js
import { request } from "../../request/index"
Page({

    /**
     1.输入框绑定 值改变事件 input事件
       1获取到输入框的值
       2合法性判断
       3检测通过 把输入框的值 发送到后台
       4返回的数据打印到页面上
     2.防抖 定时器   节流阀
       1.定义全局的计时器id
防抖 一般用于 输入框中 防止重复输入 重复发送请求
节流 一般是用在页面下拉和上拉
     */
    data: {
        goods: [],
        isFocus: false,
        inpValue: ''
    },
    Timeid: -1,
    //输入框的值改变 就会触发的事件
    handleInput(e) {
        //获取输入框的值
        const { value } = e.detail;
        clearTimeout(this.Timeid); //防抖处理
        //检测合法性
        if (!value.trim()) {
            //  值不合法
            this.setData({ goods: [], isFocus: false })

            return
        };
        //发送请求获取数据  防抖处理
        this.setData({ isFocus: true }) //显示取消按钮
        this.Timeid = setTimeout(() => {
            this.qsearch(value);
        }, 500)

    },
    //发送请求 获取搜索建议 数据
    async qsearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } });
        // console.log(res);
        this.setData({ goods: res })
    },
    //点击 取消按钮
    handleCancel() {
        this.setData({
            inpValue: '',
            goods: [],
            isFocus: false
        })
    }
})