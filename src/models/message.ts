/** @format */

import * as Api from '../services/messages'
import Taro from '@tarojs/taro'
import EventCenter from '../utils/event-center'

export default {
  namespace: 'message',
  state: {
    unread_counts: null
  },

  effects: {
    *getUnreadCounts({payload}, {call, put}) {
      const response = yield call(Api.getUnreadCounts, {
        ...payload,
      })
      if (response) {
        Taro.eventCenter.trigger(EventCenter.FETCH_UNREAD_MESSAGES,response)
        yield put({
          type: 'save',
          payload: {
            unread_counts: response
          },
        })
        return response
      }
    },
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
