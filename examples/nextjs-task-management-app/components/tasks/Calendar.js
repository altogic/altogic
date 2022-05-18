import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { TaskContext } from "../../context/taskContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { pad } from "../../helpers/functions";

export const CalendarComponent = () => {
  const context = useContext(TaskContext);

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [no_of_days, setNumDays] = useState([]);
  const [blankdays, setBlankDays] = useState([]);
  const [firstDate, setFirstDate] = useState(null);

  function checkIfTaskExists(day) {
    let todoArray;
    if (context.currentProject) {
      todoArray = context.selectedTodos;
    } else {
      todoArray = context.todos;
    }
    return todoArray.some((todo) => {
      const todoYear = todo.dueDate.slice(0, 4);
      const todoMonth = todo.dueDate.slice(5, 7);
      const todoDay = todo.dueDate.slice(8, 10);

      return (
        year.toString() === todoYear &&
        pad(month + 1) === todoMonth &&
        pad(day) === todoDay &&
        !todo.status
      );
    });
  }

  useEffect(() => {
    getNoOfDays();
  }, [month]);

  // Checks if the day is the current day
  const isToday = (date) => {
    const today = new Date();
    const d = new Date(year, month, date);

    return today.toDateString() === d.toDateString() ? true : false;
  };

  // Gets an actual date value from the calendar number passed in
  const getDateValue = (date) => {
    let selectedDate = new Date(year, month, date);
    setFirstDate(() => selectedDate);
    // setDatepickerValue(() => selectedDate.toDateString());
  };

  // Calculates the number of days in the given month
  const getNoOfDays = () => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayOfWeek = new Date(year, month).getDay();

    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankDays(() => blankdaysArray);
    setNumDays(() => daysArray);
  };

  // Checking to see if the date has been selected or not
  const dateFromDay = (date) => {
    let newDate = new Date(year, month, date);

    if (firstDate !== null) {
      return newDate.toDateString() == firstDate.toDateString();
    }

    return false;
  };

  useEffect(() => {
    // This function can be used to do computations when the date is changed
    if (firstDate !== null) {
      // setDatepickerValue(() => {
      //   return firstDate.toDateString();
      // });
    }
  }, [firstDate]);

  useEffect(() => {
    // initDate();
    getNoOfDays();
  }, []);

  return (
    <div className=" antialiased sans-serif">
      <div className="container flex justify-center mx-auto px-4 py-2">
        <div className="w-72">
          <div className="relative">
            <input type="hidden" name="date" />
            <div>
              <div className="bg-white mt-4 rounded shadow p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-800 font-skylight">
                      {" "}
                      {MONTH_NAMES[month]}
                    </span>
                    <span className="ml-1 text-lg text-gray-600 font-normal font-skylight">
                      {" "}
                      {year}
                    </span>
                  </div>{" "}
                  <div>
                    <button
                      type="button"
                      className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                      onClick={() => {
                        if (month === 0) {
                          setYear(year - 1);
                          setMonth(11);
                        } else {
                          setMonth((prev) => prev - 1);
                        }
                      }}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-700 p-1 rounded-full"
                      onClick={() => {
                        if (month === 11) {
                          setYear(year + 1);
                          setMonth(0);
                        } else {
                          setMonth((prev) => prev + 1);
                        }
                      }}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>{" "}
                <div className="flex flex-wrap mb-3 -mx-1">
                  {DAYS.map((day, index) => {
                    return (
                      <div className="px-1" key={index}>
                        <div
                          key={index}
                          className="text-gray-800 font-medium text-center text-xs w-7 font-skylight"
                        >
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap -mx-1">
                  {blankdays.map((day, index) => {
                    return (
                      <div className="px-1 mb-1" key={index}>
                        <div
                          key={index}
                          className="cursor-pointer text-center text-sm rounded-lg leading-loose font-skylight w-7 text-gray-700"
                        >
                          {}
                        </div>
                      </div>
                    );
                  })}
                  {no_of_days.map((day, index) => {
                    return (
                      <div className="px-1 mb-1" key={index}>
                        <div
                          key={index}
                          onClick={() => {
                            getDateValue(day);
                            context.handleCalendarSelectedTasks(
                              day,
                              month + 1,
                              year
                            );
                          }}
                          className="cursor-pointer text-center text-sm rounded-lg leading-loose w-7  hover:bg-blue-400 font-skylight"
                          style={{
                            backgroundColor: dateFromDay(day)
                              ? "#add8e6"
                              : "white",
                            color: "black",
                          }}
                        >
                          {" "}
                          {day}
                          {checkIfTaskExists(day) && (
                            <FontAwesomeIcon
                              className=" items-start"
                              icon={faCircle}
                              size={"2xs"}
                              color="#3F51B5"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
