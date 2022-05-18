import StatsCard from "./StatsCard";
import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/taskContext";
import CustomPieChart from "../../components/ui/CustomPieChart";

import CalendarComponent from "./Calendar";
import TaskItem from "./TaskItem";

function Analytics() {
  const context = useContext(TaskContext);
  const primaryColor = "#3c7844";
  const secondaryColor = "#de8f1d";
  const other = "#b91c1c";
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    if (context.statsByPriority != null) {
      setProjectData({
        labels: ["Low", "Medium", "High"],

        datasets: [
          {
            label: "remains",
            data: context.statsByPriority,
            backgroundColor: context.statsByPriority.map((el, i) => {
              if (el !== 0) {
                return i % 3 === 0
                  ? primaryColor
                  : i % 3 === 1
                  ? secondaryColor
                  : other;
              }
            }),
          },
        ],
      });
    }
  }, [context.statsByPriority]);

  return (
    <div className="bg-slate-100 border-l p-5 lg:min-h-full md:min-h-full min-h-screen justify-center border-y-2">
      <h2 className="font-semibold mb-8">STATISTICS</h2>
      <div className="grid grid-cols-3 space-x-2 mx-4">
        <StatsCard
          type="total"
          title="Total"
          count={
            context.currentProject !== null
              ? context.selectedTodos.length
              : context.todos.length
          }
        />{" "}
        <StatsCard
          type="remaining"
          title="Remaining"
          count={
            context.currentProject !== null
              ? context.selectedTodos.filter((todo) => todo.status === false)
                  .length
              : context.todos.filter((todo) => todo.status === false).length
          }
        />
        <StatsCard
          type="done"
          title="Done"
          count={
            context.currentProject !== null
              ? context.selectedTodos.filter((todo) => todo.status === true)
                  .length
              : context.todos.filter((todo) => todo.status === true).length
          }
        />
      </div>
      <CalendarComponent></CalendarComponent>
      <div className=" justify-center items-center px-4">
        {context.calendarTodos.map((todo) => (
          <TaskItem todo={todo} key={todo._id} titleWidth="w-32"></TaskItem>
        ))}
      </div>
      {projectData != null && <CustomPieChart data={projectData} />}
    </div>
  );
}

export default Analytics;
