import UserCard from "@/app/components/UserCard"
import FinanceChart from "@/app/components/FinanceChart"
import EventCalendar from "@/app/components/EventCalendar"
import Announcements from "@/app/components/Announcements"
import CountChartContainer from "@/app/components/CountChartContainer"
import AttendanceChartContainer from "@/app/components/AttendanceChartContainer"
import EventCalendarContainer from "@/app/components/EventCalendarContainer"

const AdminPage = ({searchParams}:{searchParams:{[keys: string]: string | undefined};
}) => {

    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* USER CARD */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type="admin"/>
                    <UserCard type="learner"/>
                    <UserCard type="teacher"/>
                    <UserCard type="parent"/>
                </div>
                
                {/* MIDDLE CHARTS */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHART */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                      <CountChartContainer />
                    </div>
                    {/* ATTENDANCE CHART */}
                    <div className="w-full lg:w-2/3 h-[450px]">
                       <AttendanceChartContainer />
                    </div>
                </div>
                {/* BOTTOM CHARTS */}
                <div className="w-full h-[500px]">
                    <FinanceChart />
                </div>
            </div>
           
            {/* RIGHT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendarContainer searchParams={searchParams}/>
                <Announcements />
            </div>
        </div>
    )
}

export default AdminPage