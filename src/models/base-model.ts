export const baseModel = {
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

