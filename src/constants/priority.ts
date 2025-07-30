export const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "低",
    borderClass: "border-green-600",
    bgClass: "bg-green-200",
    hoverClass: "hover:bg-green-300",
  },
  {
    value: "normal",
    label: "中",
    borderClass: "border-yellow-600",
    bgClass: "bg-yellow-200",
    hoverClass: "hover:bg-yellow-300",
  },
  {
    value: "high",
    label: "高",
    borderClass: "border-red-600",
    bgClass: "bg-red-200",
    hoverClass: "hover:bg-red-300",
  },
] as const;

export type PriorityValue = (typeof PRIORITY_OPTIONS)[number]["value"];
export type PriorityOption = (typeof PRIORITY_OPTIONS)[number];
