"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, LearnerSchema, ParentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { error } from "console";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({ id: teacherId }))
                }
            }
        });

        //revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateSubject = async (currentState: CurrentState, data: SubjectSchema) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({ id: teacherId }))
                }
            }
        });

        //revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            }
        });

        //revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}

export const createClass = async (currentState: CurrentState, data: ClassSchema) => {
    try {
        await prisma.class.create({
            data
        });

        //revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
    try {
        await prisma.class.update({
            where: {
                id: data.id
            },
            data
        });

        //revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteClass = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id)
            }
        });

        //revalidatePath("/list/class");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const createTeacher = async (currentState: CurrentState, data: TeacherSchema) => {

    try {

        const user = await clerkClient.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });



        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                gender: data.gender,
                birthday: data.birthday,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    }))
                },
            }
        });

        //revalidatePath("/list/teacher");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
    if (!data.id) {
        return { success: false, error: true }
    }
    try {
        const user = await clerkClient.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });



        await prisma.teacher.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                gender: data.gender,
                birthday: data.birthday,
                subjects: {
                    set: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    }))
                },
            }
        });

        //revalidatePath("/list/teacher");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string
    try {
        await clerkClient.users.deleteUser(id); // delete user from clerk

        await prisma.teacher.delete({
            where: {
                id: id
            }
        });

        //revalidatePath("/list/teacher");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}


export const createLearner = async (currentState: CurrentState, data: LearnerSchema) => {
    try {
        const classItem = await prisma.class.findUnique({
            where: {
                id: data.classId
            },
            include: { _count: { select: { learners: true } } }
        });

        if (classItem && classItem.capacity === classItem._count.learners) {
            return { success: false, error: true }
        }

        const user = await clerkClient.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata:{role:"learner"}
        });



        await prisma.learner.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                gender: data.gender,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            }
        });

        //revalidatePath("/list/learner");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateLearner = async (currentState: CurrentState, data: LearnerSchema) => {
    if (!data.id) {
        return { success: false, error: true }
    }
    try {
        const user = await clerkClient.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });



        await prisma.learner.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                gender: data.gender,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            }
        });

        //revalidatePath("/list/learner");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteLearner = async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string
    try {

        await clerkClient.users.deleteUser(id); // delete user from clerk

        await prisma.learner.delete({
            where: {
                id: id
            }
        });

        //revalidatePath("/list/learner");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}

export const createExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            });

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/exam");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            });

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/exam");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        // revalidatePath("/list/exam");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};


export const createParent = async (currentState: CurrentState, data: ParentSchema) => {

    try {

        const user = await clerkClient.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata:{role:"parent"}
        });



        await prisma.parent.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
            }
        });

        //revalidatePath("/list/parent");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateParent = async (currentState: CurrentState, data: ParentSchema) => {
    if (!data.id) {
        return { success: false, error: true }
    }
    try {
        const user = await clerkClient.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });



        await prisma.parent.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
            }
        });

        //revalidatePath("/list/parent");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteParent= async (currentState: CurrentState, data: FormData) => {
    const id = data.get("id") as string
    try {
        await clerkClient.users.deleteUser(id); // delete user from clerk

        await prisma.parent.delete({
            where: {
                id: id
            }
        });

        //revalidatePath("/list/parent");
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}