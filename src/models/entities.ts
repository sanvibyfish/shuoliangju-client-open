/** @format */
import EntityUtils from '../utils/entity_utils'
export default {
  namespace: 'entities',
  state: {
    posts: null,
    comments: null,
    users: null,
    sections: null,
    messages: null,
    articles: null,
    apps: null,
    groups: null,
    products: null
  },

  effects: {

  },
  

  reducers: {
    addEntities(state, {payload}) {
      console.log(payload)
      return EntityUtils.mergeEntities(state,{payload})
    }
  },
}
