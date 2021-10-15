// promise 形式 showModal
// @param {object}对象形式 param0 参数
export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
};
//带确定取消的弹窗提示可执行对应操作↑↑↑↑↑↑↑↑         
//仅弹窗提示↓↓↓↓↓↓
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: "none",
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
};
//promise 形式的微信登陆
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
};
//promise 形式的微信支付
//@param {object}对象形式 pay支付所必要的参数
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            //    timeStamp: '',
            //    nonceStr: '',
            //    package: '',
            //    signType: '',
            //    paySign: '',
            ...pay,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
};