export const api = {
  createGroup: '/api/v1/groups.json', //创建群
  getGroups: '/api/v1/groups.json', //获取群列表
  getGroup(id) {
    return `/api/v1/groups/${id}.json` //获取
  },
  deleteGroup(id) {
    return `/api/v1/groups/${id}.json` //删除
  }
}