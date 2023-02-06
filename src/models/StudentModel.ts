const students: StudentManager = {};

function calculateAverage(weights: CourseGrades): number {
    let total: number = 0;
    for (let i = 0; i < weights.assignmentWeights.length; i += 1) {
        total += weights.assignmentWeights[i].grade * weights.assignmentWeights[i].weight / 100;
    }

    // Return average (excluding final exam)
    const average: number = total / weights.assignmentWeights.length;
    return average;
}

function addStudent(newStudentData: NewStudentRequest): boolean {
    const { name, weights } = newStudentData;
    // If the student's name is in `students`
    // then return false
    if (name in students)
        return false;

    // Calculate average and create new student
    const average = calculateAverage(weights);
    const newStudent: Student = {
        name: name,
        weights: weights,
        currentAverage: average
    }

    // Add the new student
    students[name] = newStudent;

    return true;
}

function getStudent(studentName: string): Student | undefined {
    // If the student's name is not in `students`
    // then return undefined
    if (!(studentName in students))
        return undefined

    // Return the student's information (their name is the key for `students`)
    return students[studentName];
}

export { students, addStudent, getStudent };