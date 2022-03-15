import React, { FC } from "react";
import { Layout } from "./Layout";
import { Inventory } from "./Layout/Inventory";
import { LayoutInstance } from "./Layout/LayoutNode";
import "antd/dist/antd.css";
import "antd/lib/date-picker";

// window.require = require("antd/lib/date-picker");

import "antd/es/date-picker/index.js";

const instance = new LayoutInstance("layout-demo");
window["debug"] = instance;

export const App: FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 20,
        background: "lightgray",
        display: "flex",
        flexDirection: "row",
        justifyContent: "stretch",
        alignItems: "stretch",
      }}
    >
      <Layout instance={instance} />
      <Inventory instance={instance} items={["DatePicker", "Input"]} />
    </div>
  );
};
