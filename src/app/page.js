'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'; // <-- import SweetAlert2
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';

const Page = () => {
  const { register, handleSubmit, setValue, watch, reset, setError,
    clearErrors, formState: { errors }, } = useForm();

  const uploadToImgBB = async (file) => {
    const apiKey = "9a38563b80c5197bc652b9f720cb5b06"; // your API key

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      return result.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const onSubmit = async (data) => {
    try {
      // Extract images
      const coverImageFile = data.coverImage?.[0];
      const additionalImageFiles = Array.from(data.additionalImages || []).slice(0, 3);

      // Upload cover image
      const coverImageUrl = coverImageFile ? await uploadToImgBB(coverImageFile) : null;

      // Upload up to 3 additional images
      const additionalImageUrls = await Promise.all(
        additionalImageFiles.map((file) => uploadToImgBB(file))
      );

      // Final data object
      const newData = {
        itemName: data.itemName,
        itemType: data.itemType,
        description: data.description,
        coverImageUrl,
        additionalImageUrls,
      };

      await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      // Show success popup
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Items added successfully!',
      });

      reset(); // reset form after successful submit

    } catch (error) {
      console.error("Upload Error:", error);
      // Show error popup
      await Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image(s). Please try again.',
      });
    }
  };


  const validateFiles = (e) => {
    const files = e.target.files;
    if (files.length > 3) {
      // set validation error
      setError("additionalImages", {
        type: "manual",
        message: "You can only upload up to 3 images",
      });
      // Clear input so user can select again
      e.target.value = null;
    } else {
      clearErrors("additionalImages");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className='m-auto max-w-[450px] w-full p-6 shadow-2xl rounded-2xl h-fit'>
        <h1 className="font-medium md:text-2xl text-xl mb-4">Add Items</h1>
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-2'>
            <Label htmlFor="itemName">Item Name</Label>
            <Input type="text" id="itemName" placeholder="Item Name" {...register("itemName", { required: true })} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="itemType">Item Type</Label>
            <Select onValueChange={(value) => setValue("itemType", value)} defaultValue="">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="item-type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t-shirt">T-Shirt</SelectItem>
                <SelectItem value="pants">Pants</SelectItem>
                <SelectItem value="shirt">Shirt</SelectItem>
                <SelectItem value="trousers">Trousers</SelectItem>
                <SelectItem value="long-shirt">Long Shirt</SelectItem>
                <SelectItem value="short-pant">Short Pant</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("itemType", { required: true })} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="description">Item Description</Label>
            <Textarea placeholder="Type your message here." id="description" {...register("description")} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="coverImage">Item Cover Image</Label>
            <Input id="coverImage" type="file" accept="image/*" {...register("coverImage", { required: true })} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="additionalImages">Item Additional Images</Label>
            <Input id="additionalImages" type="file" accept="image/*" multiple {...register("additionalImages", {
              onChange: validateFiles,
            })} />
          </div>
          {errors.additionalImages && (
            <p className="text-red-500">{errors.additionalImages.message}</p>
          )}
          <div>
            <Button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white w-full'>Add Items</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
