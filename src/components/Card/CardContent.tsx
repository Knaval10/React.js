// CardContent.js
import React from "react";

const CardContent = ({ dimensions, position, isDragging }) => {
  return (
    <div
      style={{
        width: dimensions.width,
        padding: 16,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <h3>Emergency Assistance</h3>
      <p>Mechanic is on the way!</p>
      <p>
        Position: Top {position.top}px,{" "}
        {position.left
          ? `Left ${position.left}px`
          : `Right ${position.right}px`}
      </p>
    </div>
  );
};

export default CardContent;
