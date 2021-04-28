import { baseComment } from '../base/base-comment';
import modelExtend from 'dva-model-extend'
import * as Api from '../../services/comment'
import EntityUtils from '../../utils/entity_utils'
export default modelExtend(baseComment, {
  namespace: 'comment',
  state: {
  },
  effects: {

  }
})
