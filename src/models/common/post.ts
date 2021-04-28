/** @format */

import * as PostApi from '../../services/post'
import {post} from '../schema'
import {normalize} from 'normalizr'
import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {basePost} from '../base/base-post'

export default modelExtend(basePost,{
  namespace: 'post',
  state: {
  },

  effects: {

  },

  reducers: {
    update(state, {payload}) {
      return {...state, ...payload}
    },
  },
})
