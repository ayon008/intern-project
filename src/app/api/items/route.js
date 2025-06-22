import client from "@/lib/mongoDB";
const db = client.db('intern');
const products = db.collection('products');

export async function POST(request) {
    const data = await request.json();
    const result = await products.insertOne(data);
    return Response.json(result);
}

export async function GET(request) {
    const data = await products.find().toArray();
    console.log(data);
    return Response.json(data);
}
