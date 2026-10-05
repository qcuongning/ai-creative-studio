import { z } from 'zod';
import { models, ratios, voices } from './catalog';
const API = 'https://api.thucchien.ai';
const headers = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const schema=z.object({mode:z.enum(['image','video','speech']),model:z.string(),prompt:z.string().trim().min(1).max(12000),ratio:z.string().optional(),seconds:z.string().optional(),size:z.string().optional(),voice:z.string().optional()}).strict();
export function requestSpec(value:unknown){
 const p=schema.parse(value);
 if(!models[p.mode].some(m=>m.id===p.model))throw new Error('Mô hình không phù hợp với loại nội dung.');
 if(p.mode==='image'){
  if(!ratios.includes(p.ratio??''))throw new Error('Tỷ lệ ảnh không hợp lệ.');
  return {path:'/v1/images/generations',body:{model:p.model,prompt:p.prompt,n:1,aspect_ratio:p.ratio}};
 }
 if(p.mode==='video'){
  if(!['4','6','8'].includes(p.seconds??''))throw new Error('Thời lượng không hợp lệ.');
  const sizes=p.model.includes('lite')?['1280x720','720x1280']:['1280x720','720x1280','1920x1080','1080x1920'];
  if(!sizes.includes(p.size??''))throw new Error('Kích thước video không phù hợp với model.');
  return {path:'/v1/videos',body:{model:p.model,prompt:p.prompt,seconds:p.seconds,size:p.size}};
 }
 if(!voices.includes(p.voice??''))throw new Error('Giọng đọc không hợp lệ.');
 if(p.prompt.length>5000)throw new Error('Vui lòng giới hạn nội dung giọng nói trong 5.000 ký tự mỗi lần.');
 return {path:'/audio/speech',body:{model:p.model,input:p.prompt,voice:p.voice}};
}
export function problem(message:string,status=400){return Response.json({error:message},{status,headers});}
export function authorize(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)throw new Error('Nguồn yêu cầu không hợp lệ.');
 if(!request.headers.get('content-type')?.includes('application/json'))throw new Error('Yêu cầu cần ở định dạng JSON.');
 const key=request.headers.get('x-api-key')?.trim();
 if(!key||key.length>512||/[\r\n]/.test(key))throw new Error('Vui lòng nhập API key hợp lệ.');
 return key;
}
export async function readBody(request:Request){
 if(Number(request.headers.get('content-length')??0)>100000)throw new Error('Yêu cầu quá lớn.');
 const text=await request.text();if(text.length>100000)throw new Error('Yêu cầu quá lớn.');return JSON.parse(text);
}
export async function upstream(path:string,key:string,body?:unknown,fetcher:typeof fetch=fetch){
 try{
 const response=await fetcher(API+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${key}`,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(180000),redirect:'error',cache:'no-store'});
 if(!response.ok){
  const status=response.status;
  const message=status===401?'API key không hợp lệ hoặc đã hết hạn.':status===402?'Tài khoản không đủ số dư để tạo nội dung.':status===403?'Key không có quyền dùng model hoặc tác vụ này.':status===429?'Đã chạm giới hạn tốc độ hoặc ngân sách. Chờ một lúc rồi kiểm tra lại tài khoản.':status===404?'Không tìm thấy model hoặc tác vụ trên gateway.':status>=500?'Gateway đang gặp sự cố. Vui lòng thử lại sau.':'Gateway từ chối yêu cầu. Kiểm tra nội dung và cấu hình đã chọn.';
  await response.body?.cancel();return problem(message,status);
 }
 const type=response.headers.get('content-type')??'application/octet-stream';
 return new Response(response.body,{status:response.status,headers:{...headers,'Content-Type':type,...(response.headers.get('x-litellm-response-cost')?{'x-generation-cost':response.headers.get('x-litellm-response-cost')!}:{})}});
 }catch{return problem('Chưa nhận được phản hồi từ gateway. Yêu cầu có thể đã được xử lý; kiểm tra tài khoản trước khi gửi lại để tránh tính phí hai lần.',504);}
}
export async function generate(request:Request,fetcher:typeof fetch=fetch){
 try{const key=authorize(request);const {path,body}=requestSpec(await readBody(request));return upstream(path,key,body,fetcher);}catch(e){return problem(e instanceof z.ZodError?'Prompt hoặc thiết lập không hợp lệ.':e instanceof SyntaxError?'JSON không hợp lệ.':e instanceof Error?e.message:'Yêu cầu không hợp lệ.');}
}
export async function video(request:Request,fetcher:typeof fetch=fetch){
 try{const key=authorize(request);const {id,action}=z.object({id:z.string().min(1).max(4096).regex(/^[a-zA-Z0-9_=-]+$/),action:z.enum(['status','content'])}).strict().parse(await readBody(request));return upstream(`/v1/videos/${encodeURIComponent(id)}${action==='content'?'/content':''}`,key,undefined,fetcher);}catch{return problem('API key hoặc mã tác vụ video không hợp lệ.');}
}
