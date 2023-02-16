type CourseGrades = {
    assignmentWeights: Array<CourseGrade>;
    finalExamWeight: number;
}

type CourseGrade = {
    name: string;
    weight: number;
    grade: number;
}

type StudentManager = Record<string, Student>;

type Student = {
    name: string;
    weights: CourseGrades;
    currentAverage: number;
}

type StudentNameParams = {
    studentName: string;
}

type NewStudentRequest = {
    name: string;
    weights: CourseGrades;
}

type AssignmentGrade = {
    grade: number;
}

type GradeUpdateParams = {
    studentName: string;
    assignmentName: string;
}

type FinalGrade = {
    overallScore: number;
    letterGrade: number;
}

type FinalExamScores = {
    neededForA: number;
    neededForB: number;
    neededForC: number;
    neededForD: number;
}