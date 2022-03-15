import React from "react";
import { AnyComponent } from "./Inventory";
import { ComponentNode, LayoutNode, LNode } from "./LayoutNode";

export function toReactNode(node: LNode) {
  if (node instanceof ComponentNode) {
    return <AnyComponent node={node} />;
  }
  const { id, children, normalizedStyle } = node;
  return (
    <div
      id={id}
      title={id}
      draggable={false}
      style={{
        ...normalizedStyle,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        node.onMouseDown(e.nativeEvent);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        node.onMouseUp(e.nativeEvent);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        node.onDragOver(e.nativeEvent);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        node.onDrop(e.nativeEvent);
      }}
    >
      {...children.map((n) => toReactNode(n))}
    </div>
  );
}
