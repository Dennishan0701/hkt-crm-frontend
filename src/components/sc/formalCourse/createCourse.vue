<template>
<div>
  <Modal
    v-model="modal"
    title="批量开课"
    width=850
    :closable="false"
    @on-ok="ok">
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
</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common,computedEndTime} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
//        classLengthValue: '',   //课程时长
        timeList: [],   //选择时间数组
//        courseorderUuid: '',      //课程订单uuid
//        leadsUuid: '',//leadsUuid
//        courseRequestUuid: '',

        courseOrderUuid:'',//课程订单uuid
        courseRequestUuid:'',//课程请求uuid
        teacherUuid:'',//老师uuid
        leadsUuid:'',//leadsuuid
        courseDates:'',//上课日期信息
        leadsName:'',//学生
        teacherName:'',//老师
        subject:'',//科目
        startDate:'',

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
            endTime: '',
            code: '100',
            msg: '可排课'
          },
        ],               //开始时间
        columns: [
          {
            title: '时长',
            key: 'name',
            render : (h, params) => {
              return h('div',[
                h('Select',{
                  props:{
                    value:this.list[params.index].classLengthValue,
                  },
                  style:{
                    width:'80px',
                  },
                  on:{
                    'on-change':(val)=>{
                      console.log(val);
                      this.list[params.index].classLengthValue = val;
                    },
//                    click:(val)=>{
//                      console.log(val);
//                      this.list[params.index].classLengthValue = val;
//                    }
                  }
                },[
                    h('Option',{props:{value:'1'}},1),
                    h('Option',{props:{value:'1.5'}},1.5),
                    h('Option',{props:{value:'2'}},2),
                    h('Option',{props:{value:'2.5'}},2.5),
                    h('Option',{props:{value:'3'}},3),
                    h('Option',{props:{value:'3.5'}},3.5),
                    h('Option',{props:{value:'4'}},4),
                    h('Option',{props:{value:'4.5'}},4.5),
                    h('Option',{props:{value:'5'}},5),
                  ], )
              ])
//              return `
//            <i-select v-model="list[${index}].classLengthValue" style="width:80px">
//              <i-option value="1">1</i-option>
//              <i-option value="1.5">1.5</i-option>
//              <i-option value="2">2</i-option>
//              <i-option value="2.5">2.5</i-option>
//              <i-option value="3">3</i-option>
//              <i-option value="3.5">3.5</i-option>
//              <i-option value="4">4</i-option>
//              <i-option value="4.5">4.5</i-option>
//              <i-option value="5">5</i-option>
//            </i-select>`;
            }
          },
          {
            title: '日期',
            key: 'age',
            render : (h, params) => {
              return h('div',[
                h('datePicker',{
                  props:{
                    placement:'bottom-start',
                    options:this.options3,
                    value:this.list[params.index].dateTime,
                  },
                  attrs:{
                    placeholder:'选择日期'
                  },
                  on:{
//                    'on-open-change':(value)=>{
//                      if(value==false){
//                      }
//                    },
                    'on-change':(val)=>{
                      this.list[params.index].dateTime = val;
                      this.changeStartDate0(params.index)
                    }
                  }
                })
              ])
//              return `
//               <date-picker type="date" placement="bottom-start" @on-open-change='changeStartDate0(${index})'  @on-change="changeStartDate" :options="options3" :value="list[${index}].dateTime" placeholder="选择日期"></date-picker>
//                  `
            }
          },
          {
            title: '开始时间',
            key: 'address',
            render:(h, params)=>{
              return h('div',[
                h('Select',{
                  props:{
                    value:this.list[params.index].startTime,
                  },
                  on:{
                    'on-change':(val)=>{
                      this.list[params.index].startTime = val;
                      this.change(params.index)
                    }
                  }
                },this.timeList.map(item=>{
                  return h('Option',{
                    props:{
                      value:item.value,
                    }
                  },item.value)
                }))
              ])
//              return `
//               <i-select v-model="list[${index}].startTime" @on-change='change(${index})'>
//               <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
//               </i-select>`
            }
          },
          {
            title: '结束时间',
            key: 'address',
            render:(h, params)=>{
              return h('div',[
                h('Select',{
                  props:{
                    value:this.list[params.index].endTime,
                  },
                  on:{
                    'on-change':(val)=>{
                      this.list[params.index].endTime = val;
                      this.change(params.index)
                    }
                  }
                },this.timeList.map(item=>{
                  return h('Option',{
                    props:{
                      value:item.value,
                    }
                  },item.value)
                }))
              ])
//              return `
//                    <i-select v-model="list[${index}].endTime" @on-change='change(${index})'>
//                    <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
//                    </i-select>`
            }
          },
          {
            title: '提示',
            key: 'msg',
            render:(h, params)=>{
              if(params.row.code == '100'){
                return h('div',[
                  h('p',{
                    style:{
                      color:'#657180'
                    }
                  },this.list[params.index].msg)
                ])
//                return `<p style="color: #657180;">{{list[${index}].msg}}</p>`
              }else {
                return h('div',[
                  h('p',{
                    style:{
                      color:'#f30'
                    }
                  },this.list[params.index].msg)
                ])
//                return `<p style="color: #f30;">{{list[${index}].msg}}</p>`
              }
            }
          },
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
            endTime: '',
            code: '100',
            msg: '可排课'
          },
        ]
      }
    },
    mounted(){
      let that = this
      $.getJSON("static/data.json", function (json) {
        var list = json.courseRangTimes30;
        list = list.slice(0, list.length - 2);
        that.timeList = list;
      });
    },
    methods: {
      change(index0){
        let start;
        let end;
        this.timeList.forEach((item, index) => {
          if (item.value == this.list[index0].startTime) {
            start = index;
          }
          if (item.value == this.list[index0].endTime) {
            end = index;
          }
        });
        this.isLegalCourseDate(index0)
      },
      add (index) {
        this.data.push({
          classLengthValue: '',
          dateTime: '',
          startTime: '',
          endTime: '',
          code: '100',
          msg: '可排课'
        });
        this.list.push({
          classLengthValue: '',
          dateTime: '',
          startTime: '',
          endTime: '',
          code: '100',
          msg: '可排课'
        });
//        this.$Modal.info({
//          title: '用户信息',
//          content: `姓名：${index}`
//        })
      },
      remove (index) {
        this.data.splice(index, 1);
        this.list.splice(index, 1);
      },
      show(courseOrderUuid,courseRequestUuid,teacherUuid,leadsUuid,leadsName,teacherName,subject) {
        this.courseOrderUuid = courseOrderUuid;
        this.courseRequestUuid = courseRequestUuid;
        this.teacherUuid = teacherUuid;
        this.leadsUuid = leadsUuid;
        this.leadsName = leadsName;
        this.teacherName = teacherName;
        this.subject = subject;
        this.modal = true;
      },

      //检测当前排课是否通过
      isLegalCourseDate(index){
        let stringData = '';
        const _this = this;
        stringData += this.list[index].classLengthValue+','
        stringData += this.list[index].dateTime+','
        stringData += this.list[index].startTime+','
        stringData += this.list[index].endTime+';'
        console.log(stringData);

        if(!this.list[index].classLengthValue || !this.list[index].dateTime || !this.list[index].startTime || !this.list[index].endTime){
          _this.$Message.warning("请填入全部信息");
        }else{
          common.ajax({
            url: SCS().FormalCourse.isLegalCourseDate,
            data: {
              teacherUuid: this.teacherUuid,
              courseDates:stringData
            },
            success: function (response) {
              _this.$Message.success("这条信息通过！请填下一行",2);
              _this.list[index].code = response.code;
              _this.data[index].code = response.code;
              _this.list[index].msg = response.msg;
              _this.data[index].msg = response.msg;
              console.log(_this.list);
              console.log(response.code);
            },
            successError:function (response) {
              _this.list[index].code = response.code;
              _this.data[index].code = response.code;
              _this.list[index].msg = response.msg;
              _this.data[index].msg = response.msg;
              console.log(response.code);
            }
          });
        }


      },
      ok() {
        console.log(this.list);
        const that = this;
        let stringData = '';
        this.list.forEach(function (value,index) {
          if(!value.classLengthValue || !value.dateTime || !value.startTime || !value.endTime){
            return false
          }else {
            stringData += value.classLengthValue+','
            stringData += value.dateTime+','
            stringData += value.startTime+','
            stringData += value.endTime+';'
          }
        })
        console.log(stringData);
        common.ajax({
          url: SCS().FormalCourse.isLegalCourseDate,
          data: {
            teacherUuid: this.teacherUuid,
            courseDates:stringData
          },
          success: function (response) {
            common.ajax({
              url: SCS().FormalCourse.batchCreateFormalCourse,
              data: {
                courseOrderUuid: that.courseOrderUuid,
                courseRequestUuid: that.courseRequestUuid,
                teacherUuid: that.teacherUuid,
                leadsUuid: that.leadsUuid,
                courseDates:stringData
              },
              success: function (response) {
                common.notices('操作成功！！');
                that.reset();
                that.$emit('reFresh', 'success');
              },
            });
          },
        });






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
//        this.$emit('reFresh', 'add.success');
//            }
//          });
//        }
      },

//      changeStartDate(value) {
//        this.startDate = value;
//      },
      changeStartDate0(index){
//        this.list[index].dateTime = this.startDate
        this.isLegalCourseDate(index)
      },
      reset() {
        this.list = [];
        this.data = [];
        this.startDate = '';
      },
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  .o-table{
    width:80%;
    .o-tbody{
      display: flex;
      tr{
        flex:1;
        text-align: center;
        text-align: -webkit-center;
      }
    }
  }

</style>
