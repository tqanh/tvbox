# TVBox - TikTok Tổng Tài PWA

Progressive Web App cho TV Box - Xem video TikTok chủ đề Tổng Tài, CEO trên TV.

## Tính năng

- **UI tối ưu cho TV**: Font lớn, nút bấm dễ nhìn từ xa
- **Điều hướng remote**: Hỗ trợ phím mũi tên, Enter, Esc/Back
- **Danh mục video**: Tổng Tài, CEO, Bad Boy, Quý Ông, Thời Trang, Luxury
- **Tìm kiếm**: Tìm video theo tên và mô tả
- **PWA**: Cài đặt như app, hoạt động offline

## Cài đặt trên TV Box

1. Mở trình duyệt trên TV Box
2. Truy cập: `https://<username>.github.io/tvbox/`
3. Chọn "Add to Home Screen" hoặc "Install App"

## Điều hướng

| Phím | Chức năng |
|------|-----------|
| ↑↓←→ | Di chuyển giữa các mục |
| Enter | Chọn/Xem video |
| Esc/Back | Quay lại/Đóng video |

## Cấu trúc Project

```
tvbox/
├── index.html          # Trang chính
├── app.js              # Logic ứng dụng
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline cache
├── assets/
│   └── icon.svg        # App icon
└── README.md
```

## Deploy GitHub Pages

```bash
git add .
git commit -m "Add PWA files"
git push origin main
```

Vào Settings > Pages > Chọn branch `main` / folder `root`.

## Lưu ý

- Hiện tại sử dụng sample data. Để tích hợp TikTok API thực, cần đăng ký TikTok for Developers.
- Hỗ trợ tốt nhất trên Android TV Box với trình duyệt Chrome/Firefox.