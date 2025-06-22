import client from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
const db = client.db('intern');
const products = db.collection('products');
export async function GET(request, { params }) {
    const { id } = await params;
    const data = await products.findOne({ _id: new ObjectId(id) });
    console.log(data);
    return Response.json(data);
}
