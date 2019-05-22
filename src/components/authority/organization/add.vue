<template>
  <Modal
    title="新增部门"
    v-model="modal"
    :mask-closable="false"
    @on-ok="ok"
    class-name="vertical-center-modal">
    <table class="o-table">
      <tbody>
      <tr>
        <th class="required">部门名称</th>
        <td><i-input v-model="nameModel" style="width: 200px"></i-input></td>
      </tr>
      <tr>
        <th>部门编号</th>
        <td><Input-number v-model="codeModel"></Input-number></td>
      </tr>
      <tr>
        <th>上级部门</th>
        <td>
          <i-select v-model="pidModel" style="width:200px">
            <i-option v-for="(item,index) in organizationList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
        </td>
      </tr>
      <tr>
        <th>地址</th>
        <td><i-input v-model="addressModel" style="width: 300px"></i-input></td>
      </tr>
      </tbody>
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
        organizationList: [],
        nameModel: '',
        addressModel: '',
        pidModel: '',
        codeModel: 0
      }
    },
    methods: {
      show() {
        this.modal = true;
        this.loadOrganizationAll();
      },
      ok() {
        let name = this.nameModel;
        console.log(name);
        let code = this.codeModel;
        console.log(code);
        let pid = this.pidModel;
        console.log(pid);
        let address = this.addressModel;
        console.log(address);

        if (name === "") {
          this.notices('部门名称必填！','提示', 'warning')
        } else {
          //this.ajaxPost(AUTHORITY().Organization.saveOrUpdate,{
          //  name: name,
          //  code: code,
          //  pid: pid,
          //  address: address
          //});
        }
      },
      loadOrganizationAll() {
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Organization.getAll,
        //   method: 'get',
        //   success: function (res) {
        //     _this.organizationList = res.data;
        //   }
        // });

        this.$axios.get(AUTHORITY().Organization.getAll)
        .then( ({ data }) => {
          this.organizationList = data.data || [];
        });
      },
      ajaxPost(api, data) {
        const _this = this;
        // common.ajax({
        //   url: api,
        //   data: data,
        //   success: function (res) {
        //     common.notices('操作成功！');
        //     _this.$emit('reFresh', 'add.success');
        //     _this.nameModel = '';
        //     _this.addressModel = '';
        //     _this.pidModel = '';
        //   }
        // });
        this.$axios.post(api,{
          ...data,
        }).then( () => {
          common.notices('操作成功！');
          _this.$emit('reFresh', 'add.success');
          _this.nameModel = '';
          _this.addressModel = '';
          _this.pidModel = '';
        })
      }
    }
  };
</script>

<style>

</style>
