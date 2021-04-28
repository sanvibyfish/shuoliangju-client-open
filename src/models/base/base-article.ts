import * as Api from '../../services/article'
import * as CommentApi from '../../services/comment'
import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import EntityUtils from '../../utils/entity_utils'
import EventCenter from '../../utils/event-center'
import Taro from '@tarojs/taro'

export const baseArticle = modelExtend(baseModel, {
  effects: {
    *addArticle({payload, params}, {call, put}) {
      const response = yield call(Api.addArticle, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setArticle(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.ADD_ARTICLE_SUCCESS)
        yield put({
          type: "actionAddArticle",
          payload: {
            articleId: data.result
          },
        })
        return response
      }
    },
    *destroy({payload}, {call, put}) {
      yield call(Api.destroyArticle, {
        ...payload,
      })
      yield put({
        type: 'actionDestroyArticle',
        payload: {
          articleId: payload.id
        },
      })
      Taro.eventCenter.trigger(EventCenter.DESTROY_ARTICLE,payload.id)
    },
    *getArticle({ payload }, { call, put }) {
      const response = yield call(Api.getArticle, {
        ...payload
      })
      if (response) {
        const data = EntityUtils.setArticle(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })

        yield put({
          type: 'actionGetArticle',
          payload: {
            articleId: response.id
          },
        })
      }
    },
    *deleteComment({payload}, {call, put, select}) {
      yield call(CommentApi.deleteComment, {
        ...payload,
      })
      let { entities } = yield select()
      let response = EntityUtils.getComment(entities, payload.id)
      let parent = EntityUtils.getComment(entities, response.parent_id)
      let article = EntityUtils.getArticle(entities, response.commentable_id)
      let data
      if(response.parent_id && parent) {
        parent.children = EntityUtils.removeEntity(parent.children, response)
        data = EntityUtils.setComment(parent)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
      } else {
        article.comments = EntityUtils.removeEntity(article.comments, response)
        data = EntityUtils.setArticle(article)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
      }
      yield put({
        type: "update",
        payload: {},
      })
    },
    *addComment({ payload }, { call, put, select }) {
      const response = yield call(CommentApi.createComment, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setComment(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        const { entities } = yield select()
        let parent = EntityUtils.getComment(entities, response.parent_id)
        let article = EntityUtils.getArticle(entities, response.commentable_id)
        if(response.parent_id && parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children = EntityUtils.pushEntity(parent.children, response)
          data = EntityUtils.setComment(parent)
          yield put.resolve({
            type: 'entities/addEntities',
            payload: data.entities
          })
        } else {
          article.comments = EntityUtils.pushEntity(article.comments, response)
          data = EntityUtils.setArticle(article)
          yield put.resolve({
            type: 'entities/addEntities',
            payload: data.entities
          })
        }
        yield put({
          type: "update",
          payload: {},
        })
        return true
      }
    },
    *likeArticle({payload}, {call, put}) {
      const response = yield call(Api.likeArticle, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setArticle(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionLikeArticle',
          payload: {
            articleId : response.id
          }
        })
      }
    },
    *unlikeArticle({payload}, {call, put}) {
      const response = yield call(Api.unlikeArticle, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setArticle(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionUnlikeArticle',
          payload: {
            articleId : response.id
          }
        })
      }
    },

  },


  reducers: {
    actionDestroyArticle(state, {payload}) {
      return {...state, ...payload}
    },
    actionAddArticle(state,{ payload }) {
      return { ...state, ...payload }
    },
    actionGetArticle(state,{ payload }) {
      return { ...state, ...payload }
    },
    actionLikeArticle(state,{ payload }) {
      return {...state, ...payload }
    },
    actionUnlikeArticle(state, { payload }) {
      return {...state, ...payload }
    },
    actionUpdateArticle(state, { payload }) {
      const {commentable_id,entities} = payload
      payload.article =  EntityUtils.getArticle(entities,commentable_id)
      payload.entities = null
      return { ...state, ...payload }
    },
  }

})
