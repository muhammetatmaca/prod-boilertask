# NestJS Gelişmiş Kimlik Doğrulama (Auth) API

Bu proje; NestJS, Prisma ve PostgreSQL kullanılarak oluşturulmuş, kurumsal düzeyde özelliklere sahip modern bir kimlik doğrulama (authentication) boilerplate projesidir.

## 🌟 Özellikler

- **Kimlik Doğrulama**: JWT tabanlı (Access + Refresh Token) yapı ve **Token Rotation** desteği.
- **Rol Tabanlı Yetkilendirme (RBAC)**: `ADMIN` ve `USER` rolleri ile gelişmiş erişim kontrolü.
- **Güvenlik**: 
  - Bcrypt ile güvenli şifre hashleme.
  - **Rate Limiting**: Throttler ile istek sınırlama.
  - **Account Lockout**: 5 kez hatalı girişte hesabı 15 dakika boyunca kilitleme.
- **Bonus Özellikler**:
  - **Email Doğrulama**: Token tabanlı mock doğrulama akışı.
  - **Şifre Sıfırlama**: Güvenli token bazlı şifre yenileme.
  - **Audit Logging (Denetim Kayıtları)**: Giriş, çıkış, yenileme ve kayıt işlemlerinin IP ve User Agent bilgileriyle takibi.
  - **Admin İstatistikleri**: Sistem metrikleri ve son logların görüntülendiği dashboard endpoint'i (`/admin/metrics`).
  - **CI/CD**: GitHub Actions ile otomatik Lint, Build ve Test boru hattı.
- **Veritabanı ve ORM**: Prisma ORM ile snake_case isimlendirme ve UUID birincil anahtarlar.
- **Dokümantasyon**: Swagger UI entegrasyonu (`/api`).
- **Sağlık Kontrolü**: Servis durumunu izlemek için `/health` endpoint'i.

## 🚀 Hızlı Kurulum

### Gereksinimler

- Node.js (v20+)
- Docker ve Docker Compose

### Docker ile Çalıştırma (En Kolay Yol)

Proje klasöründe aşağıdaki komutu çalıştırarak tüm sistemi (API + Veritabanı) ayağa kaldırabilirsiniz:

```bash
docker-compose up -d
```

Bu komut şunları yapar:
1. PostgreSQL veritabanını başlatır.
2. NestJS uygulamasını build eder.
3. Veritabanı migrationlarını uygular ve sunucuyu başlatır.

API şu adreste hazır olacaktır: `http://localhost:3000`
Swagger Dokümantasyonu: `http://localhost:3000/api`

### Yerel Geliştirme (Local Development)

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Ortam değişkenlerini ayarlayın:
   ```bash
   cp .env.example .env.development
   ```

3. Sadece veritabanını başlatın:
   ```bash
   docker-compose up -d postgres
   ```

4. Veritabanını hazırlayın ve Prisma client'ı oluşturun:
   ```bash
   npm run db:setup
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run start:dev
   ```

## 🛠️ API Endpoint'leri

### Kimlik Doğrulama (Auth)
- `POST /auth/register` - Yeni kullanıcı kaydı.
- `POST /auth/verify-email` - Email doğrulama (Token ile).
- `POST /auth/login` - Giriş yap ve tokenları al.
- `POST /auth/refresh` - Yeni access token al (Rotation destekli).
- `POST /auth/logout` - Oturumu kapat ve tokenları geçersiz kıl.
- `POST /auth/forgot-password` - Şifre sıfırlama talebi.
- `POST /auth/reset-password` - Token ile yeni şifre belirleme.
- `GET /auth/me` - Mevcut kullanıcı profilini getir.

### Admin İşlemleri (Sadece Adminler)
- `GET /admin/metrics` - Sistem metrikleri ve son denetim kayıtları.
- `POST /auth/users` - Belirli bir rol ile kullanıcı oluşturma.
- `GET /users` - Tüm kullanıcıları listeleme.

### Sistem
- `GET /health` - Servis sağlık durumu kontrolü.

## 🧪 Testler

```bash
# Birim (Unit) testleri
npm test

# Uçtan uca (E2E) testler
npm run test:e2e
```

## 📂 Yapılandırma

Ortam değişkenleri `.env` dosyaları üzerinden yönetilir:
- `.env.development` - Geliştirme ortamı.
- `.env.test` - Test ortamı.
- `.env.production` - Prodüksiyon şablonu.
