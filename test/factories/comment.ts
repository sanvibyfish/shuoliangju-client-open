import * as Factory from "factory.ts";
import Model from '../../src/utils/model'
import {userFactory} from './user'
export const commentFactory = Factory.Sync.makeFactory<Model.Comment>({
  id: Factory.Sync.each(i => i),
  body: "xxxxx",
  image_url: null,
  app_id: 52,
  commentable_id: 111,
  created_at: Factory.Sync.each(() => new Date().getTime()),
  reply_to: null,
  parent: null,
  children: [],
  user: userFactory.build()
});


