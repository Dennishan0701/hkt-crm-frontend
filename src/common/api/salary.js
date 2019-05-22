/**
 * 薪资管理
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase} from '../api.config';

export function SALARY() {
  return {
    "Level": {//薪资等级
      "dataGrid": apiBase() + '/payGrade/getPayGradePage',
      "getPayGradeById": apiBase() + '/payGrade/getPayGradeById',
      "getPayGradeByType": apiBase() + '/payGrade/getPayGradeByType',
      "update": apiBase() + '/payGrade/updatePayGrade',
      "updateStatus": apiBase() + '/payGrade/updatePayGrade',
      "save": apiBase() + '/payGrade/addPayGrade',
      "getById":apiBase() + '/payGrade/getPayGradeById'//全职老师根据ID获取时薪等级 薪资等级
    }
  }
}
