import Model from '../utils/model'
import {globalData} from '../utils/common'
import { PostModel,ArticleModel } from '../models/data/model'
export default class Action {

  static getPostActions(post: PostModel):Array<any> {
    let items:Array<any> = []

    if (post.abilities.hasOwnProperty("top") && post.abilities.top && post.top == false) {
      items.push({ key: "top", value: "置顶"})
    }

    if (post.abilities.hasOwnProperty("untop") && post.abilities.untop && post.top == true) {
      items.push({key:"untop",value:"取消置顶"})
    }


    if (post.abilities.hasOwnProperty("ban") && post.abilities.ban && post.state == "active") {
      items.push({ key: "ban", value: "隐藏"})
    }

    if (post.abilities.hasOwnProperty("unban") && post.abilities.unban && post.state == "ban") {
      items.push({ key: "unban", value: "取消隐藏"})
    }

    if (post.abilities.hasOwnProperty("report") && post.abilities.report) {
      items.push({ key: "report", value: "举报"})
    }

    if (post.abilities.hasOwnProperty("excellent") && post.abilities.excellent && post.grade == "normal") {
      items.push({key:"excellent",value:"加精"})
    }

    if (post.abilities.hasOwnProperty("unexcellent") && post.abilities.unexcellent && post.grade == "excellent") {
      items.push({key:"unexcellent",value:"取消精华"})
    }

    if (post.abilities.hasOwnProperty("destroy") && post.abilities.destroy) {
      items.push({key:"destroy",value:"删除"})
    }
    return items
  }

  static getKey(value:string){
    switch (value) {
      case "举报":
        return "report"
      case "隐藏":
        return "ban"
      case "取消隐藏":
        return "unban"
      case "置顶":
        return "top"
      case "取消置顶":
        return "untop"
      case "加精":
        return "excellent"
      case "取消精华":
        return "unexcellent"
      case "删除":
        return "destroy"
      case "回复":
        return "reply"
      default:
        break;
    }
  }

  static sendAction(action:any, dispatch:any, post_id: string){
    dispatch({
      type: `post/${action.key}`,
      payload: {
        id: post_id,
      },
    })
  }


  static getUserKey(value:string){
    switch (value) {
      case "举报":
        return "report"
      case "禁用":
        return "ban"
      case "取消禁用":
        return "unban"
      case "删除":
        return "destroy"
      default:
        break;
    }
  }

  static sendUserAction(action:any, dispatch:any, userId: number){
    return dispatch({
      type: `user/${action.key}`,
      payload: {
        id: userId,
      },
    })
  }

  static sendArticleAction(action:any, dispatch:any, id: string){
    dispatch({
      type: `article/${action.key}`,
      payload: {
        id: id,
      },
    })
  }

  static getUserActions(user):Array<any> {
    let items:Array<any> = []

    if (user.abilities.hasOwnProperty("report") && user.abilities.report && user.id != globalData.userInfo.id) {
      items.push({ key: "report", value: "举报"})
    }

    if (user.abilities.hasOwnProperty("ban") && user.abilities.ban && user.id != globalData.userInfo.id && user.state == 'normal') {
      items.push({ key: "ban", value: "禁用"})
    }

    if (user.abilities.hasOwnProperty("ban") && user.abilities.ban && user.id != globalData.userInfo.id && user.state == 'blocked') {
      items.push({ key: "unban", value: "取消禁用"})
    }

    return items
  }

  static getCommentActions(comment: Model.Comment):Array<any> {
    let items:Array<any> = []
    if (comment.user.id != globalData.userInfo.id) {
      items.push({key:"reply",value:"回复"})
    }

    if (comment.abilities.hasOwnProperty("destroy") && comment.abilities.destroy) {
      items.push({key:"destroy",value:"删除"})
    }
    return items
  }


  static getArticleActions(article: ArticleModel):Array<any> {
    let items:Array<any> = []
    console.log(article)
    if (article.abilities.hasOwnProperty("destroy") && article.abilities.destroy) {
      items.push({key:"destroy",value:"删除"})
    }
    return items
  }

}