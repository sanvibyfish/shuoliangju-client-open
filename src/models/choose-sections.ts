/** @format */

import modelExtend from 'dva-model-extend'
import { baseSection } from './base/base-section'

export default modelExtend(baseSection,{
  namespace: 'chooseSections',
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
