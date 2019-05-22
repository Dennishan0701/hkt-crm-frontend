<template>
  <Modal
    v-model="modal"
    title="批量开课"
    width=850
    :closable="false"
    :mask-closable='false'
    @on-ok="ok"
  >
    <div style="color:red;text-align:center;">{{tipMsg}}</div>
    <table class="o-table">
      <tbody class="o-tbody">
      <tr>
        <th>学生</th>
        <td>{{leadsName}}</td>
      </tr>
      <tr>
        <th>老师</th>
        <td>{{teacherName}}</td>
      </tr>
      <tr>
        <th>科目</th>
        <td>{{subject}}</td>
      </tr>
      </tbody>
    </table>
    <i-table border :content="self" :columns="columns" :data="data"></i-table>
  </Modal>
</template>

<script type="text/ecmascript-6">
  //  import {SCS} from 'common/api/scs.js';
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {common, computedEndTime} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
        dateIndex: 0,
//        classLengthValue: '',   //课程时长
        timeList: [],   //选择时间数组
//        courseorderUuid: '',      //课程订单uuid
//        leadsUuid: '',//leadsUuid
//        courseRequestUuid: '',

        courseOrderUuid: '',//课程订单uuid
        courseRequestUuid: '',//课程请求uuid
        teacherUuid: '',//老师uuid
        leadsUuid: '',//leadsuuid
        courseDates: '',//上课日期信息
        leadsName: '',//学生
        teacherName: '',//老师
        subject: '',//科目
        startDate: '',
        startTime: '',

        tipMsg: '',
        self: this,
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        list: [
          {
            classLengthValue: '',
            dateTime: '',
            startTime: '',
//            endTime: '',
//            code: '100',
//            msg: '可排课'
          },
        ],               //开始时间
        columns: [
          {
            title: '序号',
            type: 'index',
            align:'center',
            width: 60
          },
          {
            title: '开课日期',
            key: 'age',
            render : (h, params) => {
//              if (params.index < 4){
                return h('div',[
                  h('datePicker',{
                    props:{
                      type:'date',
                      placement:params.index < 4?'bottom-start':'top-start',
                      clearable:false,
                      options:this.options3,
                      value:this.list[params.index].dateTime,
                      placeholder:'选择日期',
                    },
                    on:{
                      'on-open-change':()=>{
                        this.changeStartDate0(params.index)
                      },
                      'on-change':(val)=>{
                        this.changeStartDate(val)
                      }
                    }
                  })
                ])
//              }
//                return `<date-picker transfer type="date" placement="bottom-start" :clearable=false @on-open-change='changeStartDate0(${index})'  @on-change="changeStartDate" :options="options3" :value="list[${index}].dateTime" placeholder="选择日期"></date-picker>`
//               return `<date-picker transfer type="date" placement="top-start" :clearable=false @on-open-change='changeStartDate0(${index})'  @on-change="changeStartDate" :options="options3" :value="list[${index}].dateTime" placeholder="选择日期"></date-picker>`
            }
          },
          {
            title: '开始时间',
            key: 'address',
            render:(h, params)=>{
              return h('div',[
                h('TimePicker',{
                  props:{
                    placement:params.index < 4?'bottom-start':'top-start',
                    clearable:false,
                    editable:false,
                    confirm:true,
                    value:this.list[params.index].startTime,
                    placeholder:'选择时间',
                    format:'HH:mm',
                  },
                  on:{
                    'on-clear':()=>{
                      this.clearChange(params.index)
                    },
                    'on-change':(val)=>{
                      this.change(val)
                    },
                    'on-open-change':()=>{
                      this.change0(params.index)
                    }
                  }
                })
              ])
//              if (index < 4) return `<Time-picker transfer @on-clear="clearChange(${index})" placement="bottom-start" :editable="false"  @on-change='change' confirm @on-open-change='change0(${index})' :value="list[${index}].startTime" :clearable=false format="HH:mm" placeholder="选择时间"></Time-picker>`
//              else return `<Time-picker transfer @on-clear="clearChange(${index})" placement="top-start" :editable="false"  @on-change='change' confirm @on-open-change='change0(${index})' :value="list[${index}].startTime" :clearable=false format="HH:mm" placeholder="选择时间"></Time-picker>`

            }
          },
          {
            title: '时长',
            key: 'name',
            render :(h, params)=> {
              return h('div',[
                h('Select',{
                  props:{
                    placement:'bottom',
                    value:this.list[params.index].classLengthValue,
                  },
                  style:{
                    width:'80px'
                  },
                  on:{
                    'on-change':(val)=>{
                      console.log(val);
                      this.list[params.index].classLengthValue = val
                    }
                  }
                },[
                  h('Option',{props:{value:'30'}},'30分钟'),
                  h('Option',{props:{value:'45'}},'45分钟'),
                  h('Option',{props:{value:'60'}},'60分钟'),
                  h('Option',{props:{value:'90'}},'90分钟'),
                  h('Option',{props:{value:'120'}},'120分钟'),
                ])
              ])
//                return ` <i-select transfer placement='bottom' v-model="list[${index}].classLengthValue" style="width:80px">
//              <i-option value="45">45分钟</i-option>
//              <i-option value="60">60分钟</i-option>
//              <i-option value="90">90分钟</i-option>
//              <i-option value="120">120分钟</i-option>
//            </i-select>`;
            }
          },
//          {
//            title: '结束时间',
//            key: 'address',
//            render(row, column, index){
//              return `
//                    <i-select v-model="list[${index}].endTime" @on-change='change(${index})'>
//                    <i-option v-for="item in timeList" :value="item.value">{{ item.value }}</i-option>
//                    </i-select>`
//            }
//          },
//          {
//            title: '提示',
//            key: 'msg',
//            render(row, column ,index){
//              if(row.code == '100'){
//                return `<p style="color: #657180;">{{list[${index}].msg}}</p>`
//              }else {
//                return `<p style="color: #f30;">{{list[${index}].msg}}</p>`
//              }
//            }
//          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:''
                  },
                  on: {
                    click: () => {
                      this.add(params.index)
                    }
                  }
                },'增加'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:''
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                },'删除')
              ])
