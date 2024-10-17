import Pagination from "@/app/components/Pagination"
import Table from "@/app/components/Table"
import TableSearch from "@/app/components/TableSearch"
import { resultsData, role, } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Prisma } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type ResultList = {
    id: string;
    title: string;
    learnerName: string;
    learneSurname: string;
    score: number;
    teacherName:string;
    teacherSurname:string;
    class: string;
    className:string;
    startTime: Date;
}

const columns = [
    {
        header: "Title", accessor: "title"
    },
    {
        header: "Learner", accessor: "learner"
    },
    {
        header: "Marks", accessor: "score", className: "hidden md:table-cell"
    },
    {
        header: "Teacher", accessor: "teacher", className: "hidden md:table-cell"
    },
    {
        header: "Class", accessor: "class", className: "hidden md:table-cell"
    },
    {
        header: "Date", accessor: "date", className: "hidden md:table-cell"
    },
    {
        header: "Actions", accessor: "actions"
    }
]

const renderRow = (item: ResultList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gp-4 p-4">
            {item.title}
        </td>
        <td>{item.learnerName + " " + item.learneSurname}</td>
        <td className="hidden md:table-cell">{item.score}</td>
        <td className="hidden md:table-cell">{item.teacherName + " " + item.teacherSurname}</td>
        <td className="hidden md:table-cell">{item.className}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-ZA").format(item.startTime)}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                        <Image src="/edit.png" alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
                    <Image src="/delete.png" alt="" width={16} height={16} />
                </button>)}
            </div>
        </td>
    </tr>
);

const ResultListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined }; }) => {
    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    // URL Query Params condition

    const query: Prisma.ResultWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "admissionNumber":
                        query.admissionNumber = value;
                        break;
                    case "search":
                        query.OR = [   
                            { learner: { name: { contains: value, mode: "insensitive" } } },
                            { exam: { title: { contains: value, mode: "insensitive" } } },
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [dataRes, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                 learner:{ select: {name: true, surname: true}},
                 exam: {
                    include: {
                        lesson: {
                            select: {
                                teacher: { select: { name: true, surname: true } },
                                class: { select: { name: true } },
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                teacher: { select: { name: true, surname: true } },
                                class: { select: { name: true } },
                            }
                        }
                    }
                },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.result.count({ where: query }),
    ]);

    const data = dataRes.map((item) => {
        const assessment = item.exam || item.assignment

        if(!assessment) return null;

        const isExam = "startTime" in assessment;

        return {
            id: item.id,
            title: assessment.title,
            learnerName: item.learner.name,
            learneSurname: item.learner.surname,
            score: item.score,
            teacherName: assessment.lesson.teacher.name,
            teacherSurname: assessment.lesson.teacher.surname,
            class: assessment.lesson.class.name,
            className:assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
        }
    });


    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/plus.png" alt="" width={14} height={14} />
                        </button>)}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination page={p} count={count}/>
        </div>
    );
};

export default ResultListPage