import React, { FC, useEffect, useState } from "react";
import * as antd from "antd";
import get from "lodash/get";
import { ComponentNode, LayoutInstance } from "./LayoutNode";
import { PropEditor } from "./PropEditor";
import { ErrorBoundary } from "./ErrorBoundary";

const componentRegistry = {
  ...antd,
};

type InventoryProps = {
  instance: LayoutInstance;
  items: string[];
};

export const Inventory: FC<InventoryProps> = ({ instance, items }) => {
  return (
    <div
      style={{
        flex: "none",
        width: 200,
      }}
    >
      {...items.map((path) => (
        <div
          style={{ background: "red", padding: 20 }}
          draggable
          onDragStart={() => {
            instance.selectedComponent = path;
          }}
          onDragEnd={() => {
            instance.selectedComponent = "";
          }}
        >
          <AnyComponent node={new ComponentNode(path, null, null)} />
        </div>
      ))}
    </div>
  );
};

type ComponentProps = {
  node: ComponentNode;
};

export const AnyComponent: FC<ComponentProps> = ({ node }) => {
  const Component = get(componentRegistry, node.path);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (node.instance) node.instance.hasFocus = !showEditor;
  }, [showEditor]);

  useEffect(() => {
    const f = () => setShowEditor(false);
    window.addEventListener("click", f);
    return () => {
      window.removeEventListener("click", f);
    };
  }, []);

  return (
    <div
      style={{ padding: 10, background: "gray" }}
      onClick={(e) => {
        e.stopPropagation();
        setShowEditor(true);
      }}
    >
      {showEditor && (
        <PropEditor
          props={node.props}
          setProp={(key, value) => {
            node.props[key] = value;
          }}
        />
      )}
      <ErrorBoundary>
        <div onClick={(e) => e.stopPropagation()}>
          <Component {...node.props} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
