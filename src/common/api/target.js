/**
 * 指标
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase} from '../api.config';
export function TARGET() {
  return {
    "target": { //指标管理
      "dataGrid": apiBase() + '/SaleTargetManager/getTeamSaleTarget',
      "changeTarget": apiBase() + '/SaleTargetManager/editTeamSaleTarget',//编辑指标信息
      "changeAllTarget": apiBase() + '/SaleTargetManager/batchAddTeamSaleTarget',//批量编辑指标信息
    },
    "allTarget": { //指标管理
      "dataGrid": apiBase() + '/SaleTargetManager/querySaleTarget',//获取总指标
      "edit": apiBase() + '/SaleTargetManager/addOrUpdateSaleTarget',//修改或新增总指标
    },
  }
}
