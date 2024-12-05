// import React from "react";
// import "./OverviewContent.css";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Pie } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const projectData = [
//   {
//     name: "User Authentication",
//     dueDate: "2024-06-01",
//     status: "In Progress",
//     priority: "High",
//   },
//   {
//     name: "Checkout feature",
//     dueDate: "2024-06-15",
//     status: "Completed",
//     priority: "Medium",
//   },
//   {
//     name: "Integration of AI",
//     dueDate: "2024-10-15",
//     status: "In Progress",
//     priority: "High",
//   },
//   {
//     name: "Campaign webpage",
//     dueDate: "2024-07-01",
//     status: "Not Started",
//     priority: "Low",
//   },
//   {
//     name: "Data Analysis Tab",
//     dueDate: "2024-07-20",
//     status: "In Progress",
//     priority: "High",
//   },
//   {
//     name: "Product design review",
//     dueDate: "2024-08-01",
//     status: "Completed",
//     priority: "Medium",
//   },
//   {
//     name: "Event planning page",
//     dueDate: "2024-10-01",
//     status: "Not Started",
//     priority: "Low",
//   },
// ];

// const statusData = {
//   labels: ["Completed", "In Progress", "Not Started"],
//   datasets: [
//     {
//       data: [
//         projectData.filter((project) => project.status === "Completed").length,
//         projectData.filter((project) => project.status === "In Progress")
//           .length,
//         projectData.filter((project) => project.status === "Not Started")
//           .length,
//       ],
//       backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
//       hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
//       borderWidth: 1,
//     },
//   ],
// };

// const OverviewContent = () => {
//   return (
//     <div className="overview-content">
//       <div className="recent-projects">
//         <h2>Recent Projects</h2>
//         <ul>
//           {projectData.map((project, index) => (
//             <li key={index}>
//               <strong>{project.name}</strong>
//               <div className="project-info">
//                 <div className="project-detail">
//                   <span>Due Date: {project.dueDate}</span>
//                   <span>Status: {project.status}</span>
//                 </div>
//                 <span>
//                   Priority:{" "}
//                   <span
//                     className={
//                       project.priority === "High"
//                         ? "priority-high"
//                         : project.priority === "Medium"
//                         ? "priority-medium"
//                         : "priority-low"
//                     }
//                   >
//                     {project.priority}
//                   </span>
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="your-work">
//         <h2>Your Work</h2>
//         <div className="progress-overview">
//           <h3>Task Completion</h3>
//           <progress
//             value={
//               projectData.filter((task) => task.status === "Completed").length
//             }
//             max={projectData.length}
//           />
//           <span>
//             {projectData.filter((task) => task.status === "Completed").length}/
//             {projectData.length} tasks completed
//           </span>
//         </div>
//         <div className="upcoming-deadlines">
//           <h3>Upcoming Deadlines</h3>
//           <ul>
//             {projectData
//               .filter((task) => new Date(task.dueDate) > new Date())
//               .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
//               .slice(0, 3)
//               .map((task, index) => (
//                 <li key={index}>
//                   <strong>{task.name}</strong> - Due: {task.dueDate}
//                 </li>
//               ))}
//           </ul>
//         </div>
//         <div className="notifications">
//           <h3>Notifications</h3>
//           <ul>
//             <li>Reminder: Complete the User Authentication by 2024-06-01</li>
//             <li>New Task: Start working on Campaign webpage</li>
//             <li>Update: Integration of AI is in progress</li>
//           </ul>
//         </div>
//       </div>
//       <div className="plot">
//         <div className="analysis-plot">
//           <h2>Tasks Overview</h2>
//           <div style={{ height: "300px", width: "300px" }}>
//             <Pie
//               data={statusData}
//               options={{
//                 plugins: {
//                   tooltip: {
//                     callbacks: {
//                       label: function (tooltipItem) {
//                         const status = tooltipItem.label;
//                         const projects = projectData
//                           .filter((project) => project.status === status)
//                           .map((project) => project.name)
//                           .join(", ");
//                         return `${projects}`;
//                       },
//                     },
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OverviewContent;


import React, { useEffect, useState } from "react";
import "./OverviewContent.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const OverviewContent = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the task data from your API
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tasks"); // Adjust the API endpoint
        const tasksFromDb = response.data.map(item => JSON.parse(item.description).tasks);
        const allTasks = tasksFromDb.flat(2);
        console.log(allTasks);
        setTaskData(allTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks data:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the status distribution for the Pie chart
  const statusData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          taskData.filter((task) => task.Status === "Completed").length,
          taskData.filter((task) => task.Status === "In Progress").length,
          taskData.filter((task) => task.Status === "Not Started").length,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="overview-content">
      <div className="recent-projects">
        <h2>Recent Projects</h2>
        <ul>
          {taskData.map((task, index) => (
            <li key={index}>
              <strong>{task.Ticket_Name}</strong>
              <div className="project-info">
                <div className="project-detail">
                  <span>Due Date: {task.Due_Date}</span>
                  <span>Status: {task.Status}</span>
                </div>
                <span>
                  Priority:{" "}
                  <span
                    className={
                      task.Priority === "High"
                        ? "priority-high"
                        : task.Priority === "Medium"
                        ? "priority-medium"
                        : "priority-low"
                    }
                  >
                    {task.Priority}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="your-work">
        <h2>Your Work</h2>
        <div className="progress-overview">
          <h3>Task Completion</h3>
          <progress
            value={taskData.filter((task) => task.Status === "Completed").length}
            max={taskData.length}
          />
          <span>
            {taskData.filter((task) => task.Status === "Completed").length} /
            {taskData.length} tasks completed
          </span>
        </div>

        <div className="upcoming-deadlines">
          <h3>Upcoming Deadlines</h3>
          <ul>
            {taskData
              .filter((task) => new Date(task.Due_Date) > new Date())
              .sort((a, b) => new Date(a.Due_Date) - new Date(b.Due_Date))
              .slice(0, 3)
              .map((task, index) => (
                <li key={index}>
                  <strong>{task.Ticket_Name}</strong> - Due: {task.Due_Date}
                </li>
              ))}
          </ul>
        </div>

        <div className="notifications">
          <h3>Notifications</h3>
          <ul>
            <li>Reminder: Complete the User Authentication by 2024-06-01</li>
            <li>New Task: Start working on Campaign webpage</li>
            <li>Update: Integration of AI is in progress</li>
          </ul>
        </div>
      </div>

      <div className="plot">
        <div className="analysis-plot">
          <h2>Tasks Overview</h2>
          <div style={{ height: "300px", width: "300px" }}>
            <Pie
              data={statusData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        const status = tooltipItem.label;
                        const tasks = taskData
                          .filter((task) => task.Status === status)
                          .map((task) => task.Ticket_Name)
                          .slice(0, 5) // Limit to 5 tasks in the tooltip
                          .join(", ");
                        return tasks.length > 0 ? tasks : "No tasks available"; // Fallback message
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
