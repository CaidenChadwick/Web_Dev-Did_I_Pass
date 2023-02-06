import { Request, Response } from 'express';
import { students, addStudent, getStudent } from '../models/StudentModel';

function getAllStudents(req: Request, res: Response): void {
    res.json(students);
}

function createNewStudent(req: Request, res: Response): void {
    const studentData = req.body as NewStudentRequest;

    const didAddStudent = addStudent(studentData);

    // If the student's data was not added succesfully
    if (!didAddStudent) {
        res.sendStatus(409); // 409 Conflict - student's name already exists in set
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

export { getAllStudents, createNewStudent, getStudentByName };