# 🎨 ChatApp Frontend - Modern Angular 17 Real-Time SPA

![Angular](https://img.shields.io/badge/Angular-17.3-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)
![SignalR](https://img.shields.io/badge/SignalR-Client-red?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex)
![Nginx](https://img.shields.io/badge/Nginx-Production-009639?style=for-the-badge&logo=nginx)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)

Ứng dụng Frontend Single Page Application (SPA) cho hệ thống trò chuyện thời gian thực, được xây dựng trên nền tảng **Angular 17** kết hợp với **TypeScript**, **TailwindCSS** và **SignalR Client**. Giao diện được thiết kế hiện đại, mượt mà, tối ưu trải nghiệm người dùng (UX) và sẵn sàng đóng gói triển khai môi trường Production với **Nginx** & **Docker**.

---

## 💡 Điểm Nổi Bật Về Kỹ Thuật (Engineering Highlights)

### 1. Kiến Trúc Angular 17 Hiện Đại (Modern Angular Architecture)
- **Standalone Components**: Loại bỏ hoàn toàn `NgModule` cồng kềnh, giúp giảm bundle size, tăng tốc độ load trang và dễ bảo trì dự án.
- **Signals & Reactive State Management**: Kết hợp giữa Angular Signals và RxJS Observables để quản lý trạng thái real-time mượt mà, hạn chế tối đa re-render không cần thiết.
- **Modular Directory Architecture**:
  - `core/`: Chứa các singleton services (Auth, Chat, Socket, Notification), Guards, Interceptors và Models.
  - `features/`: Chia theo từng module chức năng màn hình (`chat`, `login`).
  - `shared/`: Chứa UI components tái sử dụng, custom directives & pipes.

### 2. Giao Tiếp Real-Time Qua SignalR WebSockets (`@microsoft/signalr`)
- Tích hợp `@microsoft/signalr` client kết nối trực tiếp với ASP.NET Core SignalR Backend.
- **Bi-directional Streaming**: Tự động kết nối lại khi mất mạng (Auto-reconnect handling).
- Nhận thông điệp tin nhắn mới, lịch sử trò chuyện (Message History), danh sách thành viên online và sự kiện gia nhập/rời phòng tức thì.

### 3. Giao Diện Tối Ưu UX & Responsive (TailwindCSS & Modern Design)
- Sử dụng **TailwindCSS 3** xây dựng giao diện chuẩn responsive (Desktop, Tablet, Mobile).
- **Rich Aesthetics**: Phong cách thiết kế hiện đại (Glassmorphic elements, mượt mà với micro-animations, màu sắc hài hòa).
- **User Presence & Typing Indicators**: Hiển thị trạng thái Online/Offline sinh động và hiệu ứng người dùng đang nhập tin nhắn.

### 4. Đóng Gói Production Chuẩn Doanh Nghiệp (Nginx & Multi-stage Docker)
- **Nginx SPA Fallback Configuration**: Cấu hình `nginx.conf` tùy chỉnh với directive `try_files $uri $uri/ /index.html;`, giải quyết triệt để lỗi 404 Not Found khi người dùng F5 hoặc reload trang tại các sub-routes của Angular SPA.
- **Multi-Stage Build Dockerfile**:
  - *Stage 1 (Builder)*: Sử dụng `node:20-alpine`, thực thi `npm ci` và biên dịch production bundle.
  - *Stage 2 (Runner)*: Sử dụng Nginx/Serve siêu nhẹ chỉ chứa file tĩnh đã build, tối ưu dung lượng Docker Image xuống mức tối thiểu.

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Framework** | Angular 17 (Standalone Components, Signals, Router) |
| **Language** | TypeScript 5.4 |
| **Real-time Engine** | `@microsoft/signalr` (v10.x) |
| **Reactive Programming** | RxJS 7.8 |
| **CSS Framework** | TailwindCSS 3.4, PostCSS, Autoprefixer |
| **Web Server (Production)**| Nginx / Serve |
| **Containerization** | Docker, Dockerfile.dev, Dockerfile.prod |

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```
chat-app/
├── src/
│   ├── app/
│   │   ├── core/                        # Core Layer (Services, Guards, Models)
│   │   │   ├── constants/               # API routes & WebSocket endpoints
│   │   │   ├── guards/                  # AuthGuard bảo vệ route chat
│   │   │   ├── interceptors/            # HTTP Interceptors (Token, Error handling)
│   │   │   ├── models/                  # Interfaces (User, Room, Message)
│   │   │   └── services/                # AuthService, ChatService, SocketService, NotificationService
│   │   │
│   │   ├── features/                    # Feature Modules (Màn hình chức năng)
│   │   │   ├── chat/                    # Giao diện phòng chat chính (Sidebar, Message Feed, Active Users)
│   │   │   └── login/                   # Màn hình đăng nhập / chọn Avatar
│   │   │
│   │   ├── shared/                      # Shared Components & UI Helpers
│   │   ├── app.component.ts             # Root Component
│   │   └── app.routes.ts                # Client-side Routing Map
│   │
│   ├── assets/                          # Static assets (images, icons)
│   └── styles.css                       # Global TailwindCSS styles
│
├── Dockerfile.dev                       # Config Docker Dev (hot-reload với --poll 2000)
├── Dockerfile.prod                      # Config Docker Production (Multi-stage build)
├── nginx.conf                           # Nginx web server config (Fix SPA F5 404)
├── tailwind.config.js                   # TailwindCSS configuration
├── angular.json                         # Angular CLI configuration
└── package.json                         # npm dependencies & scripts
```

---

## ⚡ Các Tính Năng Chính (Key Features)

1. **Đăng Nhập & Chọn Avatar (Authentication & Profile)**: Người dùng nhập tên và lựa chọn avatar đại diện sinh động trước khi tham gia trò chuyện.
2. **Kênh Chat Đa Phòng (Multi-Room Support)**: Chuyển đổi linh hoạt giữa các phòng chat (vd: `#general`, `#tech-discuss`) và tự động tải lại lịch sử tin nhắn tương ứng.
3. **Trò Chuyện Thời Gian Thực (Real-Time Messaging)**: Nhận tin nhắn từ các thành viên khác ngay lập tức thông qua kết nối SignalR WebSockets.
4. **Theo Dõi Trạng Thái Online (Live User Presence)**: Danh sách các thành viên đang hoạt động trong phòng được cập nhật tự động.
5. **Thông Báo Sự Kiện (Real-Time Notifications)**: Hiển thị thông báo khi có người dùng mới tham gia hoặc rời phòng chat.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án (Getting Started)

### Yêu cầu tiên quyết (Prerequisites)
- [Node.js](https://nodejs.org/) (Phiên bản v20 trở lên)
- [npm](https://www.npmjs.com/) (Phiên bản v10 trở lên)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 1. Phục Vụ Ở Môi Trường Local (Development)

1. Di chuyển vào thư mục frontend:
   ```bash
   cd chat-app
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm ci
   ```
3. Chạy Development Server:
   ```bash
   npm start
   # Hoặc: npx ng serve --open
   ```
4. Mở trình duyệt tại: `http://localhost:4200`

### 2. Chạy Bằng Docker (Hot-Reload Dev Container)

Tại thư mục gốc dự án:
```bash
docker compose -f docker-compose.dev.yaml up -d --build frontend
```
*Ghi chú*: `Dockerfile.dev` được cấu hình cờ `--poll 2000` để bắt sự kiện thay đổi file mượt mà khi chạy trên máy ảo hoặc Docker container trên Windows.

### 3. Build Production
```bash
npm run build
```
Thư mục output sản phẩm sẽ được tạo tại `dist/chat-app/browser`.

---

## 🌐 Cấu Hình Triển Khai Nginx (Nginx Server Configuration)

File `nginx.conf` được sử dụng trong Docker Production để phục vụ ứng dụng SPA và đảm bảo người dùng truy cập trực tiếp URL bất kỳ không bị lỗi 404:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```
