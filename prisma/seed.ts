import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // ADMIN
    await prisma.admin.create({
        data: {
            id: "admin1",
            username: "admin1",
        },
    });
    await prisma.admin.create({
        data: {
            id: "admin2",
            username: "admin2",
        },
    });


    // SUBJECT
    const subjectIds = [];
    for (let i = 1; i <= 10; i++) {
        const subject = await prisma.subject.create({
            data: {
                name: `Subject${i}`,
            },
        });
        subjectIds.push(subject.id); // Store subject ID
    }

    // GRADE
    const gradeIds = [];
    for (let i = 8; i <= 12; i++) {
        const grade = await prisma.grade.create({
            data: {
                level: i,
            },
        });
        gradeIds.push(grade.id); // Store grade ID
    }

    // CLASS
    const classIds = [];
    for (let i = 1; i <= 6; i++) {
        const gradeId = gradeIds[Math.floor(Math.random() * gradeIds.length)];
        const newClass = await prisma.class.create({
            data: {
                name: `${i}A`,
                gradeId: gradeId,
                capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
            },
        });
        classIds.push(newClass.id); // Store class ID
    }

    // TEACHER
    for (let i = 1; i <= 15; i++) {
        const randomSubjectId = subjectIds[Math.floor(Math.random() * subjectIds.length)];
        const randomClassId = classIds[Math.floor(Math.random() * classIds.length)];
        await prisma.teacher.create({
            data: {
                id: `teacher${i}`, // Unique ID for the teacher
                username: `teacher${i}`,
                name: `TName${i}`,
                surname: `TSurname${i}`,
                email: `teacher${i}@example.com`,
                phone: `051-407-789${i}`,
                address: `Address${i}`,
                bloodType: "A+",
                gender: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
                subjects: { connect: [{ id: randomSubjectId }] }, // Use valid subject IDs
                classes: { connect: [{ id: randomClassId }] }, // Use valid class IDs
                birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
            },
        });
    }


    // LESSON
    for (let i = 1; i <= 30; i++) {
        await prisma.lesson.create({
            data: {
                name: `Lesson${i}`,
                day: Day[
                    Object.keys(Day)[
                    Math.floor(Math.random() * Object.keys(Day).length)
                    ] as keyof typeof Day
                ],
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
                subjectId: (i % 10) + 1,
                classId: (i % 6) + 1,
                teacherId: `teacher${(i % 15) + 1}`,
            },
        });
    }

    // PARENT
    for (let i = 1; i <= 25; i++) {
        await prisma.parent.create({
            data: {
                id: `parentId${i}`,
                username: `parentId${i}`,
                name: `PName ${i}`,
                surname: `PSurname ${i}`,
                email: `parent${i}@example.com`,
                phone: `051-583-789${i}`,
                address: `Address${i}`,
            },
        });
    }

    // LEARNERS
    for (let i = 1; i <= 50; i++) {
        const randomGradeId = gradeIds[Math.floor(Math.random() * gradeIds.length)];
        const randomClassId = classIds[Math.floor(Math.random() * classIds.length)];
        await prisma.learner.create({
            data: {
                id: `learner${i}`,
                username: `learner${i}`,
                name: `SName${i}`,
                surname: `SSurname ${i}`,
                email: `learner${i}@example.com`,
                phone: `987-654-321${i}`,
                address: `Address${i}`,
                bloodType: "O-",
                gender: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
                parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, // Make sure parentId exists
                gradeId: randomGradeId, // Use a valid gradeId
                classId: randomClassId, // Use a valid classId
                birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
            },
        });
    }

    // EXAM
    for (let i = 1; i <= 10; i++) {
        await prisma.exam.create({
            data: {
                title: `Exam ${i}`,
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                lessonId: (i % 30) + 1,
            },
        });
    }

    // ASSIGNMENT
    for (let i = 1; i <= 10; i++) {
        await prisma.assignment.create({
            data: {
                title: `Assignment ${i}`,
                startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
                lessonId: (i % 30) + 1,
            },
        });
    }

    // RESULT
    for (let i = 1; i <= 10; i++) {
        await prisma.result.create({
            data: {
                score: 90,
                admissionNumber: `learner${i}`,
                ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
            },
        });
    }

    // ATTENDANCE
    for (let i = 1; i <= 10; i++) {
        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: true,
                admissionNumber: `learner${i}`,
                lessonId: (i % 30) + 1,
            },
        });
    }

    // EVENT
    for (let i = 1; i <= 5; i++) {
        await prisma.event.create({
            data: {
                title: `Event ${i}`,
                description: `Description for Event ${i}`,
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                classId: (i % 5) + 1,
            },
        });
    }

    // ANNOUNCEMENT
    for (let i = 1; i <= 5; i++) {
        await prisma.announcement.create({
            data: {
                title: `Announcement ${i}`,
                description: `Description for Announcement ${i}`,
                date: new Date(),
                classId: (i % 5) + 1,
            },
        });
    }

    console.log("Seeding completed successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });