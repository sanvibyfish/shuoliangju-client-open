import Tips from '../utils/tips'
import * as Api from '../services/user'
import {Router} from '../config/router'
import {user} from './schema'
import {normalize, denormalize} from 'normalizr'
import modelExtend from 'dva-model-extend'
import {baseModel} from './base-model'
import Taro from '@tarojs/taro'
import EventCenter from '../utils/event-center'
export default modelExtend(baseModel,{
  namespace: "followingList",
  state: {
    users: new Array()
  },
  effects: {
    *getUsers({payload, params}, {call, put, select}) {
      const response = yield call(Api.followingList, {
        ...payload,
      })
      
      if(response) {
        const data = normalize(response, [user])
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'save',
          payload: {
            users: data.result,
            page: payload.page,
          },
        })
      }
    },
    *unfollowUser({payload}, {call, put, select}) {
      const response = yield call(Api.unfollowUser, {
        ...payload,
      })
      if (response) {
        const data = normalize(response, user)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.UNFOLLOW_USER)
        yield put({
          type: 'unfollower',
          payload: {
            id: data.result,
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
      if (payload.page != 1 && payload.users.length == 0) {
        Tips.failure('没有更多了')
        state.isLast = true
        return {...state}
      }

      //加载更多
      if (payload.users && payload.page != 1) {
        payload.users = state.users.concat(payload.users)
        return {...state, ...payload}
      }
    },
    unfollower(state, { payload }) {
      payload.users = [...state.users.filter((item) => { return item != payload.id})]
      return {
        ...state,
        ...payload,
      }
    },
  },
})
