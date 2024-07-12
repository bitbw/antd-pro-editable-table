/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, forwardRef } from "react";
import { Avatar, Select, Tag } from "antd";
const { Option } = Select;
import type { SelectProps } from "antd";
import type { CustomTagProps, BaseSelectRef } from "rc-select/lib/BaseSelect";
import { fuzzyMatch } from "@/utils/string";
import { BaseItem, Dictionary } from "@/types";

const tagRender = (props: CustomTagProps) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ height: 26 }}
    >
      {label}
    </Tag>
  );
};
export interface UserSelectProps extends SelectProps {
  value?: any[];
  valuekey?: "id" | "domainAccount";
  options: BaseItem[] | any;
  isMultiple?: boolean; // 是否多选
  labelInValue?: boolean; // 返回选中项的 label 和 option 的详细数据
}

const UserSelect: React.FC<UserSelectProps> = (prop, ref) => {
  const {
    value: rawValue,
    options: rawOptions = [],
    isMultiple = true,
    mode = "multiple",
    valuekey = "id",
    onChange,
    labelInValue,
    // ...restProps
  } = prop;
  const [value, setValue] = useState<any>("");
  const [newProps, setNewProps] = useState<SelectProps>({}); // selet 属性

  const handleChange: any = (value: any, option: any) => {
    if (!onChange) return;
    if (labelInValue) {
      let newValue: any;
      if (Array.isArray(option)) {
        // 多选
        newValue = option.map((item) => ({
          ...item,
          ...item.item,
          label: item.item.name,
        }));
      } else {
        // 单选
        newValue = {
          ...option,
          ...option.item,
          label: option.item.name,
        };
      }
      onChange?.(newValue, option);
      return;
    }
    onChange?.(value, option);
  };

  const getNewProps = (prop: SelectProps) => {
    let newProp: any = {};
    for (const key in prop) {
      if (Object.prototype.hasOwnProperty.call(prop, key)) {
        if (
          ![
            "isMultiple",
            "value",
            "options",
            "labelInValue",
            "onChange",
          ].includes(key)
        ) {
          //  UserSelect 组件中需要自定义的参数
          newProp[key] = (prop as Dictionary<any>)[key];
        }
      }
    }
    if (isMultiple) {
      // 多选
      newProp = {
        ...newProp,
        mode,
      };
    } else {
      // 非多选去除 props.mode
      if (newProp.mode) {
        delete newProp.mode;
      }
    }
    // console.log("UserSelect prop change : newProp", newProp);
    return newProp;
  };

  useMemo(() => {
    if (!rawValue && isMultiple) {
      setValue([]); // 设置多选默认值
      return;
    }
    let newValue: any;
    if (labelInValue && rawValue) {
      if (Array.isArray(rawValue)) {
        newValue = rawValue.map((item) => item.value);
      } else {
        newValue = (rawValue as any).value;
      }
      setValue(newValue);
      return;
    }
    setValue(rawValue);
  }, [rawValue]);
  //  TODO : 针对需要改变的属性添加到监听列表中
  useMemo(() => {
    // console.log("UserSelect prop change : rawProp", prop);
    setNewProps(getNewProps(prop));
  }, [prop.disabled, prop.loading, isMultiple, mode, prop.style]);

  return (
    <>
      <Select
        {...newProps}
        ref={ref}
        allowClear={prop.allowClear ?? true}
        value={value}
        // showSearch={showSearch}
        onChange={handleChange}
        tagRender={tagRender}
        filterOption={(inputValue, option) => {
          const name = option?.item.name;
          const domainAccount = option?.item.domainAccount || ""; // domainAccount 作为拼音匹配
          // const reg = new RegExp(inputValue);
          // if (reg.test(name + "") || reg.test(domainAccount + "")) {
          if (
            fuzzyMatch(inputValue, name + "") ||
            fuzzyMatch(inputValue, domainAccount + "")
          ) {
            return true;
          }
          return false;
        }}
      >
        {rawOptions?.map((item: BaseItem) => {
          return (
            <Option value={item[valuekey]} key={item[valuekey]} item={item}>
              {item.avatar && (
                <Avatar
                  size={24}
                  src={item.avatar}
                  style={{ marginRight: 5 }}
                />
              )}
              <span
                style={{ verticalAlign: isMultiple ? "middle" : "inherit" }}
              >
                {item.name}
              </span>
            </Option>
          );
        })}
      </Select>
    </>
  );
};
// export default UserSelect;

// forwardRef 包装一下
export default forwardRef<BaseSelectRef, UserSelectProps>(function wrap(
  prop,
  ref
) {
  return UserSelect({ ...prop }, ref);
});
