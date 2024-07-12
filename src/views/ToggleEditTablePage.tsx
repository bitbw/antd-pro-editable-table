import ToggleEditTable, {
  getNewTableDataByToggleEditTable,
} from "@/components/ToggleEditTable";
import { useMemo, useState } from "react";
import { isEqual } from "lodash";
import dayjs from "dayjs";
import { ProColumns } from "@ant-design/pro-components";
import UserRow from "@/components/UserRow";

const userList = [
  {
    name: "bowen",
    avatar:
      "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    id: "bowen",
  },
  {
    name: "xiaoming",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
    id: "xiaoming",
  },
  {
    name: "xiaohong",
    avatar:
      "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    id: "xiaohong",
  },
];

const getColumns = (setTableData: any) =>
  [
    {
      title: "user",
      dataIndex: ["user", "id"],
      editable: true,
      width: 120,
      valueType: "userSelect",
      render: (_: any, record: any) => {
        const data = userList?.find?.((item) => item.id === record["user"].id);
        console.log("[BOWEN_LOG] 🚀 ~~  render userList data:", data);
        return <UserRow style={{ height: 22 }} data={data || {}} />;
      },
      fieldProps: {
        options: userList || [],
        valuekey: "id",
        isMultiple: false,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },

    {
      title: "age",
      dataIndex: "age",
      valueType: "select",
      editable: true,
      fieldProps: {
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
        ],
      },
    },
    {
      title: "birthday",
      dataIndex: "birthday",
      valueType: "date",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      editable: false,
      render: (_, record) => [
        <a
          key={1}
          onClick={() => {
            setTableData((tableData: any) => {
              return tableData.filter((item: any) => item.id !== record.id);
            });
          }}
        >
          delete
        </a>,
      ],
    },
  ] as ProColumns<any>[];

export default function ToggleEditTablePage() {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      user: userList[0],
      age: 18,
      address: "beijing",
      birthday: "1992-10-11",
    },
    {
      id: 2,
      user: userList[1],
      age: 18,
      address: "shanghai",
      birthday: "1991-10-22",
    },
  ]);

  const columns = useMemo(() => getColumns(setTableData), [setTableData]);

  const handleSave = async (oldData: any, newData: any) => {
    console.log("[BOWEN_LOG] 🚀 ~~ handleSave ~~ newData:", newData);
    console.log("[BOWEN_LOG] 🚀 ~~ handleSave ~~ oldData:", oldData);
    const updatedFields: any = {};
    const updatedTableFields: any = {};
    // 遍历修改后的记录
    for (const key in newData) {
      let newValue = newData[key];
      newValue = dayjs.isDayjs(newValue)
        ? newValue.format("YYYY-MM-DD")
        : newValue;
      const oldValue = key.split(".").reduce((obj, key) => obj[key], oldData);
      const updatekey = key.split(".")[0];

      if (!isEqual(oldValue, newValue)) {
        updatedFields[updatekey] = newValue;
        updatedTableFields[key] = newValue;
      }
    }
    console.log(
      "[BOWEN_LOG] 🚀 ~~ handleSave ~~ updatedFields:",
      updatedFields
    );
    console.log(
      "[BOWEN_LOG] 🚀 ~~ handleSave ~~ updatedTableFields:",
      updatedTableFields
    );
    if (Object.keys(updatedFields).length === 0) {
      console.log("[BOWEN_LOG] 🚀 handleEditSave ~~~ 没有字段被修改");
      return;
    }
    // TODO: request then setTableData
    setTableData((tableData) => {
      const newTableData = getNewTableDataByToggleEditTable({
        tableData,
        newData: { id: oldData.id, ...updatedTableFields },
      });
      console.log(
        "[BOWEN_LOG] 🚀 ~~ setTableData ~~ newTableData:",
        newTableData
      );
      return newTableData;
    });
  };
  return (
    <div>
      <ToggleEditTable
        rowKey={"id"}
        handleSave={handleSave}
        dataSource={tableData}
        columns={columns as any}
      />
    </div>
  );
}
