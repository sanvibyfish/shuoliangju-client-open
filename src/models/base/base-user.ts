import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import * as Api from '../../services/user'
import EntityUtils from '../../utils/entity_utils'

export const baseUser = modelExtend(baseModel, {

  effects: {
    *follow({payload}, {call, put, select}) {
      const response = yield call(Api.followUser, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionFollow',
          payload: {
            userId: data.result,
          },
        })
      }
    },
    *unfollow({payload}, {call, put, select}) {
      const response = yield call(Api.unfollowUser, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionUnfollow',
          payload: {
            userId: data.result,
          },
        })
      }
    },
    *ban({payload}, {call, put, select}) {
      const response = yield call(Api.banUser, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionBanUser',
          payload: {
            userId: data.result,
          },
        })
      }
    },
    *unban({payload}, {call, put, select}) {
      const response = yield call(Api.unbanUser, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionUnbanUser',
          payload: {
            userId: data.result,
          },
        })
      }
    },
    *getUser({payload}, {call, put, select}) {
      const response = yield call(Api.getUser, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetUser',
          payload: {
            userId: data.result,
          },
        })
        return response
      }
    },
    *report({payload}, {call, put, select}) {
      const response = yield call(Api.reportUser, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionReportUser',
          payload: {
            userId: data.result,
          },
        })
      }
    },
  },

  reducers: {
    actionUnbanUser(state, {payload}) {
      return {...state, ...payload}
    },    
    actionBanUser(state, {payload}) {
      return {...state, ...payload}
    },
    actionReportUser(state, {payload}) {
      return {...state, ...payload}
    },
    actionGetUser(state, {payload}) {
      return {...state, ...payload}
    },
    actionFollow(state, {payload}) {
      return {...state, ...payload}
    },
    actionUnfollow(state, {payload}) {
      return {...state, ...payload}
    },
  }
})