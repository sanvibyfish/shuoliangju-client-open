/** @format */

import * as PostsApi from '../services/post'
import * as SectionApi from '../services/section'
import {post, section} from './schema'
import {normalize, denormalize} from 'normalizr'
import Tips from '../utils/tips'

export default {
  namespace: 'sectionDetail',
  state: {
    posts: null,
  },

  effects: {
    *getPosts({payload}, {call, put}) {
      const response = yield call(PostsApi.getPosts, {
        ...payload
      })
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
    newPost(state, {payload}) {
      if (payload.extra.currentIndex == 0) {
        let posts = [...state.posts]
        posts.splice(0, 0, payload.post)
        return {
          ...state,
          posts: [...posts],
        }
      } else {
        return {...state, ...payload}
      }
    },
  },
}
