import App from "../App";
import { Navigate, RouteObject } from "react-router-dom";
import FeaturePage from "../views/FeaturePage";
import {
  CrownFilled,
  SmileFilled,
  // ChromeFilled,
  // TabletFilled,
} from "@ant-design/icons";
import { MenuDataItem } from "@ant-design/pro-components";
import ToggleEditTablePage from "@/views/ToggleEditTablePage";
export type RouterItem = RouteObject &
  MenuDataItem & {
    // name: string;
    // icon?: React.ReactNode | null;
    children?: RouterItem[];
    routes?: RouterItem[];
  };

export const routerList = [
  {
    path: "/",
    name: "root",
    element: <App />,
    children: [
      {
        path: "/about",
        name: "管理",
        icon: <SmileFilled />,
        // element: <Navigate to="/about/sub-page1" />,
        children: [
          {
            path: "/about/sub-page1",
            name: "editable",
            icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
            element: <ToggleEditTablePage />,
          },
          {
            path: "/about/sub-page2",
            name: "二级页面",
            icon: <CrownFilled />,
            element: <>二级页面</>,
          },
        ],
      },
      {
        name: "feature页面",
        path: "/feature/:id",
        element: <FeaturePage />,
        icon: <CrownFilled />,
      },
      {
        path: "/notFound",
        element: <h1>NotFound</h1>,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/notFound" />,
  },
] as RouterItem[];
