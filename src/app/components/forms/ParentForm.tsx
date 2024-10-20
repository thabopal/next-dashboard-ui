"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { parentSchema, ParentSchema, teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createParent, createTeacher, updateParent, updateTeacher } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";



const ParentForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
    });

    const [state, formAction] = useFormState(type === "create" ? createParent : updateParent, { success: false, error: false });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        formAction({...data });
    })

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

  

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new teacher" : "Update a teacher"}</h1>
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Username" defaultValue={data?.username} register={register} name="username" error={errors.username} />
                <InputField label="Email" type="email" defaultValue={data?.email} register={register} name="email" error={errors.email} />
                <InputField label="Password" type="password" defaultValue={data?.password} register={register} name="password" error={errors.password} />
            </div>
            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
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
            </div>
            {state.error && <span className="text-red-500">Something went wrong!</span>}
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default ParentForm