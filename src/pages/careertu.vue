<template>
  <div class="careertu-container">
    <div class="careertu-wrapper">
      <!-- 头部 -->
      <header>
        <!-- 导航栏 -->
        <nav>
          <ul>
            <li><a class="active">全部</a></li>
            <li><a>经验</a></li>
            <li><a>职位</a></li>
            <li><a>面试</a></li>
            <li><a>其他</a></li>
          </ul>
          <div>
            <a class="sendMsg-btn">发帖</a>
          </div>
        </nav>
      </header>
      <!-- 主体 -->
      <main>
        <!-- 论坛动态 -->
        <section class="message" v-if="careertuData">
          <div class="message-item" v-for="(careertu, index) in careertuData" :key="index">
            <!-- 左侧头像 -->
            <div class="left">
              <img src="./images/careertu.png" v-if="careertu.avatar === 'careertu'">
              <img src="./images/student.png" v-else>
            </div>
            <!-- 右侧内容 -->
            <div class="right">
              <p class="userinfo">
                <span class="user-name">{{careertu.name}}</span>
                <span class="info-date">{{careertu.infoDate}}</span>
                <span class="info-type">{{careertu.infoType}}</span>
              </p>
              <h3>
                <span class="mini-icon">置顶</span>
                <span class="title">{{careertu.title}}</span>
              </h3>
              <!-- 动态内容 -->
              <div class="message-content">
                <p class="message-text">使用localstorage存储评论
