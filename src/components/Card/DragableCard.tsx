/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useRef, useState } from "react";

// excluding the sidebar and top rail
const positionFromLeft = { top: 75, left: 76 };
// exclusing the top rail
const positionFromRight = { top: 75, right: 16 };

const DragableCard = (
  WrappedComponent,
  initialWidth,
  initialHeight,
  withResize = false,
  fromLeft
) => {
  return function Component({ ...props }) {
    const initialPosition = fromLeft ? positionFromLeft : positionFromRight;

    const resizableRef = useRef(null);
    const dragStartPos = useRef({ x: 0, y: 0 });

    const [dimensions, setDimensions] = useState({
      width: initialWidth,
      height: initialHeight,
    });
    const [position, setPosition] = useState(initialPosition);
    const [debouncedPosition, setDebouncedPosition] = useState(initialPosition);
    const [isResizing, setIsResizing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [zIndex, setZIndex] = useState(10000);

    // const handleResize = () => {
    //   const windowDimensions = {
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //   };
    //   if (fromLeft) {
    //     if ((position?.left || 0) + 32 > windowDimensions?.width) {
    //       setPosition((prev) => ({
    //         ...prev,
    //         left: (windowDimensions?.width || 0) - initialWidth - 16,
    //       }));
    //     }
    //   } else if ((position?.right || 0) + 32 > windowDimensions?.width) {
    //     setPosition((prev) => ({
    //       ...prev,
    //       right: (windowDimensions?.width || 0) - initialWidth - 16,
    //     }));
    //   }
    //   if ((position?.top || 0) + 32 > windowDimensions?.height) {
    //     setPosition((prev) => ({
    //       ...prev,
    //       top: 16,
    //     }));
    //   }
    // };

    // useEffect(() => {
    //   window.addEventListener("resize", handleResize);

    //   return () => {
    //     window.removeEventListener("resize", handleResize);
    //   };
    // }, [position]);

    // const updateDimensions = useCallback((newDimensions) => {
    //   setDimensions((prev) => ({
    //     ...prev,
    //     ...newDimensions,
    //   }));
    // }, []);

    // const updateZIndex = useCallback((newZIndex) => {
    //   setZIndex(newZIndex);
    // }, []);

    const updatePosition = useCallback((newPosition) => {
      setPosition(newPosition);
    }, []);

    useEffect(() => {
      const maxTop = window.innerHeight - (Number(dimensions?.height) || 0);
      setPosition((prev) => ({ ...prev, top: Math.min(prev.top, maxTop) }));
    }, [dimensions?.height]);

    const handleMouseMove = useCallback(
      (e) => {
        if (isResizing) {
          const newWidth = Math.max(
            100,
            resizableRef.current.getBoundingClientRect().right - e.clientX
          );
          const newHeight = Math.max(
            100,
            e.clientY - resizableRef.current.getBoundingClientRect().top
          );

          // Constrain size within screen boundaries
          const maxWidth = window.innerWidth - position.right;
          const maxHeight = window.innerHeight - position.top;

          setDimensions({
            width: Math.min(newWidth, maxWidth),
            height: Math.min(newHeight, maxHeight),
          });
        } else if (isDragging) {
          if (fromLeft) {
            const newX = e.clientX - dragStartPos.current.x;
            const newY = e.clientY - dragStartPos.current.y;

            // Constrain movement within screen boundaries
            const maxRight = window.innerWidth - dimensions.width;
            const maxTop =
              window.innerHeight - (Number(dimensions?.height) || 0) - 50; // restrict movement over top rail

            const left = Math.max(60, Math.min(newX, maxRight));
            const top = Math.max(58, Math.min(newY, maxTop));

            setPosition({ left, top });
          } else {
            const newX = e.clientX - dragStartPos.current.x;
            const newY = e.clientY - dragStartPos.current.y;

            // Constrain movement within screen boundaries
            const maxRight = window.innerWidth - dimensions.width;
            const maxTop =
              window.innerHeight - (Number(dimensions?.height) || 0);

            const right = Math.max(
              0,
              Math.min(window.innerWidth - newX - dimensions.width, maxRight)
            );
            const top = Math.max(0, Math.min(newY, maxTop));

            setPosition({ right, top });
          }
        }
      },
      [
        isResizing,
        isDragging,
        dimensions.width,
        dimensions.height,
        position.right,
        position.top,
      ]
    );

    const handleMouseUp = useCallback(() => {
      setIsResizing(false);
      setIsDragging(false);
    }, []);

    useEffect(() => {
      if (isResizing || isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isResizing, isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
      if (!isResizing || !isDragging) {
        setDebouncedPosition(position);
      }
    }, [position]);

    // const startResize = (e) => {
    //   e.stopPropagation();
    //   setIsResizing(true);
    // };

    const startDrag = (e) => {
      if (resizableRef.current.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        const rect = resizableRef.current.getBoundingClientRect();
        dragStartPos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    return (
      <div
        ref={resizableRef}
        style={{
          position: "fixed",
          width: `${dimensions.width}px`,
          height: "fit-content",
          right: `${position.right}px`,
          left: `${position.left}px`,
          top: `${position.top}px`,
          overflow: "hidden",
          zIndex,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="expandable-container"
        onMouseDown={startDrag}
        id="movable-popup"
      >
        <WrappedComponent
          {...props}
          isDragging={isDragging}
          dimensions={dimensions}
          position={debouncedPosition}
          updatePosition={updatePosition}
          //   updateDimensions={updateDimensions}
          //   updateZIndex={updateZIndex}
        />
        {/* {withResize ? (
          <div
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              backgroundColor: "transparent",
              right: 0,
              bottom: 0,
              cursor: "nwse-resize",
            }}
            onMouseDown={startResize}
          />
        ) : null} */}
      </div>
    );
  };
};

export default DragableCard;
