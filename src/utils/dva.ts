/** @format */

import {create} from 'dva-core'
import {createLogger} from 'redux-logger'
import createLoading from 'dva-loading'
import Taro from '@tarojs/taro'
import Tips from '../utils/tips'

let app
let store
let dispatch
let registered

function createApp(opt) {
  // redux 的日志
  // opt.onAction = [createLogger()]
  app = create(opt)
  app.use(createLoading({}))

  if (!registered) {
    opt.models.forEach(model => app.model(model))
  }
  registered = true
  app.start()

  store = app._store
  app.getStore = () => store
  app.use({
    onError(err, dispatch) {
    }
  })

  dispatch = store.dispatch
  app.dispatch = dispatch
  return app
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch
  },
}
