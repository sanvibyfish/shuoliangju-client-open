/** @format */

import * as indexApi from '../services/attachment'

export default {
  namespace: 'attachment',
  state: {
  },

  effects: {
    *upload({ payload }, { call, put }) {
      const result = yield call(indexApi.upload, payload.filePath)
      if (result) {
        return result
      }
    },
    *multiUpload({ payload }, { call, put }) {
      const { filePaths } = payload
      // let failures = new Array()
      let success = []
      for (var index in filePaths) {
        const filePath = payload.filePaths[index]
        const response = yield call(indexApi.upload, filePath)
        console.log(response)
        if (response) {
          success.push(response.blob_id)
        } else {
          break
        }
      }
      if (success.length == payload.filePaths.length) {
        return success
      } else {
        return null
      }
    },
  },
  reducers: {},
}
