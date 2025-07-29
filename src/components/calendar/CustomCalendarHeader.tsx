import React from "react";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";

interface CustomCalendarHeaderProps {
  currentDate: Date;
  onPrevClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
  onViewChange: (view: "dayGridMonth" | "dayGridweek" | "dayGridDay") => void;
  currentView: string;
  //   onAddTodo?: () => void;
}

const CustomCalendarHeader = ({
  currentDate,
  onPrevClick,
  onNextClick,
  onTodayClick,
  onViewChange,
  currentView,
}: //   onAddTodo,
CustomCalendarHeaderProps) => {
  const formatTitle = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年 ${month}月`;
  };

  const formatWeekTitle = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年 ${month}月 ${day}日`;
  };

  const formatDayTitle = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    return `${year}年 ${month}月 ${day}日 (${weekday})`;
  };

  const getTitle = () => {
    switch (currentView) {
      case "dayGridWeek":
        return formatWeekTitle(currentDate);
      case "dayGridDay":
        return formatDayTitle(currentDate);
      default:
        return formatTitle(currentDate);
    }
  };

  const VIEW_BUTTONS = [
    {
      key: "dayGridMonth",
      label: "月",
      icon: Calendar,
    },
    {
      key: "dayGridWeek",
      label: "週",
      icon: List,
    },
    {
      key: "dayGridDay",
      label: "日",
      icon: Grid,
    },
  ];

  return (
    <div className="flex flex-col gap-2 py-4 bg-white border-b border-gray-200 rounded-t-md">
      <div>
        <h2 className="text-center font-bold text-2xl">{getTitle()}</h2>
      </div>

      {/* 下段、ナビゲーションとビューの切り替え */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={"outline"} size={"sm"} onClick={onPrevClick}>
            <ChevronLeft />
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={onTodayClick}>
            今日
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={onNextClick}>
            <ChevronRight />
          </Button>
        </div>

        {/* ビュー切り替えボタン */}
        <div>
          {VIEW_BUTTONS.map((button) => {
            const Icon = button.icon;
            const isActive = currentView === button.key;

            return (
              <Button
                key={button.key}
                variant={isActive ? "default" : "ghost"}
                size={"sm"}
                onClick={() => onViewChange(button.key as any)}
                className={`h-8 px-3 rounded-md transition-all ${
                  isActive
                    ? "bg-white text-black shadow-sm hover:text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                <Icon />
                {button.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomCalendarHeader;
