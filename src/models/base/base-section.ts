import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import * as Api from '../../services/section'
import EntityUtils from '../../utils/entity_utils'

export const baseSection = modelExtend(baseModel, {

  effects: {
    *getSections({payload}, {call, put}) {
      const response = yield call(Api.getSections, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setSections(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetSections',
          payload: {
            sectionIds: data.result,
          },
        })
      }


    },
  },

  reducers: {
    actionGetSections(state, { payload }) {
      return { ...state, ...payload }
    }
  }
})