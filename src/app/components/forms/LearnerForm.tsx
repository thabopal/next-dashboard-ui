"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { learnerSchema, LearnerSchema, teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createLearner, createTeacher, updateLearner, updateTeacher } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";



const LearnerForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LearnerSchema>({
        resolver: zodResolver(learnerSchema),
    });

    const [img, setImg] = useState<any>()

    const [state, formAction] = useFormState(type === "create" ? createLearner : updateLearner, { success: false, error: false });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        formAction({...data, img: img?.secure_url});
    })

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`Learner has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    const { grades, classes } = relatedData;

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new learner" : "Update a learner"}</h1>
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Username" defaultValue={data?.username} register={register} name="username" error={errors.username} />
                <InputField label="Email" type="email" defaultValue={data?.email} register={register} name="email" error={errors.email} />
                <InputField label="Password" type="password" defaultValue={data?.password} register={register} name="password" error={errors.password} />
            </div>
            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <CldUploadWidget uploadPreset="academy360" onSuccess={(result, { widget }) => {
                    setImg(result.info)
                    widget.close()
                }}>
                    {({ open }) => {
                        return (
                            <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" onClick={() => open()}>
                                <Image src="/upload.png" alt="upload" width={28} height={28} />
                                <span>Upload a photo</span>
                            </div>
                        );
                    }}
                </CldUploadWidget>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="First Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Last Name"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField
                    label="Blood Type"
                    name="bloodType"
                    defaultValue={data?.bloodType}
                    register={register}
                    error={errors.bloodType}
                />
                <InputField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    defaultValue={data?.birthday.toISOString().split("T")[0]}
                    register={register}
                    error={errors.birthday}
                />
                <InputField
                    label="Parent Id"
                    name="parentId"
                    type=""
                    defaultValue={data?.parentId}
                    register={register}
                    error={errors.parentId}
                />
                 {data && (
                <InputField
                    label="Id"
                    name="id"
                    defaultValue={data?.id}
                    register={register}
                    error={errors?.id}
                    hidden
                />
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-400">Gender</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")} defaultValue={data?.gender}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors.gender?.message && <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-400">Grade</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gradeId")} defaultValue={data?.gradeId}>
                        {grades.map((grade: { id: number; level: number }) => (
                            <option key={grade.id} value={grade.id} selected={data && grade.id === data.id}>{grade.level}</option>
                        ))}
                    </select>
                    {errors.gradeId?.message && <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-400">Class</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("classId")} defaultValue={data?.gradeId}>
                        {classes.map((classItem: { id: number; name: string; capacity: number; _count:{learners:number};}) => (
                            <option key={classItem.id} value={classItem.id}>({classItem.name} - {classItem._count.learners + "/" + classItem.capacity}{" "}Capacity)</option>
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

export default LearnerForm