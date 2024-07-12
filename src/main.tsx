import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./store/index.ts";
import router from "./router/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 将RouterProvider包裹在Provider内 */}
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
);
