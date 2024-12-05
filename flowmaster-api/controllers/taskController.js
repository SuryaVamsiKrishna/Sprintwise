// taskController.js
const db = require("../db/database.js");
const { ObjectId } = require("mongodb");

const taskCollection = db.getTasksCollection();

const taskController = {
  async getAllTasks(req, res) {
    try {
      const taskCollection = db.getTasksCollection();
      const tasks = await taskCollection
        .find(
          {},
          {
            projection: { _id: 1, title: 1, description: 1 }, // Only fetch _id and email and description
          }
        )
        .toArray();

      if (tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }

      res.status(200).json(tasks);
    } catch (err) {
      console.error("Error retrieving tasks: ", err);
      res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  },

  async addTask(req, res) {
    try {
      const taskCollection = db.getTasksCollection();

      const newTask = {
        _id: new ObjectId(), // Generate unique ID
        ...req.body, //Include other item properties from the request body
      };

      const result = await taskCollection.insertOne(newTask);
      console.log("result.acknowledged: ", result.acknowledged);
      console.log("result is: ", result);

      if (result.acknowledged) {
        res.status(201).json(result.insertedId);
      } else {
        throw new Error("Failed to add task ");
      }
    } catch (err) {
      console.error("Failed to add task: ", err);
      res.status(500).json({ error: "Failed to add task" });
    }
  },

  // async updateTask(req, res) {
  //   const projectId = req.params.projectId;
  //   const taskId = req.params.id;
  //   const updates = req.body;

  //   if (!ObjectId.isValid(taskId)) {
  //     return res.status(400).json({ message: "Invalid ID format" });
  //   }

  //   try {
  //     const taskCollection = db.getTasksCollection();
  //     const result = await taskCollection.updateOne(
  //       { _id: new ObjectId(taskId) },
  //       { $set: updates }
  //     );

  //     if (result.matchedCount === 0) {
  //       return res.status(404).json({ message: "Task not found" });
  //     }

  //     if (result.modifiedCount === 0) {
  //       return res.status(304).json({ message: "No changes made to the task" });
  //     }

  //     res.status(200).json({ message: "Task updated successfully" });
  //   } catch (err) {
  //     console.error("Failed to update task: ", err);
  //     res.status(500).json({ error: "Failed to update task" });
  //   }
  // }
  async updateTask(req, res) {
    const projectId = req.params.projectId;  // Retrieve projectId from params
    const taskId = req.params.id;  // Retrieve taskId from params
    const updates = req.body;  // Get the updates from the request body

    if (!ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid project ID format" });
    }

    if (!taskId) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    try {
        const taskCollection = db.getTasksCollection();

        // Find the project by projectId
        const project = await taskCollection.findOne({ _id: new ObjectId(projectId) });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Parse the 'description' field which contains the tasks array
        const tasks = JSON.parse(project.description).tasks;

        // Find the task in the tasks array by its ID
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update the task with the new values from `updates`
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };

        // Update the project's description with the modified tasks array
        const updatedDescription = JSON.stringify({ tasks });

        // Update the project in the database
        const result = await taskCollection.updateOne(
            { _id: new ObjectId(projectId) },
            { $set: { description: updatedDescription } }
        );

        if (result.modifiedCount === 0) {
            return res.status(304).json({ message: "No changes made to the project" });
        }

        res.status(200).json({ message: "Task updated successfully" });

    } catch (err) {
        console.error("Failed to update task: ", err);
        res.status(500).json({ error: "Failed to update task" });
    }
},
};

module.exports = taskController;
