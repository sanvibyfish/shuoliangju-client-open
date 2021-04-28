/** @format */
import {article,comment,post,user,section,app,group,product} from '../models/schema'
import {denormalize,normalize} from 'normalizr'

class EntityUtils {

  static merge(entities,responses) {
    if( this.notEmpty(entities) && this.notEmpty(responses)) {
      let mergeResponses = Object.keys(responses).map((key) => {
        if(entities[key]) {
          //merge
          return {...entities[key],...responses[key]}
        } else {
          return {...responses[key]}
        }
      }).reduce((map, item) => {
        map[item.id] = item
        return map
      },{})
      return {...entities, ...mergeResponses}
    }else {
      return {...entities, ...responses}
    }
  }

  static notEmpty(obj) {
    return (obj != null && Object.keys(obj).length > 0)
  }

  static getArticles(entities, article_ids) {
    return denormalize(article_ids, [article], entities)
  }
  

  static getArticle(entities, article_id) {
    return denormalize(article_id, article, entities)
  }

  static getSection(entities, sectionId) {
    return denormalize(sectionId, section, entities)
  }

  static getSections(entities, sectionIds) {
    return denormalize(sectionIds, [section], entities)
  }

  static setSections(appEntity) {
    return normalize(appEntity,[section])
  }

  

  static setArticle(entity) {
    return normalize(entity,article)
  }
  static setArticles(entity) {
    return normalize(entity,[article])
  }

  static setComment(commentEntity) {
    return normalize(commentEntity,comment)
  }

  static setApps(appEntity) {
    return normalize(appEntity,[app])
  }

  static setApp(appEntity) {
    return normalize(appEntity,app)
  }

  static getApp(entities, appId) {
    return denormalize(appId, app, entities)
  }

  static getApps(entities, appIds) {
    return denormalize(appIds, [app], entities)
  }

  static setComments(commentEntity) {
    return normalize(commentEntity,[comment])
  }

  static getComments(entities, comment_ids) {
    return denormalize(comment_ids, [comment], entities)
  }

  static getComment(entities, comment_id) {
    return denormalize(comment_id, comment, entities)
  }


  static setUser(userEntity) {
    return normalize(userEntity,user)
  }

  static setUsers(userEntity) {
    return normalize(userEntity,[user])
  }

  static getUser(entities, userId) {
    return denormalize(userId, user, entities)
  }

  static getUsers(entities, userIds) {
    return denormalize(userIds, [user], entities)
  }


  static setPost(postEntity) {
    return normalize(postEntity,post)
  }

  static setPosts(postEntity) {
    return normalize(postEntity,[post])
  }

  static getPosts(entities, post_ids) {
    return denormalize(post_ids, [post], entities)
  }

  static getPost(entities, post_id) {
    return denormalize(post_id, post, entities)
  }

  static setGroup(entity) {
    return normalize(entity,group)
  }

  static setGroups(entities) {
    return normalize(entities,[group])
  }


  static setProduct(entity) {
    return normalize(entity,product)
  }

  static setProducts(entities) {
    return normalize(entities,[product])
  }

  static getProducts(entities, productIds) {
    return denormalize(productIds, [product], entities)
  }

  static getProduct(entities, productId) {
    return denormalize(productId, product, entities)
  }

  static getGroups(entities, groupIds) {
    return denormalize(groupIds, [group], entities)
  }

  static getGroup(entities, groupId) {
    return denormalize(groupId, group, entities)
  }

  static removeEntityById(array:Array<any>,id:number):Array<any> {
    return [...array.filter((item) => { return item.id != id})]
  }

  static removeEntity(array:Array<any>,object:any):Array<any> {
    return [...array.filter((item) => { return item.id != object.id})]
  }


  static pushEntity(array:Array<any>, item: any):Array<any> {
    return [item, ...array]
  }

  static appendEntity(array:Array<any>, newArray:Array<any>) {
    return array.concat(newArray)
  }

  static getEntities = state => state.entities

  static mergeEntities(state, {payload}){
    return {
      ...state,
      posts:EntityUtils.merge(state.posts,payload.posts),
      comments: EntityUtils.merge(state.comments,payload.comments),
      users: EntityUtils.merge(state.users, payload.users),
      sections: EntityUtils.merge(state.sections, payload.sections),
      messages: EntityUtils.merge(state.messages, payload.messages),
      articles: EntityUtils.merge(state.articles, payload.articles),
      apps: EntityUtils.merge(state.apps, payload.apps),
      groups: EntityUtils.merge(state.groups, payload.groups),
      products: EntityUtils.merge(state.products, payload.products),
    }
  }
}

export default EntityUtils
