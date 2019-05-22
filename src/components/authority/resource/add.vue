<template>
  <Modal
    title="新增"
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
        <td>
          <i-input v-model="resourceName" placeholder="请输入..." style="width: 200px"></i-input>
        </td>
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
          <i-input v-model="url" placeholder="请输入..." style="width: 200px"></i-input>
        </td>
      </tr>
      <tr>
        <th>排序</th>
        <td>
          <i-input v-model="seq" placeholder="请输入..." style="width: 200px"></i-input>
        </td>
      </tr>
      <tr>
        <th>图标</th>
        <td>
          <i-input v-model="iconCls" placeholder="请输入..." style="width: 200px"></i-input>
        </td>
      </tr>
      <tr>
        <th>上级资源ID</th>
        <td>
          <i-input v-model="pid" placeholder="请输入..." style="width: 200px"></i-input>
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
        resourceType: '0',
        systemType: '0',
        resourceName: '',
        url: '',
        seq: '',
        iconCls: '',
        pid: ''
      }
    },
    methods: {
      show() {
        this.modal = true;
      },
      ok() {
        let name = this.resourceName;
        let url = this.url;
        let seq = this.seq;
        let iconCls = this.iconCls;
        let pid = this.pid;
        let resourceType = this.resourceType;
        let systemType = this.systemType;

        if (name === "") {
          common.notice('请填写必填项！', 'warning');
          return false;
        } else {
          const _this = this;
          // common.ajax({
          //   url: AUTHORITY().Resource.createOrEditResource,
          //   data: {
          //     name: name,
          //     pid: pid,
          //     url: url,
          //     iconCls: iconCls,
          //     seq: seq,
          //     resourceType: resourceType,
          //     systemType: systemType,
          //     description: '',
          //     status: 1
          //   },
          //   success: function (res) {
          //     common.notices('操作成功！');
          //     _this.$emit('reFresh', 'success.reload');
          //   }
          // });
          this.$axios.post(AUTHORITY().Resource.createOrEditResource,{
            name: name,
            pid: pid,
            url: url,
            iconCls: iconCls,
            seq: seq,
            resourceType: resourceType,
            systemType: systemType,
            description: '',
            status: 1
          }).then( () => {
            common.notices('操作成功！');
            _this.$emit('reFresh', 'success.reload');
          })
        }
      }
    }
  };
</script>

<style>

</style>
