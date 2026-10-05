import { video } from '@/lib/gateway';
export async function POST(request: Request) { return video(request); }
