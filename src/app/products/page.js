import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
    const req = await fetch('http://localhost:3000/api/items');
    const data = await req.json();

    return (
        <div className="flex items-center justify-center py-10 px-4 bg-gray-50">
            <div className="max-w-[450px] w-full grid grid-cols-2 gap-8">
                {data?.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white shadow-md rounded-lg p-2 flex flex-col"
                    >
                        {/* Main cover image */}
                        <div className="relative w-full h-32 rounded-md overflow-hidden mb-4">
                            <Image
                                src={product.coverImageUrl}
                                alt={product.itemName}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={true}
                            />
                        </div>

                        {/* Product info */}
                        <h2 className="text-sm font-semibold text-gray-900 mb-1">
                            {product.itemName}
                        </h2>
                        <Link href={`/products/${product._id}`}>
                            <Button className={'w-full mt-6 cursor-pointer'}>View Items</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default page;
