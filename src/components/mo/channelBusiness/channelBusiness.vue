<template>
  <div>
    <o-breadcrumb second="市场与运营" third="渠道商管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="6">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="addShow">新增</i-button>
        </i-col>
        <i-col span="18" class="right">
          <form id="searchForm">
            <i-input v-model="Search.channelUserName" :size="$store.state.searchModuleSize"
                     @on-keyup.enter="searchForm(1)" placeholder="用户名"
                     style="width:200px;margin-right:2px;"></i-input>
            <i-button style="vertical-align: middle" type="primary" :size="$store.state.searchModuleSize"
                      icon="ios-search" @click="searchForm(1)">
              搜索
            </i-button>
          </form>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-cancel="cancel"
      title="新增渠道商账户"
      @on-ok="onOk('formValidate')"
      class-name="vertical-center-modal">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel" :label-width="160">
        <Form-item label="用户名：" prop="name">
          <i-input v-model="formItem.name" placeholder="请填写用户名"
                   style="width:200px;margin-right:2px;"></i-input>
        </Form-item>
        <Form-item label="密码：" prop="password">
          <i-input v-model="formItem.password" type="password" placeholder="请填写密码"
                   style="width:200px;margin-right:2px;"></i-input>
          <i-input style="width:200px;display: none;margin-right:2px;"></i-input>
          <i-input type="password" style="width:200px;display: none;margin-right:2px;"></i-input>
        </Form-item>
        <Form-item label="关联渠道：" prop="channels">
          <p v-show="formItem.channels" style="word-break:break-all">{{formItem.channels}}</p>
          <i-button type="primary" @click="addChannel(formItem.channelVos,'add')">关联</i-button>
        </Form-item>
        <Form-item label="允许上传名单：">
          <RadioGroup v-model="formItem.enabledImport">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="描述：" prop="description">
          <i-input v-model="formItem.description" type="textarea" row=5 placeholder="请填写描述"
                   style="width:200px;margin-right:2px;"></i-input>
        </Form-item>
      </i-form>
    </Modal>
    <Modal
      v-model="modal1"
      :mask-closable="false"
      :closable="false"
      :loading="loading1"
      @on-cancel="cancel"
      title="编辑渠道商账户"
      @on-ok="onOk('formEditValidate')"
      class-name="vertical-edit-modal">
      <i-form ref="formEditValidate" :model="formItem1" :rules="ruleValidateModel1" :label-width="160">
        <Form-item label="用户名：" prop="name">
          <i-input v-model="formItem1.name" placeholder="请填写用户名"
                   style="width:200px;margin-right:2px;"></i-input>
        </Form-item>
        <Form-item label="密码：">
          <i-input v-model="formItem1.password" type="password" placeholder="请填写密码"
                   style="width:200px;margin-right:2px;"></i-input>
          <i-input style="width:200px;display: none;margin-right:2px;"></i-input>
          <i-input type="password" style="width:200px;display: none;margin-right:2px;"></i-input>
        </Form-item>
        <Form-item label="关联渠道：" prop="channels">
          <p v-show="formItem1.channels" style="word-break:break-all">{{formItem1.channels}}</p>
          <i-button type="primary" @click="addChannel(formItem1.channelVos,'edit')">关联</i-button>
        </Form-item>
        <Form-item label="允许上传名单：">
          <RadioGroup v-model="formItem1.enabledImport">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="描述：" prop="description">
          <i-input v-model="formItem1.description" type="textarea" row=5 placeholder="请填写描述"
                   style="width:200px;margin-right:2px;"></i-input>
        </Form-item>
      </i-form>
    </Modal>
    <ass-channel ref="channel" @reFresh="reFresh"></ass-channel>
  </div>

