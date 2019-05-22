<template>
  <Modal
    title="新增渠道"
    v-model="channelModal"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref='formValidate' :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="渠道名称" prop="name">
        <i-input v-model="formItem.name" placeholder="渠道名称"></i-input>
      </Form-item>
      <Form-item label="渠道类别" prop="types">
        <i-select v-model="formItem.types">
          <i-option v-for="(item,index) in typeList" :key='index' :value="item.id">{{ item.name }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="渠道等级" prop="level">
        <i-input v-model="formItem.level" placeholder="如：A，B，C等"></i-input>
      </Form-item>
      <Form-item label="设备平台" prop="platform">
        <i-select v-model="formItem.platform">
          <i-option value="PC" label="PC">
            <span><Icon type="monitor"></Icon> PC</span>
          </i-option>
          <i-option value="MOBILE" label="MOBILE">
            <Icon type="android-phone-portrait"></Icon> MOBILE
          </i-option>
          <i-option value="微信" label="微信">
            <Icon type="chatbubbles"></Icon> 微信
          </i-option>
        </i-select>
      </Form-item>
      <Form-item label="落地页" prop="lpPage">
        <i-input v-model="formItem.lpPage" placeholder="落地页"></i-input>
      </Form-item>
      <Form-item label="备注" prop="desc">
        <i-input type="textarea" v-model="formItem.desc" :rows="4" :maxlength="500" placeholder="500字以内"></i-input>
      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        uuid: '',
        channelModal: false,
        loading: true,
        formItem: {
          name: '',
          types: '',
          level: '',
          platform: '',
          lpPage: '',
          desc: ''
        },
        typeList: [],
        ruleValidate: {
          name: [
            {required: true, message: '不能为空',  trigger: 'blur'},
          ],
          types: [
            {required: true, type: 'integer', message: '不能为空',  trigger: 'change'},
          ],
          level: [
            {required: true, message: '不能为空',  trigger: 'change'},
          ],
          platform: [
            {required: true, message: '不能为空',  trigger: 'change'},
          ],
          lpPage: [
            {required: true, message: '不能为空',  trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      show(uuid) {
        this.uuid = uuid;
        this.loadData(uuid);
        this.channelModal = true;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        let level = _this.formItem.level;
        this.$refs[name].validate((valid) => {
          if (valid) {
            level = level.toUpperCase();
            common.ajax({
              url: MO().Channel.saveOrUpdate,
              data: {
                uuid: _this.uuid,
                name: _this.formItem.name,
                level: level,
                type: _this.formItem.types,
                platform: _this.formItem.platform,
                lpPage: _this.formItem.lpPage,
                description: _this.formItem.desc
              },
              success: function (response) {
                _this.channelModal = false;
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'success');
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      loadData(uuid) {
        let param = "?uuid=" + uuid;
        const _this = this;
        common.ajax({
          url: MO().Channel.getChannel + param,
          method: 'get',
          success: function (res) {
            let data = res.data;
            _this.formItem.name = data.name;
            _this.formItem.desc = data.description;
            _this.formItem.platform = data.platform;
            _this.formItem.types = data.type;
            _this.formItem.level = data.level;
            _this.formItem.lpPage = data.lpPage;
          }
        });

        common.ajax({
          url: MO().ChannelType.allChannelType,
          method: 'get',
          success: function (res) {
            _this.typeList = res.data || [];
          }
        });
      }
    }
  };
</script>

<style>
</style>
