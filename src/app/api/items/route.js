import client from "@/lib/mongoDB";


export async function POST(request) {
    const db = client.db('intern');
    const products = db.collection('products');
    const data = await request.json();
    const result = await products.insertOne(data);
    return Response.json(result);
}
