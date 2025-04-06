export const tasksController = {
    createTask: (req, res) => {
      res.status(201).json({ id: 1, title: req.body.title, description: req.body.description });
    },
    updateTask: (req, res) => {
      res.status(200).json({ id: req.params.taskId, title: req.body.title, description: req.body.description });
    },
    deleteTask: (req, res) => {
      res.status(200).json({ message: 'Task deleted' });
    },
    updateTaskStatus: (req, res) => {
      res.status(200).json({ id: req.params.taskId, status: req.body.status });
    },
    assignTask: (req, res) => {
      res.status(200).json({ message: 'Task assigned', taskId: req.params.taskId, userId: req.params.userId });
    },
  };
  