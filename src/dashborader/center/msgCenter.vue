<template>
  <Modal
    title="消息中心"
    width=90%
    v-model="centerModal"
    :mask-closable="false"
    >
      <div class="msgCenter" style="width:100%;">
        <Table size="small" highlight-row stripe :columns="columns" :data="data"></Table>
        <div v-show='isShowSpin' style="text-align:center;">暂无消息</div>
      </div>
      <div slot="footer"></div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {common,formateDate} from 'common/js/common.js';
  let websocket = null;
  let user = localStorage.getItem("user")||''
  let socketStatus = sessionStorage.getItem("socketStatus")||false;//避免重复连接
  export default{
    data() {
      return {
        data: [],
        centerModal: false,
        isShowSpin: false,
        columns: [
          {
            title: '内容',
            key: 'content',
            minWidth:200,
            align:'center'
          },
          {
            title: '日期',
            key: 'sendDate',
            minWidth:120,
            align:'center',
            render: (h, params) => {
              return h('span', formateDate(params.row.sendDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '发送人',
            key: 'senderName',
            minWidth:90,
            align:'center'
          },
          {
            title: '状态',
            key: 'isRead',
            minWidth:90,
            align:'center',
            render: (h, params) => {
              if(params.row.isRead){
                return h('span','已读')
              }else{
                return h('span','未读')
              }
            }
          },
          {
            title: '操作',
            // key: 'action',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if(params.row.isRead){
                return h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    disabled:true
                  },
                  style: {
                    margin: '2px',
                  },
                },'标记已读')
              }else{
                return h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.readyOver(params.index ,params.row.id)
                    }
                  }
                },'标记已读')
              }
            }
          }
      ]
      }
    },
    created:function () {
     this.WebSocket()
    },
    mounted() {
     this.loadDataGrid();
    },
    methods: {
      show(key){
        this.centerModal = true
      },
      WebSocket() {
//        es = new EventSource("https://cmsapi.onlyhi.cn/NewNameList/getLeadsData?ccUuid=" + this.ccUuid);
       console.log('----------SSE连接打开-----------------------');
        let json;
        let uuid;
        let _this = this;
        if(user){
          uuid = JSON.parse(user).uuid
          // console.log (COMMON_API().websocketApi +'/'+uuid);
          if ('WebSocket' in window) {
            websocket = new WebSocket(COMMON_API().websocketApi +'/'+ uuid);
          } else {
            alert('当前浏览器不支持websocket')
          }
          //连接发生错误的回调方法
          websocket.onerror = function () {
            socketStatus = false;
            console.log('WebSocket连接发生错误');
          };

          //连接成功建立的回调方法
          websocket.onopen = function (event) {
            socketStatus = true;

            clearInterval(t2);//去掉定时器
            var t2 = setInterval(function () {
              if (!socketStatus) {
                websocket.close();
                _this.WebSocket();
              } else {
                websocket.send(localStorage.getItem("token"));
                console.log('心跳');
              }
            }, 6000);
          }
          //接收到消息的回调方法
          websocket.onmessage = function (event) {
            console.log('打印开始');
            json = JSON.parse(event.data);
            console.log(json);
            // sessionStorage.setItem('unReadNum',json.UnReadNum)
            _this.$emit('noticePushCourseCount',json.UnReadNum,json.IsNewMessage)
            if(json.IsNewMessage == 1){
              sessionStorage.setItem('IsNewMessage',1)
            }else{
              sessionStorage.setItem('IsNewMessage',0)
            }
          }
          websocket.onclose = function (event) {
            socketStatus = false;
          }
          window.onbeforeunload = function () {
            websocket.close();
          }
        }else{
          location.href = '/static/login.html'
        }
      },
      loadDataGrid() {
        const _this = this;
        common.ajax({
          url: COMMON_API().getSendRecord,
          method: 'get',
          success: function (res) {
            // console.log (res.data);
            res.data.forEach(function (v, i) {
              v.over = 0;
            });
            if(res.data.length<1){
              _this.isShowSpin = true;
            }else {
              _this.isShowSpin = false;
            }
            _this.data = res.data||[];
          },
        });
      },
      readyOver(index,id){
        let uuid
        uuid = JSON.parse(user).uuid
        console.log (index, id,uuid);
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().getSendRecord,
        //   method: 'get',
        //   success: function (res) {
            // console.log (res.data);
            _this.data[index].over = 1;
            websocket.send(id + '|' + uuid);
            _this.loadDataGrid();
          // },
        // });
      },
    },

   beforeDestroy() {
    websocket.close();
   },
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .msgCenter{
    min-height:400px;
    overflow-y: auto;
  }

  li{
    position: relative;
    padding:10px;
    border-bottom:1px solid #d7dde4;
    .liSpan{
      position: absolute;
      top:50%;
      left:0;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    .liSpan2{
      padding: 0 90px 0 60px;
      display: block;
      margin:0 auto;
    }
    .liSpan3{
      position: absolute;
      top:50%;
      right:0;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }
</style>
