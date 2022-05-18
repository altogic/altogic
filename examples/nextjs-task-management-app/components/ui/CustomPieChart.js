import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import { Doughnut } from "react-chartjs-2";

function CustomPieChart(props) {
  return (
    <Doughnut
      data={props.data}
      style={{
        alignItems: "center",
        justifyContent: "center",
        placeItems: "center",
        paddingLeft: "10px",
      }}
      options={{
        cutout: "80%",
        layout: { padding: 24 },

        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      }}
    />
  );
}

export default CustomPieChart;