//              return `<i-button type="primary" size="small" @click="add(${index})">增加</i-button>
// <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
            }
          }
        ],
        data: [
          {
            classLengthValue: '',
            dateTime: '',
            startTime: '',
//            endTime: '',
//            code: '100',
//            msg: '可排课'
          },
        ]
      }
    },
    mounted(){
//      let that = this
//      $.getJSON("static/data.json", function (json) {
//        var list = json.courseRangTimes30;
//        list = list.slice(0, list.length - 2);
//        that.timeList = list;
//      });
    },
    methods: {
      change0(index0){
        console.log(1);
        this.list[index0].startTime = this.startTime;
      },
      clearChange(index){
        this.startTime = '';
      },
      change(value){
        this.startTime = '';
        this.startTime = value;
        console.log(value);
      },
      add (index) {
        if (this.data.length > 19 || this.list.length > 19) {
          return false
        }
        this.data.splice(index + 1, 0, {
          classLengthValue: '',
          dateTime: '',
          startTime: '',
//          endTime: '',
//          code: '100',
//          msg: '可排课'
        });
        this.list.splice(index + 1, 0, {
          classLengthValue: '',
          dateTime: '',
          startTime: '',
//          endTime: '',
//          code: '100',
//          msg: '可排课'
        });

        console.log(this.list);
//        this.$Modal.info({
//          title: '用户信息',
//          content: `姓名：${index}`
//        })
      },
      remove (index) {
        if (this.list.length > 1) {
          this.data.splice(index, 1);
          this.list.splice(index, 1);
        }
      },

      show(crUuid, courseOrderUuid, teacherUuid, leadsUuid, courseRequestUuid, stuPhone, tcPhone, subject, teacherName, studentName) {
        this.courseOrderUuid = courseOrderUuid;
        this.courseRequestUuid = courseRequestUuid;
        this.teacherUuid = teacherUuid;
        this.leadsUuid = leadsUuid;
        this.leadsName = studentName;
        this.teacherName = teacherName;
        this.subject = subject;
        this.modal = true;
      },

      //检测当前排课是否通过
//      isLegalCourseDate(index){
//        let stringData = '';
//        const _this = this;
//        stringData += this.list[index].classLengthValue+','
//        stringData += this.list[index].dateTime+','
//        stringData += this.list[index].startTime+','
//        stringData += this.list[index].endTime+';'
//        console.log(stringData);
//
//        if(!this.list[index].classLengthValue || !this.list[index].dateTime || !this.list[index].startTime || !this.list[index].endTime){
//          _this.$Message.warning("请填入全部信息");
//        }else{
//          common.ajax({
//            url: SCS().FormalCourse.isLegalCourseDate,
//            data: {
//              teacherUuid: this.teacherUuid,
//              courseDates:stringData
//            },
//            success: function (response) {
//              _this.$Message.success("这条信息通过！请填下一行",2);
//              _this.list[index].code = response.code;
//              _this.data[index].code = response.code;
//              _this.list[index].msg = response.msg;
//              _this.data[index].msg = response.msg;
//            },
//            successError:function (response) {
//              _this.list[index].code = response.code;
//              _this.data[index].code = response.code;
//              _this.list[index].msg = response.msg;
//              _this.data[index].msg = response.msg;
//            }
//          });
//        }
//      },
      ok() {
        console.log(this.list);
        const that = this;
        let stringData = '';
        that.list.forEach(function (value, index) {
          console.log(value);
          if (!value.classLengthValue || !value.dateTime || !value.startTime) {
            return false
          } else {
            stringData += '{' +
              '"courseOrderUuid" :"' + that.courseOrderUuid + '",' +
              '"teacherUuid" :"' + that.teacherUuid + '",' +
              '"leadsUuid" :"' + that.leadsUuid + '",' +
              '"courseDate" : "' + value.dateTime + '",' +
              '"startTime" : "' + value.startTime + '",' +
              '"length" : "' + value.classLengthValue + '"' +
              '},';

//            stringData +='courseList['+ index +'].courseOrderUuid:'+that.courseOrderUuid+',';
//            stringData +='courseList['+ index +'].teacherUuid:'+that.teacherUuid+',';
//            stringData +='courseList['+ index +'].leadsUuid:'+that.leadsUuid+',';
//            stringData +='courseList['+ index +'].courseDate:'+value.dateTime+',';
//            stringData +='courseList['+ index +'].startTime:'+value.startTime+',';
//            stringData +='courseList['+ index +'].length:'+value.classLengthValue+',';
//            let arr = {
//              courseOrderUuid:that.courseOrderUuid,
//              leadsUuid:that.leadsUuid,
//              courseDate:value.dateTime,
//              startTime:value.startTime,
//              teacherUuid:that.teacherUuid,
//              length:value.classLengthValue,
//            }
//            stringData.push(arr);
//            stringData += that.courseOrderUuid+','
//            stringData += that.leadsUuid+','
//            stringData += that.teacherUuid+','
//            stringData += value.dateTime+','
//            stringData += value.startTime+','
//            stringData += value.classLengthValue+';'
          }
        })
        common.ajax({
          url: STUDY_COURSE().formalClass.batchScheduleCourse,
          data: {
//            courseOrderUuid: that.courseOrderUuid,
////            courseRequestUuid: that.courseRequestUuid,
//            teacherUuid: that.teacherUuid,
//            leadsUuid: that.leadsUuid,
            courseList: '[' + stringData.substring(0, stringData.length - 1) + ']',
          },
          success: function (res) {
            that.reset();
            that.$emit('reFresh', 'success');
            common.notices(res.msg, '提示', 'success', 5);
          },
        });
//        common.ajax({
//          url: SCS().FormalCourse.isLegalCourseDate,
//          data: {
//            teacherUuid: this.teacherUuid,
//            courseDates:stringData
//          },
//          success: function (response) {
//
//          },
//        });
//        let length = this.classLengthValue;
//        let coursedate = this.startDate || '';
//        let starttime = this.startTime;
//        let endtime = this.endTime;
//        let tipMsg = this.tipMsg;
//
//        if (length == "" || coursedate == "" || starttime == "" || (endtime == "" || endtime > '24:00' )) {
//          common.msg('请填写完整必填项！');
//          return false;
//        } else {
//          const that = this;
//          common.ajax({
//            url: SCS().WaitFirstCourse.createCourse,
//            data: {
//              courseOrderUuid: this.courseorderUuid,
//              courseRequestUuid: this.courseRequestUuid,
//              payUuid: this.payUuid,
//              length: length,
//              courseType: 1,
//              courseDate: coursedate,
//              startTime: starttime,
//              endTime: endtime,
//              leadsUuid: this.leadsUuid
//            },
//            success: function (response) {
//              common.notices('操作成功！！');
//              that.reset();
//            }
//          });
//        }
      },

      changeStartDate(value) {
//        console.log(value);
//        this.startDate = value;
        this.list[this.dateIndex].dateTime = value;

      },
      changeStartDate0(index){
        this.dateIndex = index
//        this.isLegalCourseDate(index)
      },
      reset() {
        this.list = [
          {
            classLengthValue: '',
            dateTime: '',
            startTime: '',
//            endTime: '',
//            code: '100',
//            msg: '可排课'
          },
        ];
        this.data = [
          {
            classLengthValue: '',
            dateTime: '',
            startTime: '',
//            endTime: '',
//            code: '100',
//            msg: '可排课'
          },
        ];
        this.startDate = '';
      },
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .o-table {
    width: 80%;
    .o-tbody {
      display: flex;
      tr {
        flex: 1;
        text-align: center;
        text-align: -webkit-center;
      }
    }
  }

</style>
