/** @format */

import * as Api from '../services/user'
import Tips from '../utils/tips'
import {user,post} from './schema'
import {normalize, denormalize} from 'normalizr'
export default {
  namespace: 'mePosts',
  state: {
    posts: null
  },

  effects: {
    *getPosts({payload}, {call, put,select}) {
      const response = yield call(Api.userPosts, {
        ...payload,
      })
      if(response) {
        const data = normalize(response, [post])
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'save',
          payload: {
            posts: data.result,
            page: payload.page,
          },
        })
      }

    },
  },

  reducers: {
    save(state, {payload}) {
      //刷新页面
      if (payload.page == 1) {
        state.isLast = false
        return {...state, ...payload}
      }

      //没有更多了
      if (payload.page != 1 && payload.posts.length == 0) {
        Tips.failure('没有更多了')
        state.isLast = true
        return {...state}
      }

      //加载更多
      if (payload.posts && payload.page != 1) {
        payload.posts = state.posts.concat(payload.posts)
        return {...state, ...payload}
      }
    },
    update(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
