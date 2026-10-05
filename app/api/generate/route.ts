import { generate } from '@/lib/gateway';
export async function POST(request: Request) { return generate(request); }
