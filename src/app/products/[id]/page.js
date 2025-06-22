import Image from 'next/image';
import React from 'react';

const page = async ({ params }) => {
    const { id } = await params;
    const req = await fetch(`http://localhost:3000/api/items/${id}`)
    const singleProduct = await req.json()
    console.log(singleProduct);
    return (
        <div className='flex items-center justify-center h-full py-10'>
            <div className='max-w-[450px] w-full shadow-2xl p-6 grid grid-cols-2 gap-4'>
                <div>
                    <Image
                        src={singleProduct.coverImageUrl}
                        alt={singleProduct.itemName}
                        width={320}
                        height={320}
                        className='rounded object-cover w-[320px] h-[320px]'
                    />
                    <div className='flex items-center gap-3 mt-3 w-full'>
                        {
                            singleProduct?.additionalImageUrls.map((image, i) => {
                                return (
                                    <Image key={i} src={image} alt='' height={80} width={80} className='w-full h-[80px]' />
                                )
                            })
                        }
                    </div>
                </div>
                <div className='space-y-4'>
                    <h1 className='text-lg'>{singleProduct.itemName}</h1>
                    <p className='text-base'>Type: {singleProduct.itemType}</p>
                    <p className='text-sm'>{singleProduct.description}</p>
                </div>
            </div>
        </div>
    );
};

export default page;