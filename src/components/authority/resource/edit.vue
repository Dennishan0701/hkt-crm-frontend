<template>
  <Modal
    title="编辑"
    v-model="modal"
    :mask-closable="false"
    :closable="false"
    width="540"
    @on-ok="ok"
    class-name="vertical-center-modal">
    <Alert show-icon>
      常用图标名称
      <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
      <template slot="desc"><Icon type="plus"></Icon>(plus)、<Icon type="edit"></Icon>(edit)、<Icon type="android-cancel"></Icon>(android-cancel)、
        <Icon type="android-list"></Icon>(android-list)、<Icon type="trash-b"></Icon>(trash-b)、
        <Icon type="checkmark"></Icon>(checkmark)、<Icon type="paper-airplane"></Icon>(paper-airplane)
        <a href="https://www.iviewui.com/components/icon" target="_blank">更多>></a>
      </template>
    </Alert>
    <table class="o-table">
      <tr>
        <th>系统类别</th>
        <td>
          <Radio-group v-model="systemType" type="button">
            <Radio label="0">CRM系统</Radio>
            <Radio label="1">工单系统</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr>
        <th class="required">资源名称</th>
        <td><input type="text" class="o-input" id="resourceName" style="width: 200px"></td>
      </tr>
      <tr>
        <th>资源类型</th>
        <td>
          <Radio-group v-model="resourceType" type="button">
            <Radio label="0">菜单</Radio>
            <Radio label="1">按钮</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr>
        <th>资源路径</th>
        <td>
          <input type="text" class="o-input" id="url" style="width: 200px">
        </td>
      </tr>
      <tr>
        <th>排序</th>
        <td>
          <input type="number" class="o-input" id="seq" value="0" style="width: 200px">
        </td>
      </tr>
      <tr>
        <th>图标</th>
        <td>
          <input type="text" class="o-input" id="iconCls" style="width: 200px">
        </td>
      </tr>
      <tr>
        <th>上级资源ID</th>
        <td>
          <input type="number" class="o-input" id="pid" style="width: 200px">
          不填则为一级资源
        </td>
      </tr>
    </table>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
        resourceType: 0,
        systemType: 0,
        uuid: '',
        type: ''
      }
    },
    methods: {
      show(uuid,type) {
        this.modal = true;
        this.uuid = uuid;
        this.type = type;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Resource.getResourceByUuid,
        //   method: 'get',
        //   data: { uuid: uuid },
        //   success: function(res) {
        //     let data = res.data;
        //     $('#resourceName').val(data.name);
        //     $('#url').val(data.url);
        //     $('#seq').val(data.seq);
        //     $('#iconCls').val(data.iconCls);
        //     $('#pid').val(data.pid);
        //     _this.resourceType = data.resourceType;
        //   }
        // });
        this.$axios.get(AUTHORITY().Resource.getResourceByUuid,{
          params:{
            uuid: uuid
          }
        }).then( ({data}) => {
          let datas = data.data;
          $('#resourceName').val(datas.name);
          $('#url').val(datas.url);
          $('#seq').val(datas.seq);
          $('#iconCls').val(datas.iconCls);
          $('#pid').val(datas.pid);
          _this.resourceType = datas.resourceType;
        })
      },
      ok() {
        let name = $('#resourceName').val();
        let url = $('#url').val();
        let seq = $('#seq').val();
        let iconCls = $('#iconCls').val();
        let pid = $('#pid').val();
        let resourceType = this.resourceType;
        let systemType = this.systemType;

        if (name === "") {
          common.notices('请填写必填项！','提示', 'warning');
          return false;
        } else {
          const _this = this;
          // common.ajax({
          //   url: AUTHORITY().Resource.createOrEditResource,
          //   data: {
          //     uuid: this.uuid,
          //     name: name,
          //     pid: pid,
          //     url: url,
          //     iconCls: iconCls,
          //     seq: seq,
          //     resourceType: resourceType,
          //     systemType: systemType,
          //     description: ''
          //   },
          //   success: function (res) {
          //     common.notices('操作成功！');
          //     if(_this.type) {
          //       _this.$emit('reFresh', 'success.reload.menu');
          //     } else {
          //       _this.$emit('reFresh', 'success.reload');
          //     }
          //   }
          // });
          this.$axios.post(AUTHORITY().Resource.createOrEditResource,{
            uuid: this.uuid,
            name: name,
            pid: pid,
            url: url,
            iconCls: iconCls,
            seq: seq,
            resourceType: resourceType,
            systemType: systemType,
            description: ''
          }).then( () => {
            common.notices('操作成功！');
            if(_this.type) {
              _this.$emit('reFresh', 'success.reload.menu');
            } else {
              _this.$emit('reFresh', 'success.reload');
            }
          })
        }
      }
    }
  };
</script>

<style>

</style>
