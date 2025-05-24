import prisma from '@/lib/prisma';

export async function GET() {
    const data = await prisma.preorder.findMany({
        include: { paket: true},
        orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { order_date, order_by, selected_package, qty, is_paid } = await request.json();
    if (!order_date || !order_by || !selected_package || !qty || !is_paid) {
        return new Response(JSON.stringify({ error: 'All Fields Are Required' }), {
            status: 400,
        });
    }
    const preorder = await prisma.preorder.create({
        data: { order_date: new Date(order_date), order_by, selected_package: Number(selected_package), qty: Number(qty), is_paid: is_paid === "Paid" ? true:false },
    });
    return new Response(JSON.stringify(preorder), { status: 201 });
}

export async function PUT(request) {
    const { id, order_date, order_by, selected_package, qty, is_paid } = await request.json();
    if (!id || !order_date || !order_by || !selected_package || !qty || !is_paid) return Response.json({ error: 'Field is Empty' }, { 
        status: 400 });
    const preorder = await prisma.preorder.update({
        where: { id },
        data: { order_date: new Date(order_date), order_by, selected_package: Number(selected_package), qty: Number(qty), is_paid: is_paid === "Paid" ? true:false },
    });
    return Response.json(preorder);
}

export async function DELETE(request) {
    const { id } = await request.json();
    if (!id) return Response.json({ error: 'ID Not Found' }, { status: 400 });
    await prisma.preorder.delete({ where: { id } });
    return Response.json({ message: 'Deleted Successfully' });
}  