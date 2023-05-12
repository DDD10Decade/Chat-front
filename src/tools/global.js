// global.js
export default {
    ws: {},//websocket对象
    delay: 1500,//重连延迟，单位：毫秒
    //设置websocket对象方法
    setWs: function (newWs) {
        this.ws = newWs
    },
    //设置延迟方法
    setDelay: function (newDelay) {
        this.delay = newDelay
    },
    //发送websocket信息方法
    sendMsg: function (message) {
        this.ws.send(JSON.stringify(message))
    },
}
