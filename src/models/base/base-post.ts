import * as CommentApi from '../../services/comment'
import * as PostApi from '../../services/post'
import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import EntityUtils from '../../utils/entity_utils'
import Taro from '@tarojs/taro'
import Tips from '../../utils/tips'
import EventCenter from '../../utils/event-center'

export const basePost = modelExtend(baseModel, {
  state:{
    postIds: null,
    postId: null
  },
  effects: {
    *deleteComment({payload}, {call, put, select}) {
      yield call(CommentApi.deleteComment, {
        ...payload,
      })
      let { entities } = yield select()
      let response = EntityUtils.getComment(entities, payload.id)
      let parent = EntityUtils.getComment(entities, response.parent_id)
      let post = EntityUtils.getPost(entities, response.commentable_id)
      let data
      if(response.parent_id && parent) {
        parent.children = EntityUtils.removeEntity(parent.children, response)
        data = EntityUtils.setComment(parent)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
      } else {
        post.comments = EntityUtils.removeEntity(post.comments, response)
        data = EntityUtils.setPost(post)
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
        let post = EntityUtils.getPost(entities, response.commentable_id)
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
          post.comments = EntityUtils.pushEntity(post.comments, response)
          data = EntityUtils.setPost(post)
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
    *likePost({payload}, {call, put}) {
      const response = yield call(PostApi.likePost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionLikePost',
          payload: {
            postId : response.id
          }
        })
      }
    },
    *unlikePost({payload}, {call, put}) {
      const response = yield call(PostApi.unlikePost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionUnlikePost',
          payload: {
            postId : response.id
          }
        })
      }
    },
    *report({payload}, {call, put}) {
      const response = yield call(PostApi.reportPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionLikePost',
          payload: {
            postId : response.id
          }
        })
        Tips.success('举报成功')
        return true
      }
    },
    *getPosts({ payload }, { call, put }) {
      const response = yield call(PostApi.getPosts, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setPosts(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetPosts',
          payload: {
            postIds: data.result,
            page: payload.page,
            isLast: (response.length == 0 && payload.page > 1) ? true : false,
            reset: payload.page == 1 ? true : false
          },
        })
      }
    },
    *getPost({ payload }, { call, put }) {
      const response = yield call(PostApi.getPost, {
        ...payload
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put({
          type: 'entities/addEntities',
          payload: data.entities,
        })

        yield put({
          type: 'actionGetPost',
          payload: {
            postId: response.id
          },
        })
        return response
      }
    },
    *excellent({payload}, {call, put}) {
      const response = yield call(PostApi.excellentPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.EXCELLENT_POST_EVENT)
        yield put({
          type: 'actionExcellentPost',
          payload: {
            postId: response.id
          }
        })
      }
    },
    *unexcellent({payload}, {call, put}) {
      const response = yield call(PostApi.unexcellentPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.UNEXCELLENT_POST_EVENT)
        yield put({
          type: 'actionUnexcellentPost',
          payload: {
            postId: response.id
          },
        })
      }
    },
    *top({payload}, {call, put}) {
      const response = yield call(PostApi.topPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.TOP_POST)
        yield put({
          type: 'actionTopPost',
          payload: {
            postId: response.id
          },
        })
      }
    },
    *untop({payload}, {call, put}) {
      const response = yield call(PostApi.untopPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.UNTOP_POST)
        yield put({
          type: 'actionUntopPost',
          payload: {
            postId: response.id
          },
        })
      }
    },
    *ban({payload}, {call, put}) {
      const response = yield call(PostApi.banPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.BAN_POST)
        yield put({
          type: 'actionBanPost',
          payload: {
            postId: response.id
          },
        })
      }
    },
    *unban({payload}, {call, put}) {
      const response = yield call(PostApi.unbanPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.UNBAN_POST)
        yield put({
          type: 'actionUntopPost',
          payload: {
            postId: response.id
          },
        })
      }
    },
    *destroy({payload}, {call, put}) {
      yield call(PostApi.destroyPost, {
        ...payload,
      })
      yield put({
        type: 'actionDestroyPost',
        payload: {
          postId: payload.id
        },
      })
      Taro.eventCenter.trigger(EventCenter.DESTROY_POST,payload.id)
    },
    *starPost({ payload }, { call, put }) {
      const response = yield call(PostApi.starPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionStarPost',
          payload: {
            postId: response.id
          },
        })
      }
    },
    *addPost({payload, params}, {call, put}) {
      const response = yield call(PostApi.newPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.ADD_NEW_POST)
        yield put({
          type: "actionAddPost",
          payload: {
            post: data.result
          },
        })
        return response
      }
    },
    *unstarPost({ payload }, { call, put }) {
      const response = yield call(PostApi.unstarPost, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setPost(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionUnstarPost',
          payload: {
            postId: response.id
          },
        })
      }
    }
  },

  reducers: {
    actionGetPosts(state, {payload}) {
      const {reset} = payload
      if(!reset) {
        payload.postIds = state.postIds.concat(payload.postIds)
      }
      return {...state, ...payload}
    },
    actionAddPost(state, {payload}) {
      return {...state, ...payload}
    },
    
    actionGetPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionLikePost(state, {payload}) {
      return {...state, ...payload}
    },
    actionUnlikePost(state, {payload}) {
      return {...state, ...payload}
    },
    actionExcellentPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionUnexcellentPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionTopPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionUntopPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionDestroyPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionStarPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionUnstarPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionBanPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionUnBanPost(state, {payload}) {
      return {...state, ...payload}
    },
    actionUpdatePosts(state, { payload }) {
      const { entities } = payload
      let post_ids = EntityUtils.setPosts(state.posts).result
      payload.posts = EntityUtils.getPosts(entities, post_ids)
      return { ...state, ...payload }
    },
    actionUpdatePost(state, { payload }) {
      const { commentable_id, entities } = payload
      payload.post = EntityUtils.getPost(entities, commentable_id)
      payload.entities = null
      return { ...state, ...payload }
    },
  }

})
