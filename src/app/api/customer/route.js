import prisma from '@/lib/prisma';

export async function GET() {
    const data = await prisma.customer.findMany({
        orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { name, phone, email, createdAt } = await request.json();
    if (!name || !phone || !email) {
        return new Response(JSON.stringify({ error: 'All Fields Are Required' }), {
            status: 400,
        });
    }
    const customer = await prisma.customer.create({
        data: { name, phone, email },
    });
    return new Response(JSON.stringify(customer), { status: 201 });
}

export async function PUT(request) {
    const { id, name, phone, email, createdAt } = await request.json();
    if (!id || !name || !phone || !email) return Response.json({ error: 'Field is Empty' }, { 
        status: 400 });
    const customer = await prisma.customer.update({
        where: { id },
        data: { name, phone, email },
    });
    return Response.json(customer);
}

export async function DELETE(request) {
    const { id } = await request.json();
    if (!id) return Response.json({ error: 'ID Not Found' }, { status: 400 });
    await prisma.customer.delete({ where: { id } });
    return Response.json({ message: 'Deleted Successfully' });
}  