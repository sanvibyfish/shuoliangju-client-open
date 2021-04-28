/** @format */

import {denormalize, schema} from 'normalizr'

// const entityMergeStrategy = (objA, objB) => {
//   console.log("A",objA)
//   console.log("B",objB)
//   console.log("C",{
//     ...objA,
//     ...objB,
//   })
//   return {
//     ...objA,
//     ...objB,
//   }
// }

// const userProcessStrategy = (value, parent, key) => {
//   console.log("userProcessStrategy",value,parent,key)
//   switch (key) {
//     default:
//       return { ...value };
//   }
// };


export const user = new schema.Entity('users',{},{
  // mergeStrategy: entityMergeStrategy,
  // processStrategy: userProcessStrategy
})

export const app = new schema.Entity('apps',{
  own: user
})

export const message = new schema.Entity('messages')

export const parent = new schema.Entity('comments', {
  user: user,
})

export const product = new schema.Entity('products', {
  user: user,
})


export const children = new schema.Entity('comments', {
  user: user,
})
export const section = new schema.Entity('sections')


export const comment = new schema.Entity('comments', {
  user: user,
  children: [children],
  parent: parent,
  app: app
})



export const article = new schema.Entity('articles', {
  comments: [comment],
  user: user
})

export const post = new schema.Entity('posts', {
  user: user,
  likes: [user],
  comments: [comment],
  section: section,
  app: app
})


export const group = new schema.Entity('groups', {
  user: user,
  app: app
})



export const getUsers = (users: any,entities: any) => {
  return denormalize(users, [user], entities)
}