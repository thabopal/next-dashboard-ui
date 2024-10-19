"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { classSchema, ClassSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createClass, createSubject, updateClass, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";




const ClassForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClassSchema>({
        resolver: zodResolver(classSchema),
    });

    //AFTER REACT 19 IT WILL BE useActionState

    const [state, formAction] = useFormState(
        type === "create" ? createClass : updateClass, 
        { 
            success: false, 
            error: false 
        }
    );

    const onSubmit = handleSubmit(data => {
        console.log(data);
        formAction(data);
    })

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Subject has been ${type === "create" ? "created" : "updated"} successfully!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router]);

    const { teachers, grades } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new class" : "Update a class"}</h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Class Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Capacity"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Id"
                    name="id"
                    defaultValue={data?.id}
                    register={register}
                    error={errors?.id}
                    hidden
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-400">HOD</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("hodId")} defaultValue={data?.gender}>
                        {teachers.map((teacher:{id:string;name:string;surname:string}) => (
                            <option key={teacher.id} value={teacher.id} selected={data && teacher.id === data.hodId}>{teacher.name + " " + teacher.surname}</option>
                        ))}
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.hodId?.message && <p className="text-xs text-red-400">{errors.hodId.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-400">Grade</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("hodId")} defaultValue={data?.gradeId}>
                        {grades.map((grade:{id:number;level:number}) => (
                            <option key={grade.id} value={grade.id} selected={data && grade.id === data.gradeId}>{grade.level}</option>
                        ))}
                    </select>
                    {errors.gradeId?.message && <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>}
                </div>
            </div>
            {state.error && <span className="text-red-500">Something went wrong!</span>}
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default ClassForm