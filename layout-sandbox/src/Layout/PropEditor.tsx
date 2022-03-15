import React, { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
type Props = {
  props: any;
  setProp: (key: string, value: string) => void;
};

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export const PropEditor: FC<Props> = ({ props, setProp }) => {
  const entries = Object.entries(props);
  const [name, setName] = useState("");

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 500,
        height: 500,
        background: "#ffffff",
        margin: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {entries.map(([key, value]) => (
        <div
          key={key}
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>{key}</div>
          <input
            defaultValue={JSON.stringify(value)}
            onBlur={(e) => {
              setProp(key, safeParse(e.target.value));
            }}
          />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input
          onBlur={(e) => {
            setName("");
            setProp(name, safeParse(e.target.value));
          }}
        />
      </div>
    </div>,
    document.body
  );
};
