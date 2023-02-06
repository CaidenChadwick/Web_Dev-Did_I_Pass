import express, { Express, Request, Response } from 'express';
import { getAllStudents, createNewStudent, getStudentByName } from './controllers/StudentController';

const app: Express = express();
const PORT = 8000;

app.use(express.json());

app.get('/api/students', getAllStudents);
app.post('/api/students', createNewStudent);
app.get('/api/students/:studentName', getStudentByName);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});