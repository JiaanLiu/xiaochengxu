let ajaxTimes = 0;
export const request = (params) => {
    //判断url中是否带有/my/ 请求的私有路径 带上header token
    let header = {...params.header };
    //includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
    if (params.url.includes("/my/")) {
        //拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }


    //多次请求时 记录请求次数
    ajaxTimes++;
    //显示加载效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    const baseurl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header,
            url: baseurl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => { reject(err); },
            complete: () => {
                //请求完成时 请求次数-1
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    //加载完成 关闭加载效果
                    wx.hideLoading()
                }
            }

        });
    })
}