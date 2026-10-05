# Xưởng AI

Ứng dụng chat tiếng Việt tạo ảnh, video và giọng nói qua https://api.thucchien.ai.

## Chạy tại máy

```sh
npm install
npm run dev
```

Mở URL được in ra, chọn **Kết nối API**, nhập key của Thực Chiến AI. Chọn Ảnh / Video / Giọng nói, chọn mô hình, nhập prompt và bấm Tạo. Không cần cấu hình key trong mã nguồn hay file env. Key chỉ ở React state trong tab, chuyển qua backend cùng origin để gọi gateway cố định; không lưu key hoặc nội dung chat vào database/localStorage/log. Việc đóng hoặc tải lại tab sẽ mất key, lịch sử và đường dẫn blob: tải kết quả trước khi đóng tab.

## API và model

- Ảnh: `/v1/images/generations`, Nano Banana 2 / 2 Lite / Pro, `n:1`, `aspect_ratio`, trả base64.
- Video: `/v1/videos`, Veo 3.1 Lite / Fast / standard; thời lượng 4/6/8 giây; theo dõi mỗi 10 giây bằng `/v1/videos/{id}` rồi tải `/content`. Hết 15 phút hoặc mất kết nối, có nút theo dõi lại cùng job ID, không tạo job mới. Lite chỉ cho chọn 720p.
- Giọng nói: `/audio/speech`, Gemini 3.1 Flash / 2.5 Flash / 2.5 Pro TTS; Zephyr / Puck / Charon. Giới hạn ứng dụng: 5.000 ký tự mỗi lượt.
- Mỗi prompt là một yêu cầu độc lập; giao diện chat không giả lập context chỉnh sửa ảnh hoặc nối dài video.
- Các model được khai báo trong `lib/catalog.ts` theo tài liệu đọc ngày 2026-10-05. Khả năng sử dụng còn tùy quyền và số dư của API key.

Tài liệu: https://docs.thucchien.ai/docs/user-guide

## Kiểm tra

```sh
npx tsc --noEmit
npx esbuild lib/gateway.ts --bundle --platform=node --format=esm --outfile=.sites-runtime/gateway-test.mjs
node tests/gateway.test.mjs
npm run build
```

Kiểm tra tích hợp dùng phản hồi mô phỏng để xác minh endpoint, payload, xác thực, lỗi và nội dung binary; chưa thực hiện lượt sinh có phí vì chưa có API key. Có công cụ WebMCP `prepare_creative_prompt` chỉ điền bản nháp, không tự gửi yêu cầu phát sinh phí.
