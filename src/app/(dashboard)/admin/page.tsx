import UserCard from "@/app/components/UserCard"
import CountChart from "@/app/components/CountChart"
import AttendanceChart from "@/app/components/AttendanceChart"
import FinanceChart from "@/app/components/FinanceChart"
import EventCalendar from "@/app/components/EventCalendar"
import Announcements from "@/app/components/Announcements"

const AdminPage = () => {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* USER CARD */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="learner"/>
                    <UserCard type="teacher"/>
                    <UserCard type="parent"/>
                    <UserCard type="staff"/>
                </div>
                
                {/* MIDDLE CHARTS */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHART */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                      <CountChart />
                    </div>
                    {/* ATTENDANCE CHART */}
                    <div className="w-full lg:w-2/3 h-[450px]">
                       <AttendanceChart />
                    </div>
                </div>
                {/* BOTTOM CHARTS */}
                <div className="w-full h-[500px]">
                    <FinanceChart />
                </div>
            </div>
           
            {/* RIGHT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    )
}

export default AdminPage