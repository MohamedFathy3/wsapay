// src/components/wsa/LineChart.tsx
import { format, parseISO } from "date-fns";
import React from "react";

interface LineChartProps {
  data: { date: string; value: number }[];
  title: string;
  valueLabel: string;
  className?: string;
}

export function LineChart({ data, title, valueLabel, className = "" }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground text-sm ${className}`}>
        No data available.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = Math.min(...data.map((d) => d.value), 0);

  // ✅ إعدادات الرسم
  const height = 140;
  const width = data.length * 60;

  // حساب النقاط للرسم
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    // تمت إضافة 20 بكسل "Padding" عشان الخط والنقطة ما يلمسوش الحواف
    const y = height - 20 - ((d.value - minVal) / (maxVal - minVal)) * (height - 20);
    return `${x},${y}`;
  });

  const linePoints = points.join(" ");

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">Max: {maxVal.toLocaleString()}</span>
      </div>

      <div className="relative w-full h-[160px] bg-secondary/20 rounded-lg border border-border/50 p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${Math.max(width, 400)} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* الخط الأزرق */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={linePoints}
          />

          {/* النقاط */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - 20 - ((d.value - minVal) / (maxVal - minVal)) * (height - 20);
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
                {/* الدائرة الزرقاء (النقطة الأساسية) */}
                <circle
                  cx={x}
                  cy={y}
                  r={isLast ? 8 : 6}
                  fill={isLast ? "#2563eb" : "#3b82f6"}
                  className="cursor-pointer transition-all hover:r-12 hover:fill-blue-600"
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
      <div className="flex justify-between mt-2 px-1 text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.date} className="truncate max-w-[30px] text-center">
            {format(parseISO(d.date), "MMM d")}
          </span>
        ))}
      </div>
    </div>
  );
}
