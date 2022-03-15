import React, { DragEvent, FC, useEffect, useState } from "react";
import { LayoutInstance } from "./LayoutNode";

const BORDER_WIDTH = 15;
const BORDER_COLOR = "red";

type Props = {
  instance: LayoutInstance;
};

export const Cursor: FC<Props> = ({ instance }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    instance.subscribe(() => {
      setRect(
        instance.target
          ? document.getElementById(instance.target.id).getBoundingClientRect()
          : null
      );
    });
  }, []);

  const target = instance.target;

  if (!rect || !target) return null;

  return (
    <>
      <div
        id="top"
        style={{
          position: "fixed",
          left: Number(rect.left) - BORDER_WIDTH,
          top: Number(rect.top) - BORDER_WIDTH,
          width: 2 * BORDER_WIDTH + Number(rect.width),
          height: BORDER_WIDTH,
          background: BORDER_COLOR,
          // transition: "all 0.1s",
        }}
        draggable
        onDragStart={(e) => {
          disableDragImage(e);
        }}
        onDrag={(e) => {
          // if (!e.clientY) return;
          // if (!rect) return;
          // target.style.height = rect.bottom - e.clientY;
          // target.style.flexGrow = 0;
          // target.style.flexShrink = 0;
        }}
      />
      <div
        id="bottom"
        style={{
          position: "fixed",
          left: Number(rect.left) - BORDER_WIDTH,
          top: Number(rect.bottom),
          width: 2 * BORDER_WIDTH + Number(rect.width),
          height: BORDER_WIDTH,
          background: BORDER_COLOR,
          // transition: "all 0.1s",
        }}
        draggable
        onDragStart={(e) => {
          disableDragImage(e);
        }}
        onDrag={(e) => {
          if (!e.clientY) return;
          if (!rect) return;
          target.style.height = e.clientY - rect.top;
          target.style.flexGrow = 0;
          target.style.flexShrink = 0;
        }}
      />
      <div
        id="left"
        style={{
          position: "fixed",
          left: Number(rect.left) - BORDER_WIDTH,
          top: Number(rect.top) - BORDER_WIDTH,
          width: BORDER_WIDTH,
          height: 2 * BORDER_WIDTH + Number(rect.height),
          background: BORDER_COLOR,
          // transition: "all 0.1s",
        }}
        draggable
        onDragStart={(e) => {
          disableDragImage(e);
        }}
        onDrag={(e) => {
          // if (!e.clientX) return;
          // if (!rect) return;
          // target.style.width = rect.right - e.clientX;
          // target.style.flexGrow = 0;
          // target.style.flexShrink = 0;
        }}
      />
      <div
        id="right"
        style={{
          position: "fixed",
          left: Number(rect.right),
          top: Number(rect.top) - BORDER_WIDTH,
          width: BORDER_WIDTH,
          height: 2 * BORDER_WIDTH + Number(rect.height),
          background: BORDER_COLOR,
          // transition: "all 0.1s",
        }}
        draggable
        onDragStart={(e) => {
          disableDragImage(e);
        }}
        onDrag={(e) => {
          if (!e.clientX) return;
          if (!rect) return;
          target.style.width = e.clientX - rect.left;
          target.style.flexGrow = 0;
          target.style.flexShrink = 0;
        }}
      />
    </>
  );
};

function disableDragImage(e: DragEvent) {
  const dragImage = document.createElement("img");
  dragImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  e.dataTransfer.setDragImage(dragImage, 0, 0);
}
