/**
 * Created by ShenBo on 2017/12/1.
 */
import {apiBase} from '../api.config';

export function ECHARTS(){
  return {
      "getAreaCountByDate":apiBase()+"/clientDownloadCount/getAreaCountByDateAndType",//下载统计地区分布
      "getChangeAreaCount":apiBase()+"/marketKpi/getChangeAreaCount",//市场渠道的leads的分布地区
  }
}
