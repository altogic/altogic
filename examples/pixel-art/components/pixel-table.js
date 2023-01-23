import cs from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pixelActions } from "../redux/pixel/pixelSlice";
import { realtimeActions } from "../redux/realtime/realtimeSlice";
import Cell from "./cell";

export default function PixelTable({ drawColor, canDraw, size }) {
  const router = useRouter();
  const { pixelSlug } = router.query;
  const pixelRef = useRef(null);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.pixel.pixel);

  const [holdDown, setHoldDown] = useState(false);

  const handleFocus = (e) => {
    if (!document.getElementById("pixel-table")?.contains(e.target)) {
      // Clicked outside the box
      setHoldDown(false);
    }
  };

  useEffect(() => {
    dispatch(
      realtimeActions.joinRequest({
        pixelSlug,
      })
    );

    return () => {
      dispatch(
        realtimeActions.leaveRequest({
          pixelSlug,
        })
      );
    };
  }, [pixelSlug]);

  useEffect(() => {
    if (pixelRef?.current) {
      pixelRef.current.addEventListener("mouseup", holdUpMouse);
      pixelRef.current.addEventListener("mousedown", holdDownMouse);
      window.addEventListener("click", handleFocus, false);
    }

    return () => {
      if (pixelRef?.current) {
        window.removeEventListener("click", handleFocus, false);
        pixelRef.current.removeEventListener("mouseup", holdUpMouse);
        pixelRef.current.removeEventListener("mousedown", holdDownMouse);
      }
    };
  }, [pixelRef]);

  const holdDownMouse = () => {
    setHoldDown(true);
  };
  const holdUpMouse = () => {
    setHoldDown(false);
  };

  const draw = (x, y) => {
    if (!canDraw || !data[y] || !data[y][x] || data[y][x].color === drawColor) {
      return;
    }

    dispatch(pixelActions.drawPixel({ x, y, drawColor }));
    dispatch(
      realtimeActions.drawRequest({
        pixelSlug,
        x,
        y,
        drawColor,
      })
    );
    dispatch(
      pixelActions.savePixelRequest({
        slug: pixelSlug,
      })
    );
  };

  const onMouseDown = ({ x, y }) => {
    draw(Number(x), Number(y));
  };

  const onMouseOver = ({ x, y }) => {
    if (holdDown) {
      draw(x, y);
    }
  };

  return (
    <div
      ref={pixelRef}
      id="pixel-table"
      className={cs([
        "my-3 2xl:my-6",
        canDraw
          ? "touch-none touch-pinch-zoom cursor-cell"
          : "cursor-not-allowed",
      ])}
    >
      {_.map(data, (row, rowIndex) => (
        <div key={rowIndex} className="flex w-full">
          {_.map(row, (column, columnIndex) => (
            <div key={`${rowIndex},${columnIndex}`}>
              <Cell
                size={size}
                indexKey={`${rowIndex},${columnIndex}`}
                data={column}
                onMouseDown={onMouseDown}
                onMouseOver={onMouseOver}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
