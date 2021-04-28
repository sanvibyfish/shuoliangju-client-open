import { effects } from 'redux-saga';
import post from '../../../src/models/common/post'
import * as Api from '../../../src/services/post'
import { normalize } from 'normalizr'
import { post as postSchema } from '../../../src/models/schema'

describe('post model', () => {
  describe('effects', () => {
    let response = {
      "id": 88,
      "body": "",
      "images_url": [
        "https://shuoliangju.oss-cn-hangzhou.aliyuncs.com/images/a1f9f7z9npwv4ics7ruw34wkup0l"
      ],
      "grade": "excellent",
      "created_at": 1581664284396,
      "likes_count": 0,
      "liked": true,
      "user": {
        "id": 102,
        "nick_name": "Sanvi L. 🎰",
        "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo978kzROiajouuWNcIW8bcvgKjEapTWLMnCBicz1n0VIqLjUic59oBUsqBmzXEQ288L59AYu3cd7MNQ/132"
      },
      "likes": [
        {
          "id": 105,
          "nick_name": "Sanvi L. 🎰"
        },
        {
          "id": 102,
          "nick_name": "Sanvi L. 🎰"
        }
      ],
      "comments": [],
      "comments_count": 0,
      "has_more_comments": false
    }
    const { call, put } = effects
    const actionCreator = {
      type: 'post/likePost',
      payload: {
        id: "111"
      }
    }
    describe('likePost', () => {
      const generator = post.effects.likePost(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.likePost, {
        ...actionCreator.payload
      }))
      it('when likePost successed', () => {
        response.likes_count = 1
        next = generator.next(response)
        
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload:  normalize(response, postSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
      it('when likePost faild', () => {
        next = generator.next(null)
        expect(next.value).toBeUndefined()
      })
    })
  
    describe('unlikePost', () => {
      const generator = post.effects.unlikePost(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.unlikePost, {
        ...actionCreator.payload
      }))
      it('when unlikePost successed', () => {
        next = generator.next(response)
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload:  normalize(response, postSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
      it('when unlikePost faild', () => {
        next = generator.next(null)
        expect(next.value).toBeUndefined()
      })
    })
  
    describe('excellent', () => {
      const generator = post.effects.excellent(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.excellentPost, {
        ...actionCreator.payload
      }))
      it('when excellent successed', () => {
        next = generator.next(response)
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload:  normalize(response, postSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
      it('when excellent faild', () => {
        next = generator.next(null)
        expect(next.value).toBeUndefined()
      })
    })
  
    describe('unexcellent', () => {
      const generator = post.effects.unexcellent(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.unexcellentPost, {
        ...actionCreator.payload
      }))
      it('when unexcellent successed', () => {
        next = generator.next(response)
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload:  normalize(response, postSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
      it('when unexcellent faild', () => {
        next = generator.next(null)
        expect(next.value).toBeUndefined()
      })
    })
  
    describe('top', () => {
      const generator = post.effects.top(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.topPost, {
        ...actionCreator.payload
      }))
      it('when top successed', () => {
        next = generator.next(response)
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload:  normalize(response, postSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
      it('when top faild', () => {
        next = generator.next(null)
        expect(next.value).toBeUndefined()
      })
    })
  
    describe('untop', () => {
      const generator = post.effects.untop(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.untopPost, {
        ...actionCreator.payload
      }))
      it('when untop successed', () => {
        next = generator.next(response)
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload:  normalize(response, postSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
      it('when untop faild', () => {
        next = generator.next(null)
        expect(next.value).toBeUndefined()
      })
    })
    
    describe('destroy', () => {
      const generator = post.effects.destroy(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.destroyPost, {
        ...actionCreator.payload
      }))
      it('when destroy successed', () => {
        next = generator.next(null)
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
  
    })
    
  })

  describe('reducers', ()=>{
    describe('update', ()=>{
      it("should update payload", ()=> {
        const state = {post:" "}
        const result = post.reducers.update(state,{payload:{post: "test"}})
        expect(result.post).toEqual('test')
      })
    })
  })

})