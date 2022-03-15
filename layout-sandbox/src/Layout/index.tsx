import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import { Cursor } from "./Cursor";
import { LayoutInstance, LayoutNode, makeReactive } from "./LayoutNode";
import { toReactNode } from "./ReactAdaptor";

type Props = {
  instance: LayoutInstance;
};

export const Layout: FC<Props> = ({ instance }) => {
  const [, forceUpdate] = useReducer((s) => s + 1, 0);
  useEffect(() => {
    instance.subscribe(forceUpdate);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {toReactNode(instance.root)}
      <Cursor instance={instance} />
    </div>
  );
};