可以发布评论
单页限制10条
评论数据是共用的 未做区分
可以尝试发布评论
感谢使用感谢使用感谢使用感谢使用感谢使用感谢使用感谢使用感谢使用感谢使用感谢使用</p>
              </div>
              <!-- 动态操作 -->
              <p class="operation">
                <a class="answer-btn">
                  <img src="./images/edit-reply.png">
                  <span>回答</span>
                </a>
                <a class="ratings-btn" @click="changeIsShowRating(index)" pointer>
                  <img src="./images/comment.png">
                  <span>{{isShowRating && index === showRatingIndex?'收起评论':'添加评论'}}</span>
                  <p class="mini-badge" v-show="ratings.length">{{ratings.length}}</p>
                </a>
                <a class="like-btn" @click="changeLike(index)">
                  <img src="./images/good-red.png" v-if="isLike && index ===  likeIndex">
                  <img src="./images/good-gray.png" v-else>
                  <span>{{index+2}}</span>
                </a>
              </p>
              <!-- 评价框 -->
              <div class="rating-wrapper" v-show="isShowRating && index === showRatingIndex">
                <p class="rating-input">
                  <input type="text" v-model="ratingValue" placeholder="可以发布评论的！！不信你试试呗">
                  <a class="send-btn" @click="sendRating(ratingValue)">发布</a>
                </p>
                <div class="rating-item" v-for="(rating, index) in currentRatings" :key="index">
                  <p class="rating-top">
                    <span class="rating-user">{{careertu.userName}}：</span>
                    <span class="rating-date">{{rating.ratingDate | date-format}}</span>
                  </p>
                  <p class="rating-content">{{rating.ratingValue}}</p>
                </div>
                <div class="pagination">
                  <el-pagination
                    layout="slot, prev, pager, next"
                    :page-size="10"
                    :total="ratings.length"
                    :current-page="currentIndex + 1"
                    prev-text="上一页"
                    next-text="下一页"
                    @current-change="handleCurrentChange">
                    <a @click="toFirstPage">首页</a>
                  </el-pagination>
                  <el-pagination
                    layout="slot"
                    :page-size="10"
                    :total="ratings.length"
                    @current-change="handleCurrentChange">
                    <a @click="toLastPage" style="margin-left: -10px">尾页</a>
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Storage from '../localStorage'
import CareertuData from '../data' // 源数据
export default {
  data () {
    return {
      isLike: false, // 是否点赞
      isShowRating: false, // 是否显示评论框
      ratingValue: '', // 评论内容
      ratings: [{'ratingValue': '您可以试试评论一下的', 'ratingDate': Date.parse(new Date())}], // 所有评论
      currentIndex: 0, // 当前页数
      careertuData: [], // 源数据
      showRatingIndex: '', // 哪个发评论
      likeIndex: '' // 哪个在点赞
    }
  },
  computed: {
    currentRatings () { // 计算当前页的评论数据
      return this._initRatingArr(this.ratings)[this.currentIndex]
    },
    pagesCount () {
      return this._initRatingArr(this.ratings).length
    }
  },
  created () {
    this.careertuData = CareertuData
  },
  mounted () {
    this._isHide()
    this.ratings = Storage.get('ratings') // 从本地存储获取评价数据
    // this.currentIndex = 0 // 初始化当前页数
  },
  methods: {
    // 是否显示全部内容
    _isHide () {
      let len = 80 // 计算出每一行所能显示的字数个数，假设我要显示3行，乘以3即可，然后在减去一点距离就能达到这个效果
      let cons = document.querySelectorAll('.message-text')
      cons.forEach((con) => {
        let content = con.innerHTML // 获取div里的文本内容

        let span = document.createElement('span') // 创建<span>元素
        let a = document.createElement('a') // 创建<a>元素
        span.innerHTML = content.substring(0, len) // span的内容就是con的前len个字符

        a.innerHTML = content.length > len ? '... 阅读全文' : '' // 判断显示的字数是否大于默认显示的字数    来设置a的显示
        a.href = 'javascript:void(0)' // 让a链接点击不跳转
        a.className = 'showAll'
        a.onclick = function () {
          if (a.innerHTML.indexOf('阅读全文') > 0) { // 如果a中含有"展开"则显示"收起"
            a.innerHTML = '<<&nbsp;收起'
            span.innerHTML = content
          } else {
            a.innerHTML = '... 阅读全文'
            span.innerHTML = content.substring(0, len)
          }
        }
        // 设置div内容为空，span元素 a元素加入到div中
        con.innerHTML = ''
        con.appendChild(span)
        con.appendChild(a)
      })
    },
    // 点赞
    changeLike (index) {
      this.likeIndex = index
      this.isLike = !this.isLike
    },
    // 是否显示评论框
    changeIsShowRating (index) {
      this.showRatingIndex = index
      this.isShowRating = !this.isShowRating
    },
    // 发布评论
    sendRating (ratingValue) {
      let value = ratingValue.trim()
      if (value) {
        let ratings = Storage.get('ratings') // 判断本地存储是否有ratings 若没有则新建对象
        if (!ratings.length) {
          ratings = []
        }
        let ratingDate = Date.parse(new Date())
        // 构造评论数据结构
        let rating = {'ratingValue': value, 'ratingDate': ratingDate}
        this.ratings.unshift(rating)
        Storage.save('ratings', this.ratings) // 储存评论数据到本地
        this.ratingValue = ''
      }
    },
    // 初始化二维数组
    _initRatingArr (ratings) {
      // 声明一个二维数组
      let arr = []
      // 声明一个空的最小数组
      let minArr = []
      ratings.forEach(element => {
        // 当最小数组内的长度等于8时,声明一个新的最小数组
        if (minArr.length === 10) {
          minArr = []
        }
        // 当最小数组为空时push到二维数组内
        if (minArr.length === 0) {
          arr.push(minArr)
        }
        // 每次遍历数组都会将元素push到最小数组中
        minArr.push(element)
      })
      return arr
    },
    // 获取当前索引
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentIndex = val - 1
    },
    toFirstPage () {
      this.currentIndex = 0
    },
    toLastPage () {
      this.currentIndex = this.pagesCount
    }
  }
}
</script>

