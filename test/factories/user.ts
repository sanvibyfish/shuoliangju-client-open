import * as Factory from "factory.ts";
import Model from '../../src/utils/model'

export const userFactory = Factory.Sync.makeFactory<Model.User>({
  id: Factory.each(i => i),
  nick_name: "tester-" + Factory.Sync.each(i => i),
  followers_count: 100,
  following_count: 100,
  following: false
});


