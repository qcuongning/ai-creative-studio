export type Mode = 'image' | 'video' | 'speech';
export const models = {
  image: [
    {id:'nano-banana-2',name:'Nano Banana 2',note:'Cân bằng tốc độ và chất lượng'},
    {id:'nano-banana-2-lite',name:'Nano Banana 2 Lite',note:'Nhanh, tiết kiệm'},
    {id:'nano-banana-pro',name:'Nano Banana Pro',note:'Ưu tiên chất lượng'}
  ],
  video: [
    {id:'veo-3.1-lite-generate-001',name:'Veo 3.1 Lite',note:'Tiết kiệm · 720p'},
    {id:'veo-3.1-fast-generate-001',name:'Veo 3.1 Fast',note:'Nhanh · 720p / 1080p'},
    {id:'veo-3.1-generate-001',name:'Veo 3.1',note:'Ưu tiên chất lượng'}
  ],
  speech: [
    {id:'gemini-3.1-flash-tts-preview',name:'Gemini 3.1 Flash TTS',note:'Bản xem trước'},
    {id:'gemini-2.5-flash-preview-tts',name:'Gemini 2.5 Flash TTS',note:'Tạo giọng nói nhanh'},
    {id:'gemini-2.5-pro-preview-tts',name:'Gemini 2.5 Pro TTS',note:'Ưu tiên chất lượng'}
  ]
};
export const voices=['Zephyr','Puck','Charon'];
export const ratios=['1:1','3:4','4:3','16:9','9:16'];
export const modes: Mode[]=['image','video','speech'];