<style lang='less' rel='stylesheet/less'>
@themeRed: rgb(255, 117, 108);
@themeRed1: rgb(255, 82, 70);
@themeBule: rgb(114, 203, 225);
@themeBule1: rgb(95, 171, 255);
.careertu-container{
  min-width: 768px;
  padding: 10px 30px;
  background-color: #eee;
  .careertu-wrapper{
    border-radius: 7px;
    overflow: hidden;
    header{
      background-color: #fff;
      nav{
        position: relative;
        font-size: 14px;
        display: flex;
        padding: 0 15px;
        border-bottom: 2px solid #eee;
        ul{
          flex: 1;
          display: flex;
          justify-content: flex-start;
          li{
            height: 60px;
            line-height: 60px;
            padding: 0 20px;
            .active{
              color: @themeRed;
            }
          }
        }
        div{
          .sendMsg-btn{
            line-height: 60px;
            font-size: 12px;
            background-color: @themeRed;
            color: #fff;
            padding: 5px 30px;
            border-radius: 8px;
          }
        }
      }
    }
    main{
      background-color: #fff;
      .message{
        padding-right: 12%;
        .message-item{
          display: flex;
          border-bottom: 1px solid #eee;
          padding-right: 10px;
          .left{
            padding: 20px;
            img{
              width: 30px;
              height: 30px;
            }
          }
          .right{
            flex: 1;
            padding: 20px 0 30px;
            .userinfo{
              display: flex;
              font-size: 12px;
              color: #999;
              .user-name{
                color: #000;
              }
              .info-date{
                margin: 0 10px;
              }
            }
            h3{
              margin: 10px 0;
              .mini-icon{
                font-size: 12px;
                background-color: @themeRed1;
                color: #fff;
                padding: 2px 5px;
                border-radius: 3px;
                margin-right: 5px;
              }
              .title{
                font-weight: bold;
              }
            }
            .message-text{
              display: inline-block;
              color: #666;
              font-size: 13px;
              line-height: 1.57;
              white-space: pre-wrap;
              letter-spacing: 1px;
            }
            .showAll{
              font-size: 13px;
              color: @themeBule;
            }
            .operation{
              margin: 10px 0;
              img{
                width: 16px;
                vertical-align: middle;
              }
              span{
                vertical-align: middle;
                font-size: 13px;
              }
              .answer-btn{
                &:hover{
                  cursor: pointer;
                }
              }
              .ratings-btn{
                position: relative;
                margin: 15px;
                &:hover{
                  cursor: pointer;
                }
                .mini-badge{
                  position: absolute;
                  top: -5px;
                  left: 5px;
                  min-width: 12px;
                  text-align: center;
                  font-size: 12px;
                  line-height: 12px;
                  transform: scale(.6);
                  padding: 3px;
                  border-radius: 50%;
                  background-color: @themeRed;
                  color: #fff;
                }
              }
              .like-btn{
                &:hover{
                  cursor: pointer;
                }
              }
            }
            .rating-wrapper{
              border: 2px solid #eee;
              padding: 10px 20px;
              border-radius: 5px;
              .rating-input{
                display: flex;
                padding-right: 20px;
                margin-top: 10px;
                input{
                  flex: 1;
                  height: 25px;
                  border: 1px solid #eee;
                  border-radius: 5px;
                  font-size: 13px;
                  padding-left: 10px;
                  color: #666;
                }
                .send-btn{
                  width: 80px;
                  height: 25px;
                  line-height: 25px;
                  text-align: center;
                  font-size: 12px;
                  border-radius: 10px;
                  background-color: @themeBule1;
                  color: #fff;
                  margin-left: 10px;
                  &:hover{
                    cursor: pointer;
                  }
                  &:active{
                    opacity: .8;
                  }
                }
              }
              .rating-item{
                padding: 15px 0;
                margin: 15px 0;
                border-bottom: 1px solid #eee;
                .rating-top{
                  display: flex;
                  justify-content: space-between;
                  font-size: 12px;
                  .rating-user{
                    font-weight: bold;
                    color: #333
                  }
                  .rating-date{
                    color: #aaa;
                  }
                }
                .rating-content{
                  font-size: 14px;
                  margin-top: 10px;
                  color: #666
                }
              }
            }
            .pagination{
              display: flex;
              justify-content: center;
              margin-top: 20px;
              .el-pagination{
                a{
                  display: inline-block;
                  width: 39px;
                  height: 26px;
                  font-size: 13px;
                  text-align: center;
                  line-height: 26px;
                  border: 1px solid #eee;
                  &:hover{
                    cursor: pointer;
                    color: @themeRed;
                  }
                }
                button{
                  border: 1px solid #eee;
                  &:hover{
                    color: @themeRed;
                  }
                }
                .el-pager{
                  .number{
                    border: 1px solid #eee;
                  }
                  li:hover{
                    color: @themeRed;
                  }
                  .active{
                    background-color: @themeRed;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
