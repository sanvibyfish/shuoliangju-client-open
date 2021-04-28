/** @format */

import * as Api from '../services/post'
import EntityUtils from '../utils/entity_utils'
export default {
  namespace: 'discover',
  state: {
    postIds: null
  },

  effects: {
    *getPosts({payload}, {call, put,select}) {
      const response = yield call(Api.getDiscoverPosts, {
        ...payload,
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
}
