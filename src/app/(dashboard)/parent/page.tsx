import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ParentPage = async () => {
    const { userId } = auth();
    const currentUserId = userId;

    const learners = await prisma.learner.findMany({
        where: {
          parentId: currentUserId!,
        },
      });

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="">
          {learners.map((learner) => (
            <div className="w-full xl:w-2/3" key={learner.id}>
              <div className="h-full bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">
                  Timetable for ({learner.name + " " + learner.surname})
                </h1>
                <BigCalendarContainer type="classId" id={learner.classId} />
              </div>
            </div>
          ))}
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <Announcements />
        </div>
      </div>
    );
};

export default ParentPage;