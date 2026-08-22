// src/components/wsa/LineChart.tsx
import { format, parseISO } from "date-fns";
import React from "react";

interface LineChartProps {
  data: { date: string; value: number }[];
  title: string;
  valueLabel: string;
  className?: string;
  /** Line + point color. Lets each chart instance have its own theme color. */
  color?: string;
  /** Slightly darker shade used for the last (active) point. Falls back to `color` if omitted. */
  activeColor?: string;
}

export function LineChart({
  data,
  title,
  valueLabel,
  className = "",
  color = "#3b82f6",
  activeColor,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground text-sm ${className}`}>
        No data available.
      </div>
    );
  }

  const dotColor = activeColor || color;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  // Avoid a 0/0 division when every value is identical (flat line).
  const valueRange = maxVal - minVal || 1;

  // ✅ إعدادات الرسم
  const height = 140;
  const PADDING_X = 24; // horizontal padding so points/labels never touch the edges
  const PADDING_TOP = 16;
  const PADDING_BOTTOM = 20;
  const plotWidth = Math.max(data.length * 60, 260);
  const width = plotWidth + PADDING_X * 2;

  // Avoid divide-by-zero when there is only a single data point.
  const step = data.length > 1 ? (plotWidth - 1) / (data.length - 1) : 0;

  const getXY = (i: number, value: number) => {
    const x = PADDING_X + (data.length > 1 ? i * step : plotWidth / 2);
    const y =
      height -
      PADDING_BOTTOM -
      ((value - minVal) / valueRange) * (height - PADDING_BOTTOM - PADDING_TOP);
    return { x, y };
  };

  const linePoints = data.map((d, i) => {
    const { x, y } = getXY(i, d.value);
    return `${x},${y}`;
  });

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">Max: {maxVal.toLocaleString()}</span>
      </div>

      <div className="relative w-full h-[160px] bg-secondary/20 rounded-lg border border-border/50 p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* الخط */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={linePoints.join(" ")}
          />

          {/* النقاط */}
          {data.map((d, i) => {
            const { x, y } = getXY(i, d.value);
            const isLast = i === data.length - 1;
            return (
              <g key={i}>
                {/* الدائرة البيضاء (هالة) */}
                <circle
                  cx={x}
                  cy={y}
                  r={isLast ? 12 : 10}
                  fill="white"
                  opacity="0.7"
                  className="pointer-events-none"
                />
                {/* الدائرة الأساسية */}
                <circle
                  cx={x}
                  cy={y}
                  r={isLast ? 8 : 6}
                  fill={isLast ? dotColor : color}
                  className="cursor-pointer transition-all hover:r-12"
                />
                {/* Tooltip */}
                <title>
                  {d.date}: {valueLabel} {d.value.toLocaleString()}
                </title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* عناوين الأيام أسفل الشارت */}
      <div className="flex justify-between mt-2 px-2 text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.date} className="truncate max-w-[30px] text-center">
            {format(parseISO(d.date), "MMM d")}
          </span>
        ))}
      </div>
    </div>
  );
}
