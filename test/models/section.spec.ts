import { effects } from 'redux-saga';
import section from '../../src/models/section'
import * as Api from '../../src/services/section'
describe('section model', () => {
  it('getSections -> when getsections successed', () => {
    // Given
    const {call, put} = effects
    const actionCreator = {
      type: 'section/getSections',
      payload: {
      }
  }
  const generator = section.effects.getSections(actionCreator, { call, put })
  let next = generator.next()
  expect(next.value).toEqual(call(Api.getSections, {
    ...actionCreator.payload
  }))

  let response = [{
    "id": 6,
    "name": "ff防守打法",
    "icon_url": "https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/k86ong4givku52ntcjh51eddd8vx",
    "summary": null,
    "abilities": {
      "destroy": false
    }
  }]
  next = generator.next(response)
  expect(next.value).toEqual(put({ type: 'save', payload:{
    sections: response
  }}))
  next=generator.next()
  expect(next.value).toBeUndefined()
  })

  it('getSections -> when getsections faild', () => {
    // Given
    const {call, put} = effects
    const actionCreator = {
      type: 'section/getSections',
      payload: {
      }
  }
  const generator = section.effects.getSections(actionCreator, { call, put })
  let next = generator.next()
  expect(next.value).toEqual(call(Api.getSections, {
    ...actionCreator.payload,
    app_id: APP_ID
  }))

  let response = null
  next = generator.next(response)
  expect(next.value).toEqual(put({ type: 'save', payload:{
    sections: response
  }}))
  next=generator.next()
  expect(next.value).toBeUndefined()
  })
})