/**
 * 请求公共参数
 *
 * @format
 */

export const commonParame = {}

/**
 * 请求的映射文件
 */

export const requestConfig = {
  login: '/api/v1/auth/login.json', // 登录接口
  register: '/api/v1/users.json', // 注册接口
  newPost: '/api/v1/posts.json', //发布帖子
  getProducts: '/api/v1/products.json', //获取产品列表
  createProduct: '/api/v1/products.json', //获取产品列表
  getProduct(id) {
    return `/api/v1/products/${id}.json` //获取产品图册
  },
  deleteProduct(id) {
    return `/api/v1/products/${id}.json` //删除产品图册
  },
  qrcodePost(id) {
    return `/api/v1/posts/${id}/qrcode.json` //获取帖子小程序码
  },
  likePost(id) {
    return `/api/v1/posts/${id}/like.json` //对帖子赞
  },
  unlikePost(id) {
    return `/api/v1/posts/${id}/unlike.json` //对帖子取消赞
  },
  starPost(id) {
    return `/api/v1/posts/${id}/star.json` //收藏帖子
  },
  unstarPost(id) {
    return `/api/v1/posts/${id}/unstar.json` //取消帖子收藏
  },
  excellentPost(id) {
    return `/api/v1/posts/${id}/excellent.json` //帖子加精
  },
  unexcellentPost(id) {
    return `/api/v1/posts/${id}/unexcellent.json` //取消帖子加精
  },
  topPost(id) {
    return `/api/v1/posts/${id}/top.json` //帖子置顶
  },
  untopPost(id) {
    return `/api/v1/posts/${id}/untop.json` //取消帖子置顶
  },
  banPost(id) {
    return `/api/v1/posts/${id}/ban.json` //帖子置顶
  },
  unbanPost(id) {
    return `/api/v1/posts/${id}/unban.json` //取消帖子置顶
  },
  reportPost(id) {
    return `/api/v1/posts/${id}/report.json` //举报帖子
  },
  destroyPost(id) {
    return `/api/v1/posts/${id}.json` //删除帖子
  },
  getPost(id) {
    return `/api/v1/posts/${id}.json`   //获取帖子详情
  },
  uploadFile: '/api/v1/attachments.json',
  wechatLogin: '/api/v1/auth/wechat_login.json',
  getUserInfo: '/api/v1/users/info.json',
  getUser(id:string) {
    return `/api/v1/users/${id}.json`
  },
  updateUser(id:string){
    return `/api/v1/users/${id}.json`
  },
  followUser(id:string) {
    return `/api/v1/users/${id}/follow.json`
  },
  reportUser(id) {
    return `/api/v1/users/${id}/report.json` //举报帖子
  },
  banUser(id:string) {
    return `/api/v1/users/${id}/ban.json`
  },
  unbanUser(id:string) {
    return `/api/v1/users/${id}/unban.json`
  },
  followerList(id:string) {
    return `/api/v1/users/${id}/followers.json`
  },
  followingList(id:string) {
    return `/api/v1/users/${id}/following.json`
  },
  unfollowUser(id:string) {
    return `/api/v1/users/${id}/unfollow.json`
  },
  userLikePosts(id:string){
    return `/api/v1/users/${id}/like_posts.json`; //我的点赞帖子列表
  },
  userStarPosts(id:string){
    return `/api/v1/users/${id}/star_posts.json` //我的收藏帖子列表
  },
  userPosts(id:string) {
    return `/api/v1/users/${id}/posts.json`; //我的帖子列表
  },
  getLikesMessages: '/api/v1/notifications/likes.json',     //获取我的点赞列表
  getCommentsMessages: '/api/v1/notifications/comments.json', //获取我的评论列表
  getUnreadCounts: '/api/v1/notifications/unread_counts.json', //获取消息未读列表
  readMessages: '/api/v1/notifications/read.json',       //设置消息已读
  getPosts: '/api/v1/posts.json',
  getDiscoverPosts: '/api/v1/posts/discover.json',
  getSections: '/api/v1/sections.json', //获取板块
  getComments: '/api/v1/comments.json', //获取评论列表
  createComment: '/api/v1/comments.json', //创建评论
  getArticles: '/api/v1/articles.json', // 获取文章列表
  addArticle: '/api/v1/articles.json', // 创建文章

  getApps: '/api/v1/apps.json', // 获取文章列表
  getConfig: '/api/v1/apps/app_config.json', // 获取配置
  exitApp(id:string){ //退出圈子
    return `/api/v1/apps/${id}/exit.json`
  },
  qrcodeApp(id) {
    return `/api/v1/apps/${id}/qrcode.json` //获取圈子小程序码
  },
  getAppMembers(id:string){ //退出圈子
    return `/api/v1/apps/${id}/members.json`
  },
  
  updateApp(id:string){ //更新圈子
    return `/api/v1/apps/${id}.json`
  },
  getApp(id:string) {                     
    return `/api/v1/apps/${id}.json` //获取文章详情
  },
  joinApp(id:string) {                     
    return `/api/v1/apps/${id}/join.json` //获取文章详情
  },
  createApp: '/api/v1/apps.json', //创建社区
  getArticle(id:string) {                     
    return `/api/v1/articles/${id}.json` //获取文章详情
  },
  likeArticle(id) {
    return `/api/v1/articles/${id}/like.json` //对文章赞
  },
  unlikeArticle(id) {
    return `/api/v1/articles/${id}/unlike.json` //对文章取消赞
  },
  destroyArticle(id) {
    return `/api/v1/articles/${id}.json` //删除文章
  },
  likeComment(id:string) {                     
    return `/api/v1/comments/${id}/like.json` //对评论点赞
  },
  unlikeComment(id:string) {
    return `/api/v1/comments/${id}/unlike.json` //对帖子取消赞
  },
  deleteComment(id:string) {
    return `/api/v1/comments/${id}.json` //对帖子取消赞
  },
}
