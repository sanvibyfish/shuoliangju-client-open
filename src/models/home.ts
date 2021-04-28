/** @format */

import * as PostApi from '../services/post'
import * as CommentApi from '../services/comment'
import * as SectionApi from '../services/section'
import modelExtend from 'dva-model-extend'
import {post, section} from './schema'
import {normalize} from 'normalizr'
import { baseComment } from './base/base-comment';
import { basePost } from './base/base-post';
import { baseSection } from './base/base-section'
import { baseApp } from './base/base-app'

import EntityUtils from '../utils/entity_utils'

export default modelExtend(baseComment,basePost,baseSection,baseApp,{
  namespace: 'home',

  state: {
    sectionIds: null,
    comments: null,
    topList: null
  },

  effects: {
    *getTopPosts({payload}, {call, put}) {
      const response = yield call(PostApi.getPosts, {
        ...payload
      })
      const data = normalize(response, [post])
      yield put.resolve({
        type: 'entities/addEntities',
        payload: data.entities,
      })
      yield put({
        type: 'update',
        payload: {
          topList: data.result
        },
      })
    }
  },
  reducers: {
    actionDestroyPost(state, {payload}) {
      const { postId } = payload
      console.log("action destroy post id", postId)
      payload.postIds = state.postIds.filter((id)=>{ return id != postId})
      return {...state, ...payload}
    },
    actionAddComment(state, { payload }) {
      const {entities,comment} = payload
      let post = EntityUtils.getPost(entities,comment.commentable_id)
      post.comments = EntityUtils.pushEntity(post.comments, post)
      let post_ids = EntityUtils.setPosts(state.posts).result
      payload.posts = EntityUtils.getPosts(entities, post_ids)
      payload.posts.map((item) => {
        if(item.id == post.id){
          return post
        }
      })
      return {...state,...payload }
    },
    newPost(state, {payload}) {
      if (payload.extra.currentIndex == 0) {
        let posts = [...state.posts]
        posts.splice(0, 0, payload.post)
        return {
          ...state,
          posts: [...posts],
        }
      } else {
        return {...state, ...payload}
      }
    },
  },
}) 
