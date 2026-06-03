import React from "react";
import classNames from "../../utils/classNames";

export default function Card({ children, className, ...props }) {
  return (
    <div 
      className={classNames(
        "bg-glass border border-glassBorder rounded-xl shadow-glass backdrop-blur-xl text-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
