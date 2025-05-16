import prisma from '@/lib/prisma';
export async function GET() {
    const data = await prisma.paket.findMany({
    orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { code, name, desc } = await request.json();
    if (!code || !name || !desc) {
        return new Response(JSON.stringify({ error: 'All Fields Are Required' }), {
            status: 400,
        });
    }
    const paket = await prisma.paket.create({
        data: { code, name, desc },
    });
    return new Response(JSON.stringify(paket), { status: 201 });
}

export async function PUT(request) {
    const { id, code, name, desc } = await request.json();
    if (!id || !code || !name || !desc) return Response.json({ error: 'Field is Empty' }, { 
        status: 400 });
    const paket = await prisma.paket.update({
        where: { id },
        data: { code, name, desc },
    });
    return Response.json(paket);
}

export async function DELETE(request) {
    const { id } = await request.json();
    if (!id) return Response.json({ error: 'ID Not Found' }, { status: 400 });
    await prisma.paket.delete({ where: { id } });
    return Response.json({ message: 'Deleted Successfully' });
}  