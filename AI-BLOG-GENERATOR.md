# Hướng dẫn triển khai AI Blog Generator — Habit & Self-Improvement

## Tổng quan

Hệ thống tự động viết bài blog về **habits, countdowns, streaks, và self-improvement** bằng Gemini AI:
- **Tự động chọn topic**: AI rà soát bài cũ, tự sinh chủ đề mới không trùng lặp
- **Tạo nội dung** (MDX) bằng Gemini Flash — viết bằng tiếng Anh
- **Tạo ảnh** banner + inline bằng Gemini Flash Image
- Tự động commit và push lên GitHub
- Workflow `pages.yml` hiện tại sẽ tự deploy khi có push vào `main`

### Tính năng chính
- **Không cần file topics.txt** — chỉ cần bấm "Run workflow" là có bài mới
- **Duplicate check** — scan tất cả bài viết hiện có trước khi viết
- **SEO-optimized** — title, summary, tags theo chuẩn SEO
- **Brand voice** — giọng văn Coach + Friend, motivating, practical
- **CTA tự nhiên** — gợi ý tracking habits, streaks, countdowns không aggressive

## Cấu trúc file

```
scripts/ai-blog-generator/
├── generate_post.py      # Script chính (auto-topic + duplicate check)
├── SKILL.md              # Brand voice, content strategy, templates
└── requirements.txt      # Python dependencies

.github/workflows/
└── generate-blog-post.yml  # GitHub Action workflow
```

## Bước 1: Lấy Gemini API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/apikey)
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"** → Copy API key (dạng `AIza...`)

> **Lưu ý**: Gemini API miễn phí với giới hạn. Xem chi tiết tại [Gemini API Pricing](https://ai.google.dev/pricing)

## Bước 2: Thêm Secret vào GitHub Repository

1. Vào GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. **Name**: `GEMINI_API_KEY` — **Secret**: paste API key
4. Click **"Add secret"**

## Bước 3: Kiểm tra Workflow Permissions

1. Vào GitHub repo → **Settings** → **Actions** → **General**
2. Phần **"Workflow permissions"** → chọn **"Read and write permissions"**
3. Click **"Save"**

## Bước 4: Push code lên GitHub

```bash
git add scripts/ai-blog-generator/ .github/workflows/generate-blog-post.yml
git commit -m "feat: add AI blog generator with GitHub Actions"
git push origin main
```

## Bước 5: Chạy thử (Manual)

1. Vào GitHub repo → tab **"Actions"**
2. Sidebar trái → chọn **"Generate AI Blog Post — Habit & Self-Improvement"**
3. Click **"Run workflow"**
4. Có 2 cách:
   - **Để trống topic** → AI tự động chọn chủ đề mới (không trùng bài cũ)
   - **Nhập topic cụ thể**, ví dụ: `How to build a morning routine in 30 days`
5. Click **"Run workflow"** (nút xanh)
6. Đợi workflow chạy xong (~2-5 phút)

## Bước 6: Cấu hình chạy tự động (Schedule)

Mặc định workflow chạy tự động **mỗi ngày lúc 6h sáng UTC+7 (23h UTC đêm trước)**.

Sửa cron trong `.github/workflows/generate-blog-post.yml`:

```yaml
schedule:
  - cron: '0 23 * * *'  # Mỗi ngày, 6h sáng UTC+7
```

| Cron | Mô tả |
|------|--------|
| `0 23 * * *` | Mỗi ngày, 6h sáng UTC+7 |
| `0 23 * * 1` | Thứ 2 hàng tuần |
| `0 23 * * 1,4` | Thứ 2 và thứ 5 |

### Chế độ tự động

Khi chạy theo schedule hoặc không nhập topic, AI sẽ:
1. **Scan** tất cả bài viết hiện có trong `data/blog/`
2. **Phân tích** title, tags, summary — check trùng lặp trên 3 cấp (title, keyword, angle)
3. **Tự sinh** chủ đề mới không trùng lặp
4. **Chọn content type** phù hợp (how-to, listicle, myth-busting, 30-day-challenge, life-reset, what-happens-after, beginner's guide, relationship)

## Bước 7: Tùy chỉnh phong cách viết (SKILL.md)

File `scripts/ai-blog-generator/SKILL.md` chứa toàn bộ chiến lược nội dung:

- **Brand Voice**: The Coach + The Friend — motivating, practical, relatable
- **Content Formula**: 40% Self-improvement, 20% Psychology, 20% Practical, 10% Storytelling, 10% Tracking
- **CTA Strategy**: Soft mentions of tracking, streaks, countdowns — max 3 per article
- **Templates**: 8 loại (How-To, What Happens After X Days, Listicle, 30 Day Challenge, Life Reset, Myth Busting, Beginner's Guide, Relationship)
- **SEO**: keyword placement, title length, summary format
- **Tags**: habits, self-improvement, motivation, streak, days-since, countdown, goal-tracking, productivity, etc.
- **Duplicate Prevention**: 4-step process kiểm tra trùng lặp trước khi viết

## Output

Mỗi lần chạy sẽ tạo:

```
data/blog/<slug>.mdx                        # Bài viết MDX
public/static/images/<slug>/banner.jpg       # Ảnh thumbnail (1:1)
public/static/images/<slug>/inline1.jpg      # Ảnh minh họa 1 (16:9)
public/static/images/<slug>/inline2.jpg      # Ảnh minh họa 2 (16:9)
```

## Xử lý lỗi

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| `GEMINI_API_KEY not found` | Chưa thêm secret | Xem Bước 2 |
| `Permission denied` khi push | Workflow permissions | Xem Bước 3 |
| `Image generation failed` | Gemini safety filter | Sửa image prompt hoặc chạy lại |
| `Failed to parse JSON` | Gemini response lỗi format | Chạy lại |
| Workflow timeout (>20 phút) | API quá chậm | Kiểm tra Gemini API status |

## Lưu ý

- Gemini free tier có rate limit — không nên chạy quá 5 lần/ngày
- Ảnh do AI tạo có thể không hoàn hảo — review trước khi merge nếu cần
- Script có retry logic (3 lần, exponential backoff) cho API calls
- Slug trùng sẽ tự động append ngày (VD: `my-post-20260319`)
