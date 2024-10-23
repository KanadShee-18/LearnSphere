import React, { useState } from "react";

import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  console.log("Courses comes in instrutor chart as: ", courses);

  const [currentChart, setCurrentChart] = useState("Students");

  const getRandomColors = (colorsNumber) => {
    const colors = [];
    for (let i = 0; i < colorsNumber; i++) {
      // Generate random RGB components
      const expr = () => Math.floor(Math.random() * 256);

      const r = expr();
      const g = expr();
      const b = expr();

      // Create RGB color string
      const color = `rgb(${r}, ${g}, ${b})`;

      // Push the color to the colors array
      colors.push(color);
    }
    return colors;
  };

  //   Student Chart
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };
  //   Income Chart
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  //   Options:
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#bfd7ff",
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="flex md:w-auto w-full flex-1 h-[450px] flex-col justify-between gap-y-2 rounded-lg bg-[#222d4b] p-3">
      <p className="text-xl font-semibold text-[#b8bdf5]">Visualize</p>
      <div className="flex flex-row font-semibold rounded-md shadow-md shadow-slate-900 bg-opacity-20 bg-slate-400 w-fit">
        <button
          className={`rounded-sm p-2 px-3 transition-all duration-200 ${
            currentChart === "Students"
              ? "bg-teal-500 text-slate-800"
              : "text-teal-600"
          }`}
          onClick={() => setCurrentChart("Students")}
        >
          Student
        </button>
        <button
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currentChart === "Income"
              ? "bg-teal-500 text-slate-800"
              : "text-teal-600"
          }`}
          onClick={() => setCurrentChart("Income")}
        >
          Income
        </button>
      </div>

      <div className="min-h-[300px] flex-1 !text-slate-400">
        <Pie
          className="p-2 shadow-md shadow-slate-900"
          data={
            currentChart === "Student"
              ? chartDataForStudents
              : chartDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;
