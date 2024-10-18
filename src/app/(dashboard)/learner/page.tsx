import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import EventCalendar from "@/app/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const LearnerPage = async () => {

    const {userId} = auth();

    const classItem = await prisma.class.findMany({
        where: {
            learners: {
                some: {
                    id: userId!
                }
            }
        }   
    })

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:W-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Timetable (8A)</h1>
                    <BigCalendarContainer type="classId" id={classItem[0].id}/>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
};

export default LearnerPage;