import express, { Express, Request, Response } from 'express';
import chalk from 'chalk';
import { getAllStudents, createNewStudent, getStudentByName, getFinalExamScores, calcFinalScore } from './controllers/StudentController';

const app: Express = express();
const PORT = 8091;
function getRoot(req: Request, res: Response): void {
    res.send('Hello, from Caiden');
}

app.use(express.json());

app.get('/', getRoot);
app.get('/api/students', getAllStudents);
app.post('/api/students', createNewStudent);
app.get('/api/students/:studentName', getStudentByName);
app.get('/api/students/:studentName/finalExam', getFinalExamScores);
app.post('/api/students/:studentName/finalExam', calcFinalScore);

app.listen(PORT, () => {
    console.log(`Server listening on ${chalk.underline.cyanBright(`http://localhost:${PORT}`)}`);
});