</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import oBreadcrumb from 'components/o/OBreadcrumb';
  import {formateDate, common} from 'common/js/common.js';
  import assChannel from 'components/mo/channelBusiness/assChannel';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data() {
      var validatePassWord = (rule, value, callback) => {
        if (value === "") {
          callback (new Error ('密码不能为空'));
        } else if (!(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test (value))) {
          callback (new Error ('请使用字母、数字和符号两种及以上6-20位密码'));
        } else {
          callback ();
        }
      }
      return {
        loading: true,
        loading1: true,
        modal: false,
        modal1: false,
        data: [],
        msg: '',
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        formItem: {
          name: '',
          password: '',
          description: '',
          channelUuids: '',
          enabledImport: 0,
          channels: '',
          enabledImport: '0',
          channelVos: [],
        },
        formItem1: {
          name: '',
          password: '',
          description: '',
          channelUuids: '',
          enabledImport: 0,
          channels: '',
          enabledImport: '0',
          channelVos: [],
        },
        ruleValidateModel: {
          name: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, validator: validatePassWord, trigger: 'blur'}
          ],
          channels: [
            {required: true, message: '请关联渠道', trigger: 'blur'}
          ],
          enabledImport: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          description: [
            {required: true, message: '请填写描述', trigger: 'blur'}
          ],
        },
        ruleValidateModel1: {
          name: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'}
          ],
          channels: [
            {required: true, message: '请关联渠道', trigger: 'blur'}
          ],
          enabledImport: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          description: [
            {required: true, message: '请填写描述', trigger: 'blur'}
          ],
        },
        Search: {
          channelUserName: '',
        },
        columns: [
          {
            title: '序号',
            minWidth: 40,
            align: 'center',
            type: 'index'
          },
          {
            title: '用户名',
            key: 'name',
            minWidth: 90,
            align: 'center',
          },
          {
            title: '关联渠道',
            key: 'grade',
            align: 'center',
            minWidth: 90,
            render(h, params) {
              let param = ''
              params.row.channelVos.forEach (function (v, i) {
                param += v.channelName + ','
              })
              return h('span', param)
            }
          },
          {
            title: '描述',
            key: 'description',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              let param = params.row.description || '';
              if (param.length > 30 && params.row.description) {
                param = param.slice (0, 20);
                return h('div', [
                  h('span', {
                    attrs: {
                      title: params.row.description
                    }
                  }, param)
                ])

//                return `<span title="${row.description}">${param}...</span>`
              } else {
                return h('span', params.row.description)
              }
            }
          },
          {
            title: '操作',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              let param = '';
              let channelUuids = '';
              params.row.channelVos.forEach(function (v, i) {
                param += v.channelName + ','
                channelUuids += v.channelUuid + ','
              })
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'edit',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '编辑'
                  },
                  on: {
                    click: () => {
                      this.editShow(params.row.name, params.row.password, param, channelUuids, params.row.description, params.row.uuid,params.row.enabledImport)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-b',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '删除'
                  },
                  on: {
                    click: () => {
                      this.del(params.row.uuid)
                    }
                  }
                })
              ])


