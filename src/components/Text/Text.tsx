import React from "react";
import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { LinkProps } from "antd/es/typography/Link";
import { ParagraphProps } from "antd/es/typography/Paragraph";

const Text: React.FC<
  {
    style?: React.CSSProperties;
    children?: React.ReactNode;
    isTitle?: boolean;
    preWrap?: boolean; // 根据 \n \s 解析文本
    needEllipsis?: boolean;
    noLink?: boolean;
  } & TextProps &
    LinkProps &
    ParagraphProps
> = ({
  style = {},
  children = "",
  isTitle = false,
  preWrap = false,
  needEllipsis = true,
  noLink = false,
  ...prop
}) => {
  const titleStyle: React.CSSProperties = isTitle
    ? { fontSize: 16, fontWeight: 600 }
    : {};

  const isLink = prop.href && !noLink;

  if (preWrap) {
    const preWrapStyle: React.CSSProperties = { whiteSpace: "pre-wrap" };
    return (
      <Typography.Paragraph
        {...prop}
        ellipsis={{ tooltip: children }}
        style={{
          width: "100%",
          marginBottom: 0,
          ...titleStyle,
          ...preWrapStyle,
          ...style,
        }}
      >
        {isLink ? (
          <Typography.Link {...prop}>{children}</Typography.Link>
        ) : (
          children
        )}
      </Typography.Paragraph>
    );
  }
  return (
    <Typography.Text
      {...prop}
      ellipsis={{ tooltip: needEllipsis && children }}
      style={{ width: "100%", ...titleStyle, ...style }}
    >
      {isLink ? (
        <Typography.Link {...prop}>{children}</Typography.Link>
      ) : (
        children
      )}
    </Typography.Text>
  );
};

export default Text;
