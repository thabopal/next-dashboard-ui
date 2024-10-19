import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";

const ParentPage = () => {
    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:W-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Timetable | John Doe</h1>
                    {/* <BigCalendarContainer type="classId" id={learner.class.id}/> */}
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
};

export default ParentPage;