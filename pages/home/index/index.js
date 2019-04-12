const http = require("./../../../utils/http.js");
const cart = require("./../../../utils/cart.js");
const util = require("./../../../utils/util.js");
const app = getApp();

const images = [
  "http://article.qiuhuiyi.cn/hui_yi_15532398760009200",
  "http://article.qiuhuiyi.cn/hui_yi_15532398790002956"
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attachments: images,
    goodsList:[],
    showAuth:false,
    pageSize:10,
    pageNumber:1,
    initPageNumber:1,
    filter:'',
    showGeMoreLoadin:false,
    notDataTips:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSetting({
      success(res)
      {
        if(res.authSetting['scope.userInfo'])
        {
          that.setData({showAuth:true})
        }
        else{
          //已经授权
          //获取商品列表
          that.getGoods()
        }
      }
    })
  },
  getGoods: function () {
    http.get(`/goods?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&filter=${this.data.filter}`,{},(res)=>{
      this.setData({showGeMoreLoadin:false})
      let resData = res.data
      if(resData.code == 0)
      {
        let goods = resData.data.page_data
        //console.log("goods:"+goods)
        if(goods)
        {
          let goodsList = this.data.goodsList
          goods.map(item => {
            item.sku = item.sku.map(sku=>{
              sku.price = util.floar(sku.price)
              sku.chalk_line_price = util.floar(sku.chalk_line_price)
              console.log("skuprice:"+sku.price)
              console.log("skuchalk:"+sku.chalk_line_price)
              return sku
            })
            item.sku.forEach(console.log)
            // item.sku.forEach(function(value,index,array)
            // {
            //   console.log("value:"+value.price,"index"+index)
            // })
            // item.sku.map(sku=>{
            //   console.log("foreach:" + sku.price + ",chalk:" + sku.chalk_line_price)
            // })
            goodsList.push(item)
          })
          goodsList.forEach
          this.setData({
            goodsList:goodsList,
            pageNumber:this.data.pageNumber +1,
            notDataTips:goods.length>=0 ? true:false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 查看商品详情
   */
  openGoodsDetail:function(e)
  {
    let id = e.currentTarget.dataset.id
  },

  getAuthUserInfo:function(data)
  {
    this.setData({showAuth:false})
    http.login(null,null,null,res=>{
      console.log("loginSuccess")
      this.getGoods()
    })
  },
 
})