"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "@/components/Admin/InputField";
import { CombinedProduct } from "@/components/Admin/TableProduct";
import { useToast } from "@/components/ui/use-toast";
import TextareaField from "@/components/Admin/TextareaField";
import React, { useEffect, useState } from "react";
import SelectField from "@/components/Admin/SelectField";

const schema = z.object({
  product_Name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long!" })
    .max(100, { message: "Product name must be at most 100 characters long!" }),
  origin: z.string().min(1, { message: "Origin is required!" }),
  unique: z.string().min(1, { message: "Unique feature is required!" }),
  apply: z.string().min(1, { message: "Application details are required!" }),
  result: z.string().min(1, { message: "Result information is required!" }),
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().min(1, { message: "Quantity must be greater than 0!" })
  ),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(1, { message: "Price must be greater than 0!" })
  ),
  productTypeId: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(1, { message: "Product type is required!" })
  ),
  censor: z.boolean(),
  userId: z.string().min(1, { message: "User ID is required!" }),
});

type Inputs = z.infer<typeof schema>;
interface ProductFormProps {
  type: "create" | "update";
  data?: CombinedProduct | null;
  onUpdate?: () => void;
  Token: string | undefined;
}
interface ProductType {
  id: number;
  productType_Name: string;
}
const ProductForm = ({ type, data, onUpdate, Token }: ProductFormProps) => {
  const [productImages, setProductImages] = React.useState<
    { id: number; images: string }[]
  >(data?.productImages || []);
  const { toast } = useToast();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || undefined,
  });
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch("https://localhost:7146/api/product-type");

        if (!response.ok) {
          throw new Error("Failed to fetch product types");
        }

        const data = await response.json();
        setProductTypes(data);
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };
    fetchProductTypes();
  }, []);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: -1,
        images: file.name,
      }));
      setProductImages([...productImages, ...newImages]);
    }
  };

  const handleImageDelete = async (id: number) => {
    const res = await fetch(`https://localhost:7146/api/productimages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    if (!res.ok) {
      alert(errors);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
    setProductImages((prevImages) =>
      prevImages.filter((image) => image.id !== id)
    );
  };
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const url =
        type === "create"
          ? "https://localhost:7146/api/admin/product"
          : `https://localhost:7146/api/admin/product/${data?.id}`;

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
        description: `Product ${
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
        description: `Failed to ${type} product. Please try again.`,
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
        <InputField
          label="Product Name"
          name="product_Name"
          defaultValue={data?.product_Name}
          register={register}
          error={errors?.product_Name}
        />
        <TextareaField
          label="Origin"
          name="origin"
          defaultValue={data?.origin}
          register={register}
          error={errors?.origin}
        />
        <TextareaField
          label="Unique Feature"
          name="unique"
          defaultValue={data?.unique}
          register={register}
          error={errors?.unique}
        />
        <TextareaField
          label="Application"
          name="apply"
          defaultValue={data?.apply}
          register={register}
          error={errors?.apply}
        />
        <TextareaField
          label="Result"
          name="result"
          defaultValue={data?.result}
          register={register}
          error={errors?.result}
        />
        <InputField
          label="Quantity"
          name="quantity"
          type="number"
          // defaultValue={Number(data?.quantity)}
          register={register}
          error={errors?.quantity}
        />
        <InputField
          label="Price"
          name="price"
          type="number"
          // defaultValue={data?.price}
          register={register}
          error={errors?.price}
        />
        <SelectField
          label="Product Type"
          name="productTypeId"
          register={register}
          options={productTypes.map((type) => ({
            value: type.id,
            label: type.productType_Name,
          }))}
          defaultValue={data?.productTypeId}
          error={errors.productTypeId}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Censor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("censor")}
            defaultValue={data?.censor ? "true" : "false"}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {errors.censor?.message && (
            <p className="text-xs text-red-400">
              {errors.censor.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <span>Upload a photo</span>
          </label>
          {productImages.map((image, index) => (
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

export default ProductForm;
