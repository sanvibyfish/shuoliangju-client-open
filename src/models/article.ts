/** @format */

import * as Api from '../services/article'
import { baseArticle } from './base/base-article' 
import modelExtend from 'dva-model-extend'
import EntityUtils from '../utils/entity_utils'
export default modelExtend(baseArticle, {
  namespace: 'article',
  state: {
  },

  effects: {
    *getArticles({payload}, {call, put}) {
      const response = yield call(Api.getArticles, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setArticles(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetArticles',
          payload: {
            articleIds: data.result,
            page: payload.page,
            isLast: (response.length == 0 && payload.page > 1) ? true : false,
            reset: payload.page == 1 ? true : false
          },
        })
      }
    },
  },

  reducers: {
    actionGetArticles(state, {payload}) {
      const {reset} = payload
      if(!reset) {
        payload.articleIds = state.articleIds.concat(payload.articleIds)
      }
      return {...state, ...payload}
    },
  },
})
