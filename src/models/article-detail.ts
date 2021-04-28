/** @format */

import * as Api from '../services/article'
import * as CommentApi from '../services/comment'
import { baseComment } from './base/base-comment';
import { baseArticle } from './base/base-article' 
import modelExtend from 'dva-model-extend'
import EntityUtils from '../utils/entity_utils'

export default modelExtend(baseComment,baseArticle, {
  namespace: 'articleDetail',
  state: {
    article: null
  },

  effects: {
    *getComments({ payload }, { call, put, select}) {
      const response = yield call(CommentApi.getComments, {
        ...payload
      })
      if (response) {
        let { entities } = yield select()
        let article = EntityUtils.getArticle(entities, payload.commentable_id)
        let reset = payload.page == 1 ? true : false
        if(!reset) {
          article.comments = EntityUtils.appendEntity(article.comments, response)
        } else {
          article.comments = response
        }
        const data = EntityUtils.setArticle(article)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: "update",
          payload: {
            page: payload.page,
            reset: payload.page == 1 ? true : false,
            isLast : (response.length == 0 && payload.page > 1) ? true : false,
            articleId: payload.commentable_id
          },
        })
      }
    },
  },
  reducers: {
    actionAddComment(state, { payload }) {
      const {comment,entities} = payload
      payload.article =  EntityUtils.getArticle(entities,comment.commentable_id)
      payload.entities = null
      return { ...state, ...payload }
    },
    actionGetComments(state,{payload}) {
      const {commentable_id,entities} = payload
      payload.article =  EntityUtils.getArticle(entities,commentable_id)
      payload.entities = null
      return { ...state, ...payload }
    }
  }

})
