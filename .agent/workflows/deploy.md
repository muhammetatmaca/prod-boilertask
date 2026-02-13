---
description: VPS'e deploy etme adimlari (muhammetatmaca.com.tr)
---

# VPS Deployment Rehberi

## Onkoşullar
- Ubuntu 22.04+ VPS
- SSH erişimi
- Domain (muhammetatmaca.com.tr) DNS A kaydı VPS IP adresine yönlendirilmiş olmalı

---

## 1. VPS'e Bağlan
```bash
ssh root@VPS_IP_ADRESI
```

## 2. Gerekli Yazılımları Kur
```bash
# Sistem güncelle
apt update && apt upgrade -y

# Docker kur
curl -fsSL https://get.docker.com | sh

# Docker Compose kur
apt install docker-compose-plugin -y

# Git kur
apt install git -y
```

## 3. Projeyi VPS'e Gönder

### Seçenek A: Git ile (önerilen)
```bash
# VPS'te
cd /opt
git clone https://github.com/KULLANICI/boilertask.git
cd boilertask
```

### Seçenek B: SCP ile (git kullanmıyorsan)
```bash
# KENDI BILGISAYARINDA çalıştır:
scp -r C:\Users\muham\Documents\boilertask root@VPS_IP:/opt/boilertask
```

## 4. Production .env Dosyasını Oluştur
```bash
cd /opt/boilertask

# Örnek dosyayı kopyala
cp .env.prod.example .env

# Güçlü şifreler oluştur ve düzenle
nano .env
```

Şifreleri oluşturmak için:
```bash
# Güçlü şifre üret
openssl rand -base64 48
```

## 5. İlk SSL Sertifikası Al (Let's Encrypt)

İlk seferde SSL olmadan başlat, sertifika al, sonra SSL ile yeniden başlat:

```bash
# Geçici nginx config (SSL'siz) oluştur
mkdir -p nginx/ssl

# Geçici olarak sadece HTTP ile başlat
# nginx.conf'taki HTTPS bloğunu geçici olarak kaldır
# veya aşağıdaki komutu kullan:

# 1) Servisleri başlat (nginx hariç)
docker compose -f docker-compose.prod.yml up -d postgres backend ai-service ui

# 2) Certbot ile sertifika al
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email senin@email.com \
  --agree-tos \
  --no-eff-email \
  -d muhammetatmaca.com.tr \
  -d www.muhammetatmaca.com.tr

# 3) Şimdi Nginx'i de başlat
docker compose -f docker-compose.prod.yml up -d nginx
```

## 6. Tüm Servisleri Başlat
```bash
cd /opt/boilertask
docker compose -f docker-compose.prod.yml up -d --build
```

## 7. Durumu Kontrol Et
```bash
# Tüm containerları gör
docker compose -f docker-compose.prod.yml ps

# Logları izle
docker compose -f docker-compose.prod.yml logs -f

# Tek bir servisin logunu izle
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f ai-service
docker compose -f docker-compose.prod.yml logs -f nginx
```

## 8. Güncelleme Yapmak İçin
```bash
cd /opt/boilertask
git pull  # veya SCP ile dosyaları güncelle
docker compose -f docker-compose.prod.yml up -d --build
```

## 9. Durdurma
```bash
docker compose -f docker-compose.prod.yml down
```

---

## Mimari
```
İnternet → muhammetatmaca.com.tr
            ↓
        Nginx (SSL/443)
            ├── /         → React UI (static)
            ├── /api/*    → NestJS Backend (:3000)
            └── /ai/*     → FastAPI AI Service (:8000)
            ↓
        PostgreSQL (:5432)
```

## Dosya Yapısı
```
boilertask/
├── docker-compose.prod.yml    ← Production compose
├── .env                       ← Production secrets (gitignore!)
├── .env.prod.example          ← Örnek env dosyası
├── nginx/
│   └── nginx.conf             ← Reverse proxy config
├── Dockerfile                 ← NestJS backend
├── ui/
│   ├── Dockerfile             ← React UI
│   └── nginx-spa.conf         ← SPA routing
└── ai-service/
    └── Dockerfile             ← Python AI service
```
