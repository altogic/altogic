import cs from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ColorPicker from "./color-picker";

const DEFAULT_COLORS = [
  "#001219",
  "#fff",
  "#005f73",
  "#0a9396",
  "#94d2bd",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
  "#ae2012",
  "#9b2226",
];

export default function ColorPalette({
  selectedColor,
  setSelectedColor,
  canDraw,
}) {
  const router = useRouter();
  const { pixelSlug } = router.query;
  const [colors, setColors] = useState(_.cloneDeep(DEFAULT_COLORS));

  const handleNewColor = (hex) => {
    setSelectedColor(hex);

    if (!_.includes(colors, hex)) {
      setColors([...colors, hex]);
      localStorage.setItem(pixelSlug, JSON.stringify([...colors, hex]));
    }
  };

  useEffect(() => {
    const colorList = JSON.parse(localStorage.getItem(pixelSlug));

    if (colorList) setColors(colorList);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {_.map(colors, (color, index) => (
        <button
          disabled={!canDraw}
          key={`${color}-${index}`}
          className={cs([
            "w-8 h-8 md:w-12 md:h-12",
            color === selectedColor &&
              canDraw &&
              "outline outline-4 outline-violet-500",
            !canDraw && "cursor-not-allowed",
          ])}
          style={{ backgroundColor: color }}
          onClick={() => {
            setSelectedColor(color);
          }}
        />
      ))}
      <ColorPicker
        canDraw={canDraw}
        color={selectedColor}
        onChange={handleNewColor}
        colorPaletteSize={_.size(colors)}
      />
    </div>
  );
}
