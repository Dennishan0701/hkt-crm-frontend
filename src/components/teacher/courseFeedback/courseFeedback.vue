<template>
  <div>
    <o-breadcrumb second="师资管理" third="老师的课程反馈"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherParams" @on-keyup.enter="searchForm(1)"
                   placeholder="老师的姓名/手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.stuParams" @on-keyup.enter="searchForm(1)"
                   placeholder="学生的姓名/手机号码" style="width:150px;margin-right: 2px;"></i-input>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start"
                       @on-change="changePushDate" placeholder="上课日期" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline"
                    @click="exportExcel">导出
          </i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <!-- 学生评价 -->
    <Modal class="commentWindow" v-model="commentShow" width="430" class-name="vertical-center-modal">
      <p slot="header">
        <span>查看评价</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div class="commentMain">
        <div class="commentName">星级评价：</div>
        <div class="commentStar">
          <div class="commentStarBg clear">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div class="commentStarG">
            <i v-show="commentInfo.star>0"></i>
            <i v-show="commentInfo.star>1"></i>
            <i v-show="commentInfo.star>2"></i>
            <i v-show="commentInfo.star>3"></i>
            <i v-show="commentInfo.star>4"></i>
          </div>
        </div>
      </div>
      <div class="commentBottom">
        <h3 v-if="commentInfo.star == 1">非常差！</h3>
        <h3 v-else-if="commentInfo.star == 2">较差！</h3>
        <h3 v-else-if="commentInfo.star == 3">一般！</h3>
        <h3 v-else-if="commentInfo.star == 4">满意！</h3>
        <h3 v-else-if="commentInfo.star == 5">非常满意！</h3>
        <ul>
          <li v-for="item in commentInfo.list">{{ item }}</li>
        </ul>
        <p style="word-wrap: break-word;margin-bottom: 12px;">留言： {{ commentInfo.remark || '无' }}</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" style="width: 125px;" @click="commentShow=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {ANLAI} from 'common/api/anlai.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data () {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          teacherParams: '',
          stuParams: '',
          createDateStart: '',
          createDateEnd: '',
        },
        viewAppraiseUrl: '/crm/course/course/viewAppraise',
        columns: [
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 40
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align: 'center',
            width: 120
          },
          {
            title: '开始结束时间',
            key: 'courseTime',
            align: 'center',
            width: 120
          },
          {
            title: '老师',
            key: 'teacherName',
            align: 'center',
            width: 90
          },
          {
            title: '老师手机号',
            key: 'teacherPhone',
            align: 'center',
            width: 120
          },
          {
            title: '学生',
            key: 'stuName',
            align: 'center',
            width: 90
          },
          {
            title: '学生手机号',
            key: 'stuPhone',
            align: 'center',
            width: 120
          },
          {
            title: '反馈内容',
            key: 'saturationLevel',
            align: 'center',
            width: 120,
            // render (row, column, index) {
            //   let params = row.appraiseContent;
            //   if(params.length >25){
            //     params = params.slice(0,15);
            //     return `<span title="${row.appraiseContent}">${params}...</span>`
            //   }else {
            //     return row.appraiseContent;
            //   }
            // },
            render: (h, params) => {
              let content = params.row.appraiseContent;
              if (content.length > 25) {
                content = content.slice (0, 15);
                return h ('div', [
                  h ('span', {
                    attrs: {
                      title: params.row.appraiseContent
                    }
                  }, content)
                ])
              } else {
                return h ('div', [
                  h ('span', {}, params.row.appraiseContent)
                ])
              }
            }
          },
          {
            title: '学生评价',
            key: 'saturationLevel',
            align: 'center',
            width: 120,
            render: (h, params) => {
              let content = params.row.classAppraiseUuid;
              if (content) {
                return h ('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      let param = `?classAppraiseUuid=${params.row.classAppraiseUuid}`;
                      const _this = this;
                      common.ajax ({
                        url: ANLAI ().viewAppraise.viewAppraiseUrl + param,
                        method: 'get',
                        success: function (res) {
                          _this.commentInfo = res.data;
                          _this.commentShow = true;
                        }
                      });
                    }
                  }
                }, '查看评价')
              }
              else {
                return h ('div', [
                  h ('span', {}, "暂无评价")
                ])
              }
            }
          },
          {
            title: '反馈时间',
            key: 'createDate',
            align: 'center',
            width: 150,
            // render (row, column, index) {
            //     return formateDate(row.createDate,'yyyy-MM-dd hh:mm:ss')
            // },
            render: (h, params) => {
              return h ('div', [
                h ('span', {}, formateDate (params.row.createDate, 'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          }
        ],
        commentShow: false, //学生评价
        commentInfo: '', //学生评价内容
      }
    },
    mounted () {
      this.searchForm ();
    },
    methods: {
//      getFullPhone(teacherUuid) {
//        const _this = this;
//        common.ajax({
//          url: TEACHER().Public.displayPhone,
//          method: 'get',
//          data: { uuid: teacherUuid, moduleName: '师资管理-课程课耗-全职'},
//          success: function (res) {
//            _this.$Modal.info({
//              content: (res.data !== null) ? res.data.phone : ''
//            });
//          }
//        })
//      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          stuParams: this.Search.stuParams,
          teacherParams: this.Search.teacherParams,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
        });
      },
      loadDataGrid (search) {
        let param = `?stuParams=${search.stuParams}&teacherParams=${search.teacherParams}`;
        param += `&courseDateStart=${search.createDateStart}&courseDateEnd=${search.createDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax ({
          url: TEACHER ().courseFeedback.dataGrid + param,
          method: 'get',
          success: function (response) {
            _this.data = response.data.appraiseList || [];
            _this.total = response.data.total;
          }
        });
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      changePushDate (value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
      isSearchNull () {
        if (!this.Search.stuParams && !this.Search.teacherParams && !this.Search.createDateStart && !this.Search.createDateEnd) {
          return true;
        } else {
          return false;
        }
      },
      exportExcel () {
        let isSearchNull = this.isSearchNull ();
        if (isSearchNull) {
          const _this = this;
          this.$Modal.confirm ({
            title: '导出',
            content: '没有选择任何筛选条件，将导出全部数据',
            onOk () {
              _this.exportData ();
            }
          });
        } else {
          this.exportData ();
        }
      },
      exportData () {
        let apiUrl = TEACHER ().courseFeedback.downLoadTeacherAppraise;
        // apiUrl += `?token=${localStorage.getItem('token')}&startTime=${startTime}&endTime=${endTime}&type=${type}`;
        apiUrl += `?token=${localStorage.getItem('token')}&stuParams=${this.Search.stuParams}&teacherParams=${this.Search.teacherParams}&createDateStart=${this.Search.createDateStart}&createDateEnd=${this.Search.createDateEnd}`;
        GLOBAL.newTab (apiUrl, true);
      },
    },
    components: {
      OBreadcrumb, PageModel
    }
  };
</script>

<style lang="less">

  .commentWindow {
    .ivu-modal {
      .ivu-modal-content {
        overflow: hidden;
      }
      .ivu-modal-header {
        border: 0;
        padding: 0;
        p {
          height: 38px;
          line-height: 38px;
          display: block;
          color: #fff;
          span {
            background-image: linear-gradient(to right, #eb6475 0%, #f76e4d 50%);
            width: 100%;
            height: 38px;
            padding-left: 20px;
            display: block;
            font-weight: normal;
          }
          .close {
            position: absolute;
            right: 16px;
            top: 12px;
            overflow: hidden;
            cursor: pointer;
            font-size: 15px;
            color: #fff;
            line-height: 1;
            &:hover {
              color: #d4d4d4;
            }
            &:active {
              color: #cccccc;
            }
          }
        }
      }
      .ivu-modal-footer {
        text-align: center;
        border: 0;
        padding: 6px 0 20px;
        .ivu-btn {
          width: 132px;
          height: 36px;
          line-height: 36px;
          border-radius: 5px;
          text-align: center;
          color: #fff;
          margin: 0 auto;
          margin-top: 6px;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          border: 0;
        }
        .ivu-btn[disabled] {
          color: #dadada;
          background-color: #f7f7f7;
          border-color: #dddee1;
          cursor: not-allowed;
        }
      }
      .ivu-modal-close {
        top: 12px;
        i {
          font-size: 15px;
          color: #fff;
          line-height: 1;
          &:hover {
            color: #d4d4d4;
          }
          &:active {
            color: #cccccc;
          }
        }
      }
      .ivu-modal-body {
        padding: 15px 20px;
        font-size: 14px;
        line-height: 2;
        background-color: #fff;
      }
      .ivu-modal-body {
        padding: 0;
        .commentMain {
          height: 120px;
          background-image: linear-gradient(to right, #eb6475 0%, #f76e4d 50%);
          padding-top: 10px;
          .commentName {
            padding-left: 110px;
            background: url("../../../assets/img/tanks.png") no-repeat 56px center;
            height: 36px;
            color: #fff;
            line-height: 36px;
            font-size: 14px;
            b {
              font-size: 16px;
            }
          }
          .commentStar {
            width: 240px;
            margin-left: 110px;
            position: relative;
            margin-top: 15px;
            .commentStarBg {
              display: flex;
              i {
                display: block;
                background: url("../../../assets/img/starBg.png") no-repeat;
                width: 28px;
                height: 27px;
                margin-right: 25px;
                &:last-child {
                  margin-right: 0;
                }
              }
            }
            .commentStarG {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              i {
                display: flex;
                background: url("../../../assets/img/star.png") no-repeat;
                width: 28px;
                height: 27px;
                margin-right: 25px;
                &:last-child {
                  margin-right: 0;
                }
              }
            }
          }

        }
        .commentBottom {
          background-color: #fff;
          padding: 15px 30px;
          h3 {
            font-weight: normal;
            font-size: 16px;
            color: #ff5e3d;
            margin-bottom: 10px;
          }
          ul {
            margin-bottom: 10px;
            display: flex;
            flex-wrap: wrap;
            li {
              padding: 0 10px;
              border-radius: 3px;
              font-size: 12px;
              line-height: 2;
              color: #ff5e3d;
              margin-right: 14px;
              margin-bottom: 9px;
              background: #ffe0db;
            }
          }
          p {
            font-size: 12px;
            color: #4c4245;
          }
        }
      }
    }
  }
</style>
