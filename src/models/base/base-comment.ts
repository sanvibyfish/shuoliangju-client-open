import * as Api from '../../services/comment'
import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import EntityUtils from '../../utils/entity_utils'

export const baseComment = modelExtend(baseModel, {
  state: {
    commentIds: null
  },
  effects: {
    *likeComment({ payload }, { call, put,select }) {
      const response = yield call(Api.likeComment, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setComment(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionLikeComment",
          payload: {
            commentableId: response.commentable_id,
            commentId: response.id
          }
        })
      }
    },
    *unlikeComment({ payload }, { call, put, select }) {
      const response = yield call(Api.unlikeComment, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setComment(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionUnlikeComment",
          payload: {
            commentableId: response.commentable_id,
            commentId: response.id
          }
        })
      }
    },
    *getComments({ payload }, { call, put }) {
      const response = yield call(Api.getComments, {
        ...payload
      })
      if (response) {
        const data = EntityUtils.setComments(payload.response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: "actionGetComments",
          payload: {
            page: payload.page,
            commentIds: data.result,
            isLast : (response.length == 0 && payload.page > 1) ? true : false,
            commentableId: payload.commentable_id
          },
        })
      }
    },
  },


  reducers: {

    /**
     * 
     * @param state 
     * @param payload
     *  payload: {
     * comment_ids: data.result,
     *  page: payload.page,
     *  }
     */
    actionGetComments(state, { payload }) {
      return { ...state, ...payload }
    },

    // /**
    //  * payload
    //  * comment_id: data.result,
    //  * parent: response.parent
    //  * @param state 
    //  * @param param1 
    //  */
    // actionAddComment(state, {payload}) {
    //   return {...state, ...payload}
    // },

    actionDeleteComment(state, {payload}) {
      return {...state, ...payload}
    },

    actionLikeComment(state, {payload}) {
      return {...state, ...payload}
    },

    actionUnlikeComment(state, {payload}) {
      return {...state, ...payload}
    },
  }

})
