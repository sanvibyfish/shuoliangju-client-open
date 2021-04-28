/** @format */

import modelExtend from 'dva-model-extend'
import {baseUser} from '../base/base-user'
import Storage from '../../utils/storage'
import {globalData} from '../../utils/common'
import * as Api from '../../services/user'
import {Router} from '../../config/router'
import EntityUtils from '../../utils/entity_utils'
import Tips from '../../utils/tips'
import Taro from '@tarojs/taro'
import EventCenter from '../../utils/event-center'

export default modelExtend(baseUser,{
  namespace: 'user',
  state: {
    user: null,
    hasLogin: false,
  },

  effects: {
    *wechatLogin({payload}, {call, put}) {
      const response = yield call(Api.wechatLogin, {
        ...payload,
      })
      
      if (response) {
        const data = EntityUtils.setUser(response.user)
        //save token
        if (response.token) {
          Storage.set(Storage.TOKEN, response.token)
          globalData.token = response.token
        }

        //save userinfo
        if (response.user) {
          Storage.set(Storage.USER_INFO, response.user)
          globalData.userInfo = response.user
        }

        //save openid
        if (response.openid) {
          Storage.set(Storage.OPENID, response.openid)
          globalData.openid = response.openid
        }

        globalData.hasLogin = true
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })

        yield put({
          type: 'save',
          payload: {
            user: response.user,
            hasLogin: true,
          },
        })
        Taro.eventCenter.trigger(EventCenter.LOGIN_SUCCESS)
      }
    },
    *login({payload}, {call, put}) {
      const result = yield call(Api.login, {
        ...payload,
      })
      if (result) {
        Taro.setStorageSync('token', result.token)
        yield put({
          type: 'save',
          payload: {
            user: result.user,
            hasLogin: true,
          },
        })
        Router.back({delta: 2})
      }
    },
    *register({payload}, {call, put}) {
      const result = yield call(Api.register, {
        ...payload,
      })
      if (result) {
        yield put({
          type: 'show',
          payload: {
            data: result,
          },
        })
        Router.back()
      }
    },

    *getUserInfo({payload}, {call, put}) {
      const response = yield call(Api.getUserInfo, {
        ...payload,
      })
      if (response) {
        const data = EntityUtils.setUser(response)
        //save userinfo
        Storage.set(Storage.USER_INFO, response)
        globalData.userInfo = response
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'show',
          payload: {
            user: response,
          },
        })
      }
    },
  },

  reducers: {
    actionReportUser(state, {payload}) {
      Tips.success('举报成功')
      return {...state, ...payload}
    },
    show(state, {payload}) {
      return {...state, ...payload}
    },
    save(state, {payload}) {
      return {...state, ...payload}
    },
    logout(state, {payload}) {
      return {...state, ...payload}
    },
    update(state, {payload}) {
      return {...state, ...payload}
    },
  },
})