//              return `<i-button type="success" icon="edit" size="small" title="编辑" @click="editShow('${row.name}','${row.password}','${param}','${channelUuids}','${row.description}','${row.uuid}')"></i-button>
//                      <i-button type="error" icon="trash-b" size="small" title="删除" @click="del('${row.uuid}')"></i-button>`;
            }
          },
        ],
      }
    },
    mounted () {
      this.searchForm ();
      const _this = this;
    },
    methods: {
      reset() {
        this.formItem = {
          name: '',
          password: '',
          description: '',
          channelUuids: '',
          channels: '',
          enabledImport: '',
          channelVos: [],
          enabledImport: 0,
        }
      },
      addShow() {
        this.modal = true;
      },
      editShow(name, password, channels, channelUuids, description, uuid,enabledImport) {
        if (uuid) {
          this.formItem1.name = name;
          this.formItem1.uuid = uuid;
          this.formItem1.enabledImport = enabledImport;
//        this.formItem.channelUuids = channelVos.join(',');
          this.formItem1.channels = channels;
          this.formItem1.channelUuids = channelUuids;
          this.formItem1.description = description;
          this.formItem1.enabledImport = enabledImport;
        } else {
          this.formItem1.uuid = '';
        }
        this.modal1 = true;
      },
      addChannel(channelVos, data) {
        sessionStorage.setItem("channel", data);
        this.modal = false;
        this.modal1 = false;
        this.$refs.channel.show (channelVos)
      },
      del(uuid) {
        const _this = this;
        this.$Modal.confirm ({
          title: '确认',
          content: '确认删除该渠道商？',
          onOk: function () {
            common.ajax ({
              url: MO ().channelBusiness.deleteChannelUser,
              data: {channelUserUuid: uuid},
              success: function (response) {
                common.notices ('操作成功！');
                _this.searchForm ();
              }
            });
          }
        });
      },
      onOk (name) {
        this.loading = false;
        console.log (name);
        if (name == 'formEditValidate') {
          const _this = this;
          let data;
          if (!_this.formItem1.password) {
            data = {
              name: _this.formItem1.name,
              description: _this.formItem1.description,
              channelUuids: _this.formItem1.channelUuids,
              uuid: _this.formItem1.uuid,
              enabledImport:_this.formItem1.enabledImport,
            }
          } else {
            if (!(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/.test(_this.formItem1.password))) {
              common.msg('请使用字母、数字和符号两种及以上6-20位密码', 'error');
              this.loading1 = false;
              return false;
            }
            let password = sha512(_this.formItem1.name + "&" + _this.formItem1.password + ":onlyhi")
            data = {
              name: _this.formItem1.name,
              password: password,
              description: _this.formItem1.description,
              channelUuids: _this.formItem1.channelUuids,
              uuid: _this.formItem1.uuid,
              enabledImport:_this.formItem1.enabledImport,
            }
          }
          this.$refs[name].validate ((valid) => {
            if (valid) {
              common.ajax ({
                url: MO ().channelBusiness.editChannelUser,
                data: data,
//                method:'get',
                success: function (res) {
                  sessionStorage.removeItem ("addleads")
                  sessionStorage.removeItem ("addChannelUuids")
                  _this.modal1 = false;
                  common.notices('操作成功！');
                  _this.formItem1.enabledImport= 0;
                  _this.reset();
                  _this.searchForm();
                }
              });
            } else {
              setTimeout (() => {
                  this.loading1 = false;
                  this.modal1 = true;
                },
                0
              )
              ;
            }
          })
        } else {
          this.$refs[name].validate ((valid) => {
            if (valid) {
              const _this = this;
              let password = sha512 (_this.formItem.name + "&" + _this.formItem.password + ":onlyhi")
              common.ajax ({
                url: MO ().channelBusiness.addChannelUser,
                data: {
                  name: _this.formItem.name,
                  password: password,
                  description: _this.formItem.description,
                  channelUuids: _this.formItem.channelUuids,
                  uuid: _this.formItem.uuid,
                  enabledImport:_this.formItem.enabledImport,
                },
                success: function (res) {
                  sessionStorage.removeItem ("addleads")
                  sessionStorage.removeItem ("addChannelUuids")
                  _this.modal = false;
                  common.notices ('操作成功！');
                  _this.reset ();
                  _this.searchForm ();
                }
              });
            } else {
              setTimeout (() => {
                  this.loading = false;
                  this.modal = true;
                },
                0
              )
              ;
            }
          })
        }
        ;
      },
      cancel() {
        this.reset();
      },
      searchForm(val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid({
          channelUserName: this.Search.channelUserName,
        });
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?channelUserName=${search.channelUserName}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax ({
          url: MO ().channelBusiness.dataGrid + param,
          method: 'get',
          success: function (res) {
            if (!res.data) {
              _this.data = [];
            } else {
              _this.data = res.data['channelUserVos'] || [];
              _this.total = res.data.total;
            }
          }
        });
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
//      ass(value){
//        if (value == 'success') this.searchForm();
//        if (value == 'getLeads') this.modal = true;
//        this.formItem.leads = sessionStorage.getItem('addleads');
//        this.formItem.channelUuids = sessionStorage.getItem('addChannelUuids')
//      }
      reFresh(value) {
        console.log(value);
        if (value == 'success') {
          this.searchForm()
        } else if (value == 'getLeads') {

          sessionStorage.getItem("channel") == 'add' ? this.modal = true : this.modal1 = true;
//        this.formItem.leads = sessionStorage.getItem('addleads');
          this.formItem.channels = sessionStorage.getItem('channels');
          this.formItem1.channels = sessionStorage.getItem('channels');
          this.formItem.channelUuids = sessionStorage.getItem('addChannelUuids');
          this.formItem1.channelUuids = sessionStorage.getItem('addChannelUuids');
        }
      }
    },
    computed: {
      iTableHeight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : 803;
      }
    },
    components: {oBreadcrumb, assChannel, PageModel}
  };
</script>

<style scoped>
  .ivu-btn {
    margin: 3px 0;
  }

  .ivu-poptip-title {
    display: none !important;
  }

  #proLink {
    position: absolute;
    left: -9999999999px;
    top: 0;
  }
</style>
