/** @format */

export interface UserModel {
  id: number
  nick_name: string
  avatar_url?: string
  country?: string
  province?: string
  city?: string
  gender?: number
  prefecture?: string
  post_count?: number
  followers_count: number
  following_count: number
  following: boolean
}
// Generated by https://quicktype.io

export interface ArticleModel {
  id: number;
  title: string;
  image_url: string;
  likes_count: number;
  created_at: number;
  hits: number;
  comments_count: number;
  user: UserModel;
  comments: Array<Comment>;
  summary: string;
  content: string;
  liked: boolean;
  abilities: Abilities
}

export interface Abilities {
  destroy: boolean;
  ban: boolean;
  join: boolean;
}// Generated by https://quicktype.io

export interface SectionModel {
  id:        number;
  name:      string;
  icon_url:  string;
  summary:   null;
  abilities: Abilities;
}

// Generated by https://quicktype.io

export interface Notification {
  id: number
  notify_title: string
  created_at: number
  notify_body: string
  notify_avatar_url: string
  post_id: string
  read: boolean
}

// Generated by https://quicktype.io

export interface UnreadCounts {
  likes_unread_count: number
  comments_unread_count: number
  system_unread_count: number
}


export interface NotificationModel {
  id: number
  notify_title: string
  created_at: number
  notify_body: string
  notify_avatar_url: string
  resource_id: number
  resource_type: string
  read: boolean
}

// Generated by https://quicktype.io

export interface PostModel {
  id: number
  body: string
  images_url: string[]
  grade: string
  created_at: number
  likes_count: number
  liked: boolean
  star: boolean
  user: UserModel
  likes: UserModel[]
  comments: Array<Comment>
  comments_count: number
  has_more_comments: boolean
  abilities: Actions
  thumbnails_url: string[]
  top: boolean
  state: "ban" | "active"
}

// Generated by https://quicktype.io

export interface AppModel {
  id:         number;
  name:       string;
  logo_url:   string;
  summary:    string;
  created_at: number;
  own: UserModel
  users_count: number;
  posts_count: number;
  abilities: Abilities
}







// Generated by https://quicktype.io

export interface Comment {
  id: number
  body: string
  image_url?: string | null
  app_id: number
  created_at: number
  commentable_id: number
  reply_to?: Comment | null
  parent?: Comment | null
  children: Array<Comment>
  user: UserModel
  abilities?: Actions
}


// Generated by https://quicktype.io

export interface Actions {
  destroy: boolean;
  top: boolean;
  untop: boolean;
  excellent: boolean;
  unexcellent: boolean;
  ban: boolean;
  unban: boolean;
  report: boolean;
}

