import { effects } from 'redux-saga';
import comment from '../../../src/models/common/comment'
import * as Api from '../../../src/services/comment'
import { normalize } from 'normalizr'
import { comment as commentSchema } from '../../../src/models/schema'

describe("comment model", () => {
  describe("effects", () => {
    describe("addComment", () => {
      it("when post body comment", () => {
        // Given
        const { call, put, select } = effects
        const actionCreator = {
          type: 'comment/addComment',
          payload: {
            body: "test body",
            post_id: "1111"
          }
        }
        let response = {
          "id": 51,
          "body": "111111",
          "image_url": null,
          "likes_count": 0,
          "created_at": 1585215862139,
          "post_id": 19,
          "liked": false,
          "children": [],
          "user": {
            "id": 4,
            "nick_name": "Sanvi L. 🎰",
            "avatar_url": "https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/fyienkhbjt8gv4lnzeu0y5cm6zm1",
            "state": "admin",
            "following": false,
            "abilities": {
              "destroy": true,
              "ban": true
            }
          },
          "abilities": {
            "destroy": true
          }
        }

        const generator = comment.effects.addComment(actionCreator, { call, put, select })
        let next = generator.next()
        expect(next.value).toEqual(call(Api.createComment, {
          ...actionCreator.payload
        }))


        let entities = {
          entities: normalize(response, commentSchema).entities
        }
        comment.state = {
          entities: entities
        }
        next = generator.next(response)
        expect(next.value).toEqual(select((state:any)=> state.entities))
        expect(next.value).toEqual(put.resolve({
          type: 'entities/addEntities',
          payload: normalize(response, commentSchema).entities
        }))
        next = generator.next()
        expect(next.value).toEqual(put({ type: 'update', payload: {} }))
        next = generator.next()
        expect(next.value).toBeUndefined()
      })
    })
  })
})