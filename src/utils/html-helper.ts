/** @format */

class HtmlHelper {
  static getLikesHtml(likes: Array<any>) {
    return likes
      .map(
        (user, i) =>
          "<a style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;' href='like$" +
          user.id + 
          "'>" +
          user.nick_name +
          '</a>' +
          (i == likes.length - 1 ? '' : "<span style='color:#4c75e9;font-size:14px;font-weight:bold;'>,</span>") +
          (i == likes.length - 1 ? "<span style='color:#4c75e9;font-size:14px;font-weight:bold;'>等人赞过</span>" : ''),
      )
      .join('')
  }

  static getCommentsHtml(comments: Array<any>) {
    return comments
      .map(
        comment =>
          "<div class='comment-text'>" +
          "<a style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;' href='comment-user$" +
          comment.user.id + 
          "'>" +
          comment.user.nick_name +
          '</a>' +
          (comment.reply_to && (comment.reply_to.user.id != comment.user.id)
            ? "<span class='comment-user-reply' style='font-size:14px;'>回复</span><a style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;' href='comment-user$" +
            comment.reply_to.user.id + 
            "'>" +
              comment.reply_to.user.nick_name +
              ':</a>'
            : "<span style='color:#4c75e9;font-size:14px;font-weight:bold;'>:</span>") +
          "<a style='font-size:14px;text-decoration: none;color:#000;' href='comment$" +
          comment.id +
          '$' +
          comment.user.id +
          '$' +
          comment.user.nick_name +
          "'>" +
          comment.body +
          '</a>' +
          (comment.image_url
            ? "<a href='img$" +
              comment.image_url +
              "' style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;'>查看图片</a>"
            : '') +
          '</div>',
      )
      .join('')
  }

  static getDetailCommentsHtml(comments: Array<any>) {
    return comments
      .map(
        comment =>
          "<div class='comment-text'>" +
          "<a style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;' href='comment-user$" +
          comment.user.id + 
          "'>" +
          comment.user.nick_name +
          '</a>' +
          (comment.reply_to && comment.reply_to.id != comment.parent_id
            ? "<span class='comment-user-reply' style='font-size:14px;'>回复</span><a style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;' href='comment-user$" +
            comment.reply_to.user.id + 
            "'>" + 
              comment.reply_to.user.nick_name +
              ':</a>'
            : "<span style='color:#4c75e9;font-size:14px;font-weight:bold;'>:</span>") +
          "<a style='font-size:14px;text-decoration: none;color:#000;' href='comment$" +
          comment.id +
          '$' +
          comment.user.id +
          '$' +
          comment.user.nick_name +
          "'>" +
          comment.body +
          '</a>' +
          (comment.image_url
            ? "<a href='img$" +
              comment.image_url +
              "' style='color:#4c75e9;font-size:14px;font-weight:bold;text-decoration: none;'>查看图片</a>"
            : '') +
          '</div>',
      )
      .join('')
  }
}
export default HtmlHelper
