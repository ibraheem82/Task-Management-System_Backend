import request from 'supertest';
import app from '../app.js'; // Import the Express app
import { tasksController } from './mockControllers.js'; // Mocked controller

// Mocking the actual controller functions
jest.mock('../controllers/task.controller.js', () => tasksController);

describe('Task Routes', () => {
  // Test for creating a task
  it('should create a task (POST /api/tasks)', async () => {
    const newTask = { title: 'Test Task', description: 'Test Description' };
    const res = await request(app).post('/api/tasks').send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.description).toBe(newTask.description);
  });

  // Test for updating a task
  it('should update a task (PUT /api/tasks/:taskId)', async () => {
    const updatedTask = { title: 'Updated Task', description: 'Updated Description' };
    const res = await request(app).put('/api/tasks/1').send(updatedTask);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedTask.title);
    expect(res.body.description).toBe(updatedTask.description);
  });

  // Test for deleting a task
  it('should delete a task (DELETE /api/tasks/:taskId)', async () => {
    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });

  // Test for updating task status
  it('should update task status (PATCH /api/tasks/:taskId/status)', async () => {
    const statusUpdate = { status: 'In Progress' };
    const res = await request(app).patch('/api/tasks/1/status').send(statusUpdate);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(statusUpdate.status);
  });

  // Test for assigning a task to a user
  it('should assign a task to a user (PUT /api/tasks/:taskId/assign/:userId)', async () => {
    const res = await request(app).put('/api/tasks/1/assign/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task assigned');
  });
});
