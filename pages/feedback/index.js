// pages/feedback/index.js
Page({

    /**
     点击+触发tap点击事件
      1调用小程序内置的选择图片api
      2获取到图片的路径数组
      3把图片路径存到data的变量中
      4页面就可以根据图片数组进行循环
    
    点击图片 组件 删除
      1获取被点击元素的索引
      2获取data中的图片数据
      3根据索引数组中删除对应的元素
      4把数组重新设置回data

    点击提交
     1获取文本域的内容
     2对这些内容 合法性验证
     3验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
       1便利图片数组
       2挨个上传
       3自己再维护图片数组 存放 图片上传后的外网链接
     4文本域和外网的图片的路径 一起提交到服务器/ 前端的模拟 不会发送请求到后台
     5清空当前页面
     6返回上一页
     */
    data: {
        tabs: [{
            id: 0,
            value: '体验问题',
            isActive: true
        }, {
            id: 1,
            value: '商品、上架投诉',
            isActive: false
        }],
        choooseImgs: [],
        textVal: '',
    },
    //外网的图片路径数组
    UpLoadImgs: [],
    //点击切换
    handleItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    handleChoose() {
        wx.chooseImage({
            //同事选中图片的数量
            count: 9,
            //图片的格式  原图       压缩
            sizeType: ['original', 'compressed'],
            //图片的来源   相册   相机 
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({ choooseImgs: [...this.data.choooseImgs, ...result.tempFilePaths] })
            },
        });
    },
    //点击删除
    handleRemove(e) {
        // 获取索引
        const { index } = e.detail;
        // 获取data图片数组
        let { choooseImgs } = this.data;
        // 删除元素
        choooseImgs.splice(index, 1)
        this.setData({ choooseImgs })
    },
    //获取文本域数据
    handleText(e) {
        this.setData({ textVal: e.detail.value })
    },
    //点击提交按钮
    handleSubmit() {
        //获取文本域的内容   图片数组
        const { textVal, choooseImgs } = this.data;
        //合法性验证
        if (!textVal.trim()) {
            //不合法
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true,
            });
            return;
        };
        //准备上传图片 到专门的图片服务器
        //显示正在等待的图片
        wx.showLoading({
            title: "正在上传中",
            mask: true
        });
        //判断有没有需要上传图片
        if (choooseImgs.length != 0) {
            choooseImgs.forEach((v, i) => {
                wx.uploadFile({
                    //图片要传到哪里
                    url: 'https://img.coolcr.cn/api/upload',
                    //被上传的文件的路径
                    filePath: v,
                    //上传的文件名称 后台来获取文件 file
                    name: "image",
                    //顺带的文本信息
                    formData: {},
                    success: (result) => {
                        console.log(result);
                        let url = JSON.parse(result.data).data.url
                        this.UpLoadImgs.push(url)
                        console.log(url);
                        //所有图片都上传完毕了才触发
                        if (this.UpLoadImgs.length === choooseImgs.length) {

                            wx.hideLoading(); //关闭加载提示
                            console.log('把文本的内容和外网的图片数组 提交到后台中');
                            //提交都成功了
                            //重置页面
                            this.setData({ textVal: '', choooseImgs: [] })
                                //返回上一页
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    },
                });
            })
        } else {
            wx.hideLoading();
            console.log('只是提交了文本');
            wx.navigateBack({
                delta: 1
            });
        }
    }
})