/** @format */

import modelExtend from 'dva-model-extend'
import { basePost } from './base/base-post';
import {Router} from '../config/router'
export default modelExtend(basePost, {
  namespace: 'newPost',
  state: {
    posts: new Array(),
    sectionPosts: null,
    post: null,
  },

  effects: {
    
  },

  reducers: {
    actionAddPost(state, {payload}) {
      return {...state, ...payload}
    }
  },
})
