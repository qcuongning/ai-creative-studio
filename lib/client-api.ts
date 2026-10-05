export async function callAPI(path:string,key:string,body:unknown){
 let r:Response;
 try{r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key},body:JSON.stringify(body)});}catch{throw new Error('Mất kết nối. Yêu cầu có thể đã được gửi; kiểm tra tài khoản trước khi tạo lại.');}
 if(!r.ok){const data=await r.json().catch(()=>({})) as {error?:string};throw new Error(data.error||`Không thể hoàn thành yêu cầu (HTTP ${r.status}).`);}return r;
}
export async function imageBlob(data:unknown):Promise<Blob>{
 const r=data as {data?:{b64_json?:string;url?:string}[]};const item=r.data?.[0];
 if(!item?.b64_json)throw new Error('Gateway không trả về ảnh base64 như tài liệu. Vui lòng kiểm tra model.');
 const bytes=Uint8Array.from(atob(item.b64_json.replace(/^data:image\/[^;]+;base64,/,'')),c=>c.charCodeAt(0));
 const mime=bytes[0]===0xff&&bytes[1]===0xd8?'image/jpeg':bytes[0]===0x52&&bytes[1]===0x49?'image/webp':'image/png';return new Blob([bytes],{type:mime});
}
export function mediaExtension(type:string,kind:string){return type.includes('wav')?'wav':type.includes('ogg')?'ogg':type.includes('flac')?'flac':type.includes('jpeg')?'jpg':type.includes('webp')?'webp':kind==='video'?'mp4':kind==='speech'?'mp3':'png';}
