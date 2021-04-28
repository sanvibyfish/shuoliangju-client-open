/** @format */

import * as Api from '../services/user'
import * as PostApi from '../services/post'
import Tips from '../utils/tips'
import {user,post} from './schema'
import {normalize, denormalize} from 'normalizr'
import EntityUtils from '../utils/entity_utils'
import modelExtend from 'dva-model-extend'
import { baseUser } from './base/base-user';

export default modelExtend(baseUser,{
  namespace: 'userProfile',
  state: {
    userId: null,
    postIds: null
  },

  effects: {
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
  },

  reducers: {
    actionGetPosts(state, {payload}) {
      const {reset} = payload
      if(!reset) {
        payload.postIds = state.postIds.concat(payload.postIds)
      }
      return {...state, ...payload}
    },
    update(state, {payload}) {
      return {...state, ...payload}
    },
  },
})
