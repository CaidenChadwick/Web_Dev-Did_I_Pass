const students: StudentManager = {};

function calculateAverage(weights: CourseGrades): number {

    const total = weights.assignmentWeights.reduce((prev: number, curr: CourseGrade) => {
        return prev + curr.grade * curr.weight / 100;
    }, 0);

    // Return average (excluding final exam)
    const average = 100 * total / (100 - weights.finalExamWeight);
    return average;
}

function addStudent(newStudentData: NewStudentRequest): boolean {
    const { name, weights } = newStudentData;
    // If the student's name is in `students`
    // then return false
    if (name in students) {
        console.log('The student exists')
        return false;
    }

    // Calculate average and test weight sum
    const average = calculateAverage(weights);
    if (average === -1)
        return false;

    // create new student
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

function calculateFinalExamScore(currentAverage: number, finalExamWeight: number, targetScore: number): number {
    // Calculate the final exam score needed to get the targetScore in the class
    const weightedAverage = currentAverage * (1 - finalExamWeight / 100);
    return 100 * (targetScore - weightedAverage) / finalExamWeight;
}

export { students, addStudent, getStudent, calculateFinalExamScore };