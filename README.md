# TeamWeaver — Connect Skills. Weave Success.

> Nền tảng kết nối đồng đội sinh viên thực chiến dựa trên kỹ năng, lịch rảnh, mục tiêu học tập, minh chứng GPA và hệ thống tín nhiệm Peer Review.

---

## 🎨 Nhận diện Thương hiệu & Thiết kế (Brand Identity)
- **Primary Highlight**: Neon Lime `#BCEE26`
- **Accent / Matching**: Soft Violet `#8C64FF`
- **Secondary / Cards**: Slate Charcoal `#212330` & Deep Charcoal `#181924`
- **Light Theme**: Soft Neutral Slate `#F4F6F9` & Pure White `#FFFFFF`
- **Typography**:
  - **Headings & Buttons**: *Plus Jakarta Sans*
  - **Body Text & Captions**: *Inter*
- **Logo**: Biểu tượng ribbon vô cực chuyển màu gradient sống động Neon Lime ➔ Soft Violet.

---

## 🚀 Các Tính Năng Cốt Lõi Hoàn Thiện

### 1. Student Profile – Cơ Chế Hồ Sơ Sinh Viên Toàn Diện
- **Thông tin học vấn & liên hệ**: Họ tên, trường đại học (HUST, Swinburne, RMIT, FTU, HCMUT, NEU, v.v.), MSSV, chuyên ngành, số điện thoại / Zalo, Portfolio / Github link.
- **Xác thực GPA chính thức & Chính sách bảo mật**:
  - Sinh viên ký cam kết chia sẻ điểm GPA chính thức làm minh chứng uy tín cho đồng đội.
  - Hiển thị huy hiệu **GPA Verified Badge** (ví dụ: GPA 3.92/4.0 - Đã xác thực).
- **Kỹ năng & Chuyên môn**: Coding & Tech, Design & UI/UX, Marketing, Finance, Project Management.
- **Mục tiêu học tập & Cam kết thời gian**: High Distinction (HD), Distinction (D), Top 3/5 Cuộc thi; số giờ/tuần và khung giờ rảnh cụ thể.
- **Phong cách làm việc**: Proactive Communicator, Night Owl Builder, Agile Sprints, v.v.
- **Hồ sơ tín nhiệm (Credit Score) & Peer Reviews**: Điểm tín nhiệm tích lũy từ các lần hợp tác nhóm thực tế và đánh giá từ bạn học.
- **Đồng bộ cơ sở dữ liệu**: Lưu trữ và cập nhật trực tiếp lên bảng `profiles` trong Supabase.

### 2. Real-time Chat – Nhắn Tin Thời Gian Thực
- Nhắn tin tức thì giữa các bạn sinh viên đã ghép đôi (Mutual Matches).
- **Tích hợp Supabase Realtime**: Lắng nghe sự kiện qua WebSocket Channel `chat_match_${matchId}`, tin nhắn gửi đi được đồng bộ tức thì giữa các người dùng mà không cần reload trang.
- Đã loại bỏ hoàn toàn cơ chế bot mô phỏng trả lời tự động, chuyển sang nhắn tin thực tế 100%.
- Tự động cuộn xuống tin nhắn mới nhất, hiển thị thời gian gửi, trạng thái đã gửi/nhận.
- Mẫu câu mở lời thông minh (Icebreakers) giúp sinh viên bắt chuyện dễ dàng.

### 3. Hệ Thống Phân Quyền & Quản Lý Cơ Sở Dữ Liệu
- **Màn hình Đăng nhập / Đăng ký chuyên dụng (AuthView)**:
  - Khi chưa đăng nhập, web hiển thị cổng xác thực độc lập, an toàn.
