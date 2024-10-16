"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import TextareaField from "@/components/Admin/TextareaField";
import React, { useEffect, useState } from "react";
import { CombinedForum } from "@/components/Admin/TableForum";

const schema = z.object({
  title: z
    .string()
    .min(3, { message: "Titile name must be at least 3 characters long!" }),

  content: z.string().min(1, { message: "Content is required!" }),
});

type Inputs = z.infer<typeof schema>;
interface ProductFormProps {
  type: "create" | "update";
  data?: CombinedForum | null;
  onUpdate?: () => void;
  Token: string | undefined;
}
const ForumForm = ({ type, data, onUpdate, Token }: ProductFormProps) => {
  const [forumImages, setForumImages] = React.useState<
    {
      id: number;
      images: string;
    }[]
  >(data?.forumImages || []);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || undefined,
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: -1,
        images: file.name,
      }));
      setForumImages([...forumImages, ...newImages]);
    }
  };

  const handleImageDelete = async (id: number) => {
    const res = await fetch(
      `https://localhost:7146/api/account/forum-images/admin/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    if (!res.ok) {
      alert(errors);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
    setForumImages((prevImages) =>
      prevImages.filter((image) => image.id !== id)
    );
  };
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const url =
        type === "create"
          ? "https://localhost:7146/api/account/forum"
          : `https://localhost:7146/api/account/forum/${data?.id}`;

      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Success",
        description: `Forum ${
          type === "create" ? "created" : "updated"
        } successfully`,
      });

      if (type === "update" && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${type} forum. Please try again.`,
        variant: "destructive",
      });
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new product" : "Update product"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <TextareaField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <TextareaField
          label="Content"
          name="content"
          defaultValue={data?.content}
          register={register}
          error={errors?.content}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <span>Upload a photo</span>
          </label>
          {forumImages.map((image, index) => (
            <div key={image.id || index} className="relative">
              <img
                src={`https://localhost:7146/Resources/${image.images}`}
                alt={image.images}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md"
                onClick={() => handleImageDelete(image.id)}
              >
                Delete
              </button>
            </div>
          ))}
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
            <label
              htmlFor="image-upload"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>Upload Image</span>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ForumForm;
