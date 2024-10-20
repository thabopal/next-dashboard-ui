import Announcements from "@/app/components/Announcements"
import BigCalendarContainer from "@/app/components/BigCalendarContainer"
import FormContainer from "@/app/components/FormContainer"
import LearnerAttendanceCard from "@/app/components/LearnerAttendanceCard"
import Performance from "@/app/components/Performance"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Class, Learner } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

const SingleLearnerPage = async ({ params: { id } }: { params: { id: string } }) => {

    const {userId, sessionClaims} = auth()
    const role = (sessionClaims?.metadata as {role?: string})?.role;

    const learner: (Learner & {
        class: (Class & {_count:{lessons:number}})
    }) 
    | null = await prisma.learner.findUnique({
        where: {
            id
        },
        include:{
            class: {include: {_count: {select: {lessons: true}}}}
        }
    });


    if (!learner) {
        return notFound();
    }
    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image  src={learner.img || "/noAvatar.png"} alt="" width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">{learner.name + " " + learner.surname}</h1>
                            {role === "admin" && (<FormContainer
                                    table="learner"
                                    type="update"
                                    data={learner} />
                               )}
                               </div>
                            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/blood.png" alt="" width={14} height={14} />
                                    <span>{learner.bloodType}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14} />
                                    <span>{new Intl.DateTimeFormat("en-ZA").format(learner.birthday)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>{learner.email || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>{learner.phone || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SMALL CARD */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:[48%] 2xl:w-[48%]">
                            <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <Suspense fallback="loading...">
                                <LearnerAttendanceCard id={learner.id}/>
                            </Suspense>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:[48%] 2xl[48%] 2xl:w-[48%]">
                            <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="text-xl font-semibold">
                                <h1>{learner.class.name.charAt(0)}th</h1>
                                <span className="text-sm text-gray-400">Grade</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:[48%] 2xl[48%] 2xl:w-[48%]">
                            <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="text-xl font-semibold">
                                <h1>{learner.class._count.lessons}</h1>
                                <span className="text-sm text-gray-400">Lessons</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:[48%] 2xl[48%] 2xl:w-[48%]">
                            <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                            <div className="text-xl font-semibold">
                                <h1>{learner.class.name}</h1>
                                <span className="text-sm text-gray-400">Class</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Learner&apos;s Timetable</h1>
                    <BigCalendarContainer type="classId" id={learner.class.id}/>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/lessons?classId=${2}`}>Learner&apos;s Lessons</Link>
                        <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${2}`}>Learner&apos;s Teachers</Link>
                        <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/results?admissionNumber=${2}`}>Learner&apos;s Results</Link>
                        <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${2}`}>Learner&apos;s Exams</Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?classId=${2}`}>Learner&apos;s Assignments</Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    )
}

export default SingleLearnerPage