import { Request, Response } from 'express';
import { students, addStudent, getStudent, calculateFinalExamScore } from '../models/StudentModel';

function getAllStudents(req: Request, res: Response): void {
    res.json(students);
}

function createNewStudent(req: Request, res: Response): void {
    const studentData = req.body as NewStudentRequest;

    const weights = studentData.weights.assignmentWeights.reduce((prev: number, curr: CourseGrade) => {
        return prev + curr.weight;
    }, 0);

    if (weights + studentData.weights.finalExamWeight !== 100) {
        res.sendStatus(400); // 400 Bad Request - weights don't sum to 100
        return;
    }

    const didAddStudent = addStudent(studentData);
    // If the student's data was not added succesfully
    if (!didAddStudent) {
        res.sendStatus(409); // 409 Conflict - student's name already exists or weights do not sum to 100
        return;
    }

    res.sendStatus(201); // 201 Created - student was successfully added to set
}

function getStudentByName(req: Request, res: Response): void {
    const { studentName } = req.params as StudentNameParams;
    const student = getStudent(studentName);

    // If `student` is undefined
    // send status 404
    if (!student) {
        res.sendStatus(404); // 404 Not Found - student is not in set
        return;
    }

    // Respond with the student's information as json
    res.json(student);
}

function getFinalExamScores(req: Request, res: Response): void {
    // Get the student name from the path params
    const { studentName } = req.params as StudentNameParams;

    // Get the student's data from the dataset
    const student = getStudent(studentName);

    // If the student was not found
    if (!student) {
        res.sendStatus(404); // 404 Not Found - student is not in set
        return;
    }

    // FIXME: Get the current average and weights from the student's data
    const { currentAverage } = student;
    const finalExamWeight = student.weights.finalExamWeight;

    // Calculate Final Exam Scores Needed
    const neededForA = calculateFinalExamScore(currentAverage, finalExamWeight, 90);
    const neededForB = calculateFinalExamScore(currentAverage, finalExamWeight, 80);
    const neededForC = calculateFinalExamScore(currentAverage, finalExamWeight, 70);
    const neededForD = calculateFinalExamScore(currentAverage, finalExamWeight, 60);

    // Send a JSON response with an object containing the grades needed for an A through D
    res.json({
        "neededForA": neededForA,
        "neededForB": neededForB,
        "neededForC": neededForC,
        "neededForD": neededForD
    });

}

export { getAllStudents, createNewStudent, getStudentByName, getFinalExamScores };