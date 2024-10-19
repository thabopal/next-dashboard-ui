import prisma from "@/lib/prisma"
import { date } from "zod"

const LearnerAttendanceCard = async ({id}:{id:string}) => {

  const attendance = await prisma.attendance.findMany({
    where: {
      admissionNumber: id,
        date: {
          gte: new Date(new Date().getFullYear(), 0, 1),
        }
      }
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.present).length;
  const percentage = presentDays / totalDays * 100;
  return (
    <div className="text-xl font-semibold">
      <h1>{percentage}%</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  )
}

export default LearnerAttendanceCard