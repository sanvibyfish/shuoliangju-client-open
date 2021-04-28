import { unstarPost } from './../services/post';
/** @format */

import * as PostApi from '../services/post'
import * as SectionApi from '../services/section'
import * as CommentApi from '../services/comment'
import Tips from '../utils/tips'
import { baseComment } from './base/base-comment';
import {basePost} from './base/base-post'
import modelExtend from 'dva-model-extend'
import EntityUtils from '../utils/entity_utils';

export default modelExtend(baseComment,basePost,{
  namespace: 'postDetail',

  state: {
    post: null
  },

  effects: {
    *qrcodePost({payload}, {call, put}) {
      const response = yield call(PostApi.qrcodePost, {
        ...payload,
      })
      return response
    },
    *getComments({ payload }, { call, put, select}) {
      const response = yield call(CommentApi.getComments, {
        ...payload
      })
      if (response) {
        let { entities } = yield select()
        let post = EntityUtils.getPost(entities, payload.commentable_id)
        let reset = payload.page == 1 ? true : false
        if(!reset) {
          post.comments = EntityUtils.appendEntity(post.comments, response)
        } else {
          post.comments = response
        }
        const data = EntityUtils.setPost(post)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: "update",
          payload: {
            page: payload.page,
            reset: payload.page == 1 ? true : false,
            isLast : (response.length == 0 && payload.page > 1) ? true : false,
            postId: payload.commentable_id
          },
        })
      }
    },
  },
  reducers: {
    actionLikeComment(state,{payload}) {
      const {commentable_id,entities} = payload
      payload.post =  EntityUtils.getPost(entities,commentable_id)
      payload.entities = null
      console.log(payload.post)
      return { ...state, ...payload }
    },
    actionUnlikeComment(state,{payload}) {
      const {commentable_id,entities} = payload
      payload.post =  EntityUtils.getPost(entities,commentable_id)
      payload.entities = null
      console.log(payload.post)
      return { ...state, ...payload }
    },
    newPost(state, { payload }) {
      if (payload.extra.currentIndex == 0) {
        let posts = [...state.posts]
        posts.splice(0, 0, payload.post)
        return {
          ...state,
          posts: [...posts],
        }
      } else {
        return { ...state, ...payload }
      }
    },
  },
})
