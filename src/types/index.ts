export interface UserInfo {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type Dictionary<T> = {
  [key: string]: T;
};
// Augmentations for the global scope can only be directly nested in external modules or ambient module declarations
export interface BaseItem {
  docTitle: string;
  domainAccount?: string;
  id: number | string;
  name: string;
  avatar: string;
}
export interface OptionValue {
  // key?:string|undefined;
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface UserItem {
  userId?: number | string;
  userName: string;
  userAvatar: string; // 头像的 url
}

export type UserItemType = Partial<UserItem> & Partial<Omit<BaseItem, "docTitle">>;