- **Phân loại 2 loại tài khoản**:
  - 🎓 **Người dùng (Sinh viên)**:
    - Tìm kiếm bạn cùng nhóm, quẹt ghép đôi (Swipe to Discover), nhắn tin thời gian thực, tạo Team Hub.
    - Giao diện hoàn toàn sạch sẽ, bảo mật, **không thấy các nút cấu hình Supabase, API keys hay CSDL**.
  - 🛠️ **Nhà phát triển (Developer - Bạn)**:
    - Mã PIN kích hoạt tài khoản Nhà phát triển: `dev2026`.
    - Có huy hiệu `DEV` nổi bật trên thanh điều hướng.
    - Truy cập độc quyền **Bảng Điều Khiển Nhà Phát Triển & Quản Trị CSDL**:
      - Quản lý liên kết Supabase (Project URL & Anon Key).
      - Quản lý danh sách tài khoản: xem toàn bộ thành viên, thăng/hạ quyền (Student ↔ Developer), xóa tài khoản thử nghiệm.
      - Quản lý và xem cấu trúc 4 bảng CSDL cốt lõi (`profiles`, `matches`, `messages`, `reviews`).
      - 1-click Sao chép mã SQL Schema.
- **Bảo Mật Thông Tin Người Dùng**:
  - Mật khẩu mã hóa bảo mật chuẩn Supabase Auth.
  - Người lạ khi chưa match chỉ nhìn thấy thông tin học tập công khai (Tên, Trường, Ngành, GPA, Kỹ năng, Mục tiêu). Số điện thoại và Email cá nhân được bảo vệ quyền riêng tư.
  - Không còn tài khoản demo cài sẵn; nhóm của bạn có thể tự đăng ký tài khoản từ số 0 để vận hành thử nghiệm thực tế.

### 4. Tối Ưu Hiển Thị Responsive Trên Mobile & Desktop
- **Bỏ hoàn toàn khung giả lập điện thoại đóng hộp**: Web hiển thị toàn màn hình, co giãn tự nhiên theo kích thước màn hình người dùng.
- **Trên Desktop**: Giao diện dashboard rộng rãi, thoáng đãng, thanh Navigation bar trên cùng tinh gọn.
- **Trên Mobile (≤ 768px)**:
  - Thanh Bottom Navigation Bar bám sát đáy màn hình chuẩn phong cách ứng dụng hiện đại.
  - Thẻ quẹt Discover co giãn 100% chiều rộng màn hình, nút bấm lớn dễ thao tác bằng ngón tay cái.
  - Khung Chat View tối ưu chiều cao màn hình, thanh nhập tin nhắn cố định ở đáy.
  - Modal bo góc mềm mại, hiển thị dạng bottom-sheet dễ đóng mở.

---

## 🛠 Hướng Dẫn Liên Kết Supabase

### Bước 1: Tạo dự án trên Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và tạo một dự án mới (miễn phí).
2. Vào mục **Project Settings** ➔ **API**, lấy:
   - `Project URL`
   - `anon public key`

### Bước 2: Tạo các bảng Cơ Sở Dữ Liệu
1. Mở file `supabase_schema.sql` có sẵn trong thư mục dự án (hoặc mở modal **Cài đặt Supabase** trên web và bấm **Sao chép toàn bộ SQL**).
2. Vào mục **SQL Editor** trên Supabase Dashboard, tạo New Query, dán đoạn mã SQL vào và bấm **Run**.
3. Toàn bộ các bảng `profiles`, `matches`, `messages`, `reviews`, `teams` và tính năng Supabase Realtime sẽ được khởi tạo hoàn chỉnh.

### Bước 3: Kết nối với Web TeamWeaver
- **Cách 1 (Trực tiếp trên web)**: Nhấn nút **Cấu hình Supabase** ở góc trên thanh điều hướng, dán `Project URL` và `Anon Key` vào và bấm **Lưu & Kết Nối CSDL**.
- **Cách 2 (Qua file môi trường)**: Tạo file `.env` tại thư mục gốc với nội dung:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-public-key
  ```

---

## 💻 Hướng Dẫn Chạy Dự Án

```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi chạy môi trường phát triển
npm run dev

# 3. Đóng gói bản Production
npm run build
```
Mở trình duyệt tại: `http://localhost:5173/`
