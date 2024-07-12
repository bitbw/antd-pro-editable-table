/* eslint-disable @typescript-eslint/no-explicit-any */
// from https://ant.design/components/table-cn#components-table-demo-edit-cell
import React, { useEffect, useRef, useState } from "react";
import { Form, FormInstance } from "antd";
import style from "@/components/ToggleEditTable/index.module.less";
import {
  getEditable,
  getKey,
  parseData,
  EditableCellProps,
  getFromItemComponent,
} from "@/components/ToggleEditTable/helper";
import Text from "@/components/Text";
import { debounce } from "lodash";
const ToggleEditableCell: React.FC<EditableCellProps> = (
  props = {} as EditableCellProps
) => {
  const {
    title,
    editable = false,
    children,
    dataIndex,
    record,
    valueType = "input",
    fieldProps = {},
    formItemProps = {},
    type = "",
    form: formInstance = null as any as FormInstance<any>,
    // rowindex = 0,
    handleSave = () => 1,
    parseData: handleParseData = parseData,
    ...restProps
  } = props;
  title; // todo delete
  const form = formInstance ? formInstance : Form.useForm()[0];
  // const [ form] =Form.useForm()
  const [editing, setEditing] = useState(false);
  const itemRef = useRef<any>(null);
  useEffect(() => {
    if (editing) {
      itemRef.current?.focus?.();
    }
  }, [editing]);

  let childNode = children;

  const isEditable = getEditable(editable, children, record);
  const key = getKey(dataIndex);

  const toggleEdit = () => {
    if (!isEditable) return;
    const data = handleParseData(props);
    form?.setFieldsValue(data);
    setEditing(!editing);
  };

  const save = async () => {
    try {
      const values = await form?.validateFields();
      await handleSave({ ...record }, { ...values });
      toggleEdit();
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  const saveDebounce = debounce(() => {
    save();
  }, 200);
  const item = getFromItemComponent({
    valueType,
    itemRef,
    save,
    fieldProps,
    saveDebounce,
    key,
  });

  if (isEditable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={key}
        {...formItemProps}
        className="editable-cell-value-form"
      >
        {item}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        <Text>{children} </Text>
      </div>
    );
  }
  //  else {
  // childNode = isExtandRow ? ( // extand row don't need auto ellipsis
  //   children
  // ) : (
  //   // auto ellipsis
  //   <div className="editable-cell-value-wrap-on-edit">
  //     <Text>{children} </Text>
  //   </div>
  // );
  // }
  if (type === "table") {
    return <td {...restProps}>{childNode}</td>;
  }
  return (
    <div className={style.editableCell} {...restProps}>
      {childNode}
    </div>
  );
};

export default ToggleEditableCell;
