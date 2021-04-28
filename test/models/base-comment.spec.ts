import { effects } from 'redux-saga';
import { baseComment } from '../../src/models/base/base-comment'
import * as Api from '../../src/services/comment'
import { APP_ID } from '../../src/config';
import { commentFactory } from '../factories/comment'
import EntityUtils from '../../src/utils/entity_utils';

describe('base comment model', () => {
  const { call, put,select } = effects
  describe('getComments ', () => {
    const actionCreator = {
      type: 'getComments',
      payload: {
        commentable_id: "123",
        commentable_type: "Post",
        page: 1
      }
    }
    it('when successed', () => {
      const generator = baseComment.effects.getComments(actionCreator, { call, put })
      expect(generator.next().value).toEqual(call(Api.getComments, {
        ...actionCreator.payload,
        app_id: APP_ID
      }))
      let response = commentFactory.build()
      const data = EntityUtils.setComments(response)
      expect(generator.next(response).value).toEqual(put.resolve({ type: 'entities/addEntities', payload: data.entities }))
      expect( generator.next().value).toEqual(put({
        type: "actionGetComments",
        payload: {
          comment_ids: data.result,
          page: actionCreator.payload.page,
        }
      }))
      expect( generator.next().value).toBeUndefined()
    })

    it('when response empty', () => {
      const generator = baseComment.effects.getComments(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.getComments, {
        ...actionCreator.payload,
        app_id: APP_ID
      }))
      let response = null
      expect(generator.next(response).value).toBeUndefined()
    })
  })

  describe('addComment ', () => {
    const actionCreator = {
      type: 'addComment',
      payload: {
        commentable_id: 1111,
        commentable_type: "Post",
        body: "test"
      }
    }

    it('when empty', () => {
      const generator = baseComment.effects.addComment(actionCreator, { call, put })
      let next = generator.next()
      expect(next.value).toEqual(call(Api.createComment, {
        ...actionCreator.payload,
      }))
      let response = null
      next = generator.next(response)
      expect(next.value).toBeUndefined()
    })


    it('when publish with parent comment', () => {
      const generator = baseComment.effects.addComment(actionCreator, { call, put })
      expect(generator.next().value).toEqual(call(Api.createComment, {
        ...actionCreator.payload,
      }))
      let response = commentFactory.build({body:"test"})
      const data = EntityUtils.setComment(response)

      expect(generator.next(response).value).toEqual(put.resolve({ type: 'entities/addEntities', payload: data.entities }))
      expect(generator.next().value).toEqual(put({ type: 'actionAddComment', payload: {
        comment_id: data.result,
        parent: response.parent
      } }))
      expect(generator.next().value).toBeUndefined()
    })

    it('when publish with children comment', () => {
      const actionCreator = {
        type: 'addComment',
        payload: {
          commentable_id: 111,
          commentable_type: "Post",
          body: "test",
          reply_to_id: 111
        }
      }

      let parent =  commentFactory.build({children:[]})
      put.resolve({ type: 'entities/addEntities', payload: EntityUtils.setComment(parent).entities })
      let entities = EntityUtils.setComment(parent).entities

      const generator = baseComment.effects.addComment(actionCreator, { call, put,select })
      expect(generator.next().value).toEqual(call(Api.createComment, {
        ...actionCreator.payload,
      }))
      let response = commentFactory.build({body:"test",parent: parent})
      let data = EntityUtils.setComment(response)

      expect(generator.next(response).value).toEqual(put.resolve({ type: 'entities/addEntities', payload: data.entities }))
      
      expect(generator.next().value).toEqual(select(EntityUtils.getEntities))

      parent.children = [response, ...parent.children]
      expect( generator.next(entities).value).toEqual(put.resolve({ type: 'entities/addEntities', payload:EntityUtils.setComment(parent)
      .entities }))

      expect( generator.next().value).toEqual(put({ type: 'actionAddComment', payload: {
        comment_id: data.result,
        parent: response.parent
      } }))
      
      expect(generator.next().value).toBeUndefined()
    })


  })

  describe('deleteComment', () => {
    const actionCreator = {
      type: 'deleteComment',
      payload: {
        commentable_id: 111,
        id: 123
      }
    }

    it('when delete parent comment', () => {
      let comment = commentFactory.build({id:123})
      let data = EntityUtils.setComment(comment)
      put.resolve({ type: 'entities/addEntities', payload: data.entities })


      let entities = data.entities
      const generator = baseComment.effects.deleteComment(actionCreator, { call, put,select})
      expect(generator.next().value).toEqual(call(Api.deleteComment, {
        ...actionCreator.payload,
      }))
      expect(generator.next().value).toEqual(select(EntityUtils.getEntities))
      expect(generator.next(entities).value).toEqual(put({ type: 'actionDeleteComment', payload: {
        comment_id: actionCreator.payload.id
      } }))
      
      expect(generator.next().value).toBeUndefined()
    })


    it('when delete childread comment', () => {
      let parent = commentFactory.build()
      let comment1 = commentFactory.build({parent:parent})
      let comment2 = commentFactory.build({parent:parent, id:actionCreator.payload.id})
      parent.children = [comment1, comment2]
      let data = EntityUtils.setComments([parent,comment1, comment2])
      put.resolve({ type: 'entities/addEntities', payload: data.entities })


      let entities = data.entities
      const generator = baseComment.effects.deleteComment(actionCreator, { call, put,select})
      expect(generator.next().value).toEqual(call(Api.deleteComment, {
        ...actionCreator.payload,
      }))
      expect(generator.next().value).toEqual(select(EntityUtils.getEntities))
      parent.children = EntityUtils.removeEntityById(parent.children, actionCreator.payload.id)
      expect( generator.next(entities).value).toEqual(put.resolve({ type: 'entities/addEntities', payload:EntityUtils.setComment(parent)
      .entities }))

      expect(generator.next().value).toEqual(put({ type: 'actionDeleteComment', payload: {
        comment_id: actionCreator.payload.id
      } }))
      expect(generator.next().value).toBeUndefined()
    })
  })

  describe('likeComment', () => {

    const actionCreator = {
      type: 'likeComment',
      payload: {
        id: 123
      }
    }

    let response = commentFactory.build({id:12})
    let data = EntityUtils.setComment(response)
    put.resolve({ type: 'entities/addEntities', payload: data.entities })

    it('when like comment', () => {
      const generator = baseComment.effects.likeComment(actionCreator, { call, put,select})
      expect(generator.next().value).toEqual(call(Api.likeComment, {
        ...actionCreator.payload,
      }))
      expect( generator.next(response).value).toEqual(put.resolve({ type: 'entities/addEntities', payload:data.entities
     }))
      expect(generator.next().value).toEqual(put({ type: 'actionLikeComment', payload: {
        comment_id: actionCreator.payload.id
      } }))
      expect(generator.next().value).toBeUndefined()
    })


  })

  
})