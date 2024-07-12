/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import React, { useEffect, useState } from "react";
import { Avatar, Typography } from "antd";
import { ParagraphProps } from "antd/es/typography/Paragraph";
import { UserItemType } from "@/types";

export type UserItemList = UserItemType[] | UserItemType;
type ThemeType = {
  theme?: "dark" | "light";
};
type UserListProps = {
  data: UserItemList;
  width?: number | string;
  paragraphProps?: ParagraphProps;
  style?: React.CSSProperties;
} & ThemeType;

export const User: React.FC<{ data: UserItemType } & ThemeType> = ({
  data,
  theme,
}) => {
  const avatar = data?.userAvatar ? data?.userAvatar : data?.avatar;
  const name = data?.userName ? data?.userName : data?.name;
  return (
    <>
      {avatar && <Avatar src={avatar} size={24} style={{ marginRight: 5 }} />}
      <span
        style={{
          color: theme === "dark" ? "#ccc" : "inherit",
          marginRight: 5,
          verticalAlign: "middle",
        }}
      >
        {name}
      </span>
    </>
  );
};

const UserList = (userList: UserItemList, theme: ThemeType["theme"]) => {
  return Array.isArray(userList) ? (
    userList?.map((data, index) => <User data={data} key={index}></User>)
  ) : (
    <User data={userList} theme={theme}></User>
  );
};

const UserRow: React.FC<UserListProps> = ({
  data,
  width = "100%",
  paragraphProps = {},
  style = {},
  theme = "light",
}) => {
  return (
    <>
      <Typography.Paragraph
        className="user-row"
        {...paragraphProps}
        style={{
          ...style,
          width: width,
          marginBottom: 0,
        }}
        ellipsis={{
          rows: 1,
          tooltip: {
            title: () => UserList(data, theme),
            color: theme === "dark" ? "#000" : "#ccc",
          },
        }}
      >
        {UserList(data, theme)}
      </Typography.Paragraph>
    </>
  );
};
export default UserRow;
