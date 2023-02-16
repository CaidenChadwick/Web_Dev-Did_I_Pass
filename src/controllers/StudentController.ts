import { Request, Response } from 'express';
import { students, addStudent, getStudent, calculateFinalExamScore, getLetterGrade, updateStudentGrade } from '../models/StudentModel';

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
    // Get the student's data from the dataset
    const { studentName } = req.params as StudentNameParams;
    const student = getStudent(studentName);

    // If the student was not found
    if (!student) {
        res.sendStatus(404); // 404 Not Found - Student is not in set
        return;
    }

    // Get the current average and weights from the student's data
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

function calcFinalScore(req: Request, res: Response): void {
    // Get the student name from the path params
    const { studentName } = req.params as StudentNameParams;

    // Get the student's data from the dataset
    const student = getStudent(studentName);

    // If the student was not found 
    if (!student) {
        res.sendStatus(404); // 404 Not Found - Student is not in set
        return;
    }


    // Get the grade data from the request body as the `AssignmentGrade` type
    const { grade } = req.body as AssignmentGrade;

    // Get the current average and weights from the student's data
    const { currentAverage, weights } = student;

    // Calculate the final score that would receive using their current average and the hypothetical final exam grade.
    const overallScore = (currentAverage * (100 - weights.finalExamWeight) + grade * (weights.finalExamWeight)) / 100;
    // Get the letter grade they would receive given this score
    const letterGrade = getLetterGrade(overallScore);

    // Send back a JSON response containing their `overallScore` and `letterGrade.
    res.json({
        "overallScore": overallScore,
        "letterGrade": letterGrade
    });

}

function updateGrade(req: Request, res: Response): void {
    // Get the student's name and assignment name from the path parameters as a `GradeUpdateParams`
    const { studentName, assignmentName } = req.params as GradeUpdateParams;

    // Get the grade from the request body as an `AssignmentGrade`
    const { grade } = req.body as AssignmentGrade;

    // Update the student's grade
    const didUpdateGrade = updateStudentGrade(studentName, assignmentName, grade);

    // If the update did not complete (this means the student or the assignment wasn't found)
    if (!didUpdateGrade) {
        res.sendStatus(404); // 404 Not Found - Student or assignment was not found
        return;
    }

    // Respond with status 200 OK
    res.sendStatus(200); // 200 OK - Grade updated
}

export { getAllStudents, createNewStudent, getStudentByName, getFinalExamScores, calcFinalScore, updateGrade };