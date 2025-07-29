"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateInput, EventInput } from "@fullcalendar/core/index.js";
import { useTodos } from "@/hooks/useTodos";
import CustomCalendarHeader from "@/components/calendar/CustomCalendarHeader";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CalendarPage = () => {
  const { todos, isLoading } = useTodos({
    autoFetch: true,
  });

  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<
    "dayGridMonth" | "dayGridweek" | "dayGridDay"
  >("dayGridMonth");

  const handleDatesSet = () => {
    // カレンダーAPIから直接現在の日付を取得
    const calendarApi = calendarRef.current?.getApi();
    const currentDate = calendarApi?.getDate();

    if (currentDate) {
      setCurrentDate(new Date(currentDate));
    }
  };

  const events: EventInput[] = todos
    .filter((todo) => todo.hasDeadline && todo.startDate && todo.dueDate)
    .map((todo) => {
      // 優先度による色分け
      const getPriorityColor = () => {
        if (todo.completed) return { bg: "#10b981", border: "#059669" };

        switch (todo.isPriority) {
          case "high":
            return { bg: "#ef4444", border: "#dc2626" };
          case "normal":
            return { bg: "#f59e0b", border: "#d97706" };
          case "low":
            return { bg: "#6b7280", border: "#4b5563" };
          default:
            return { bg: "#6b7280", border: "#4b5563" };
        }
      };

      const colors = getPriorityColor();

      return {
        id: todo.id,
        title: todo.title,
        start: todo.startDate as DateInput,
        end: todo.dueDate as DateInput,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        classNames: [
          todo.completed ? "completed-todo" : "pending-todo",
          `priority-${todo.isPriority}`,
        ],
        extendedProps: {
          completed: todo.completed,
          priority: todo.isPriority,
          // category: todo.category,
          hasDeadline: todo.hasDeadline,
        },
      };
    });

  const updateCurrentDate = () => {
    setTimeout(() => {
      const calenderApi = calendarRef.current?.getApi();
      const date = calenderApi?.getDate();
      if (date) {
        setCurrentDate(new Date(date));
      }
    }, 0);
  };
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    updateCurrentDate();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    updateCurrentDate();
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
    setCurrentDate(new Date());
  };

  const handleViewChange = (
    view: "dayGridMonth" | "dayGridweek" | "dayGridDay"
  ) => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(view);
    setCurrentView(view);
    updateCurrentDate();
  };

  const handleEventClick = (info: any) => {
    console.log(info.event.id);
  };

  const handleDateClick = (info: any) => {
    console.log(info.dateStr);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <CustomCalendarHeader
        currentDate={currentDate}
        onPrevClick={handlePrev}
        onNextClick={handleNext}
        onTodayClick={handleToday}
        onViewChange={handleViewChange}
        currentView={currentView}
      />
      <ScrollArea className="flex-1 min-h-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventClick={handleEventClick}
          selectable={true}
          select={handleDateClick}
          datesSet={handleDatesSet}
          headerToolbar={false}
          height="auto"
          locale="ja"
        />
      </ScrollArea>
    </div>
  );
};

export default CalendarPage;
