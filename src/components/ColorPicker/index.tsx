import React, { useEffect, useRef, useState } from "react";

type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const presetColors: string[] = [
  "#F44336",
  "#FFEB3B",
  "#FF9800",
  "#4CAF50",
  "#8BC34A",
  "#9C27B0",
  "#2196F3",
  "#64FFDA",
  "#000000",
  "#FFFFFF",
  "#9E9E9E",
  "#795548",
];

// Convert HEX to HSL
const hexToHSL = (hex: string) => {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  let h = 0;
  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    case b:
      h = ((r - g) / d + 4) * 60;
      break;
  }

  return {
    h: Math.round(h),
    s: +(s * 100).toFixed(1),
    l: +(l * 100).toFixed(1),
  };
};

// Convert HSL to RGB
const hslToRgb = (h: number, s = 100, l = 50): RGBA => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );
  return { r: f(0), g: f(8), b: f(4), a: 100 };
};

const rgbToHex = ({ r, g, b }: RGBA): string =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

const ColorPicker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hue, setHue] = useState<number>(0);
  const [rgba, setRgba] = useState<RGBA>({ r: 255, g: 0, b: 0, a: 100 });
  const [hex, setHex] = useState<string>("#FF0000");
  const [selectorPos, setSelectorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const drawGradient = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fill with base hue
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    // Overlay white to transparent (left to right)
    const whiteGrad = ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, "#fff");
    whiteGrad.addColorStop(1, "transparent");
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, width, height);

    // Overlay black to transparent (top to bottom)
    const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, "transparent");
    blackGrad.addColorStop(1, "#000");
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, width, height);
  };

  const handleGradientClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const newColor = { r: pixel[0], g: pixel[1], b: pixel[2], a: rgba.a };
    setRgba(newColor);
    setHex(rgbToHex(newColor));
    setSelectorPos({ x, y });
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHex(value);

    const match = value.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (match) {
      const newRgba: RGBA = {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
        a: rgba.a,
      };
      setRgba(newRgba);
    }
  };

  const handleRGBAChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof RGBA
  ) => {
    const val = e.target.value;
    if (!/^\d{0,3}$/.test(val)) return;
    const num = Number(val);
    const clamped = Math.min(255, Math.max(0, num));
    const newRgba = { ...rgba, [key]: clamped };
    setRgba(newRgba);
    setHex(rgbToHex(newRgba));
  };

  // Update gradient when hue changes
  useEffect(() => {
    drawGradient();
    const newRGB = hslToRgb(hue);
    setRgba((prev) => ({ ...newRGB, a: prev.a }));
    setHex(rgbToHex(newRGB));
  }, [hue]);
  const hexToRgba = (hex, alpha) => {
    let r = 0,
      g = 0,
      b = 0;

    // 3 digits (e.g. #0f0)
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits (e.g. #00ff00)
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-xl w-[320px]">
      {/* Canvas Area */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={280}
          height={180}
          onClick={handleGradientClick}
          className="border cursor-pointer rounded"
        />
        <div
          className="absolute border border-white rounded-full w-4 h-4 pointer-events-none"
          style={{
            left: selectorPos.x - 8,
            top: selectorPos.y - 8,
            backgroundColor: "transparent",
          }}
        />
      </div>

      {/* Hue Slider and Preview */}
      <section className="flex gap-2 w-full">
        <div className="flex flex-col gap-2 w-3/4">
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-full h-3 appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                hsl(0, 100%, 50%),
                hsl(60, 100%, 50%),
                hsl(120, 100%, 50%),
                hsl(180, 100%, 50%),
                hsl(240, 100%, 50%),
                hsl(300, 100%, 50%),
                hsl(360, 100%, 50%))`,
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={rgba.a}
            onChange={(e) => handleRGBAChange(e, "a")}
            className="w-full"
          />
        </div>
        <div
          className="flex-1 w-1/4"
          style={{
            backgroundColor: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`,
          }}
        />
      </section>

      {/* RGBA + HEX Inputs */}
      <div className="flex gap-2 items-center">
        {["hex", "r", "g", "b", "a"].map((field, index) => (
          <input
            key={field}
            type="text"
            value={field === "hex" ? hex : rgba[field as keyof RGBA]}
            onChange={(e) => {
              if (field === "hex") return handleHexChange(e);
              handleRGBAChange(e, field as keyof RGBA);
            }}
            className="border p-1 text-center"
            style={{ width: index === 0 ? "30%" : "17.5%" }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
        <span className="w-[100px] text-center">Hex</span>
        <span className="w-[45px] text-center">R</span>
        <span className="w-[45px] text-center">G</span>
        <span className="w-[45px] text-center">B</span>
        <span className="w-[45px] text-center">A</span>
      </div>

      {/* Preset Colors */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {presetColors.map((color, i) => (
          <div
            key={i}
            onClick={() => {
              const rgb = {
                r: parseInt(color.slice(1, 3), 16),
                g: parseInt(color.slice(3, 5), 16),
                b: parseInt(color.slice(5, 7), 16),
                a: 100,
              };
              const hsl = hexToHSL(color);
              setHex(color);
              setRgba(rgb);
              setHue(hsl.h);
            }}
            className="w-6 h-6 rounded cursor-pointer border"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
