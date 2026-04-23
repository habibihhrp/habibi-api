# API Key Management Endpoints

Dokumentasi lengkap untuk fitur API Key pada Habibi API.

## Autentikasi

Semua endpoint API Key memerlukan session cookie yang valid (diperoleh dari login).

## Endpoints

### 1. Get All API Keys
**GET** `/api/apikey`

Mengambil semua API key milik user yang login.

**Response:**
```json
{
  "apiKeys": [
    {
      "id": "cuid",
      "key": "hit-xxxxx",
      "name": "Production Key",
      "requests": 150,
      "limit": 1000,
      "lastUsedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ]
}
```

---

### 2. Create API Key
**POST** `/api/apikey`

Membuat API key baru. Maksimal 10 API key per akun.

**Request Body:**
```json
{
  "name": "My API Key" // Optional, default: "API Key"
}
```

**Response (201 Created):**
```json
{
  "message": "API key created",
  "apiKey": {
    "id": "cuid",
    "key": "hit-xxxxx",
    "name": "My API Key",
    "requests": 0,
    "limit": 1000,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Get Specific API Key
**GET** `/api/apikey/[id]`

Mengambil detail API key tertentu.

**Response:**
```json
{
  "apiKey": {
    "id": "cuid",
    "key": "hit-xxxxx",
    "name": "Production Key",
    "requests": 150,
    "limit": 1000,
    "lastUsedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-10T08:00:00Z"
  }
}
```

---

### 4. Update API Key
**PUT** `/api/apikey/[id]`

Memperbarui detail API key (nama atau limit).

**Request Body:**
```json
{
  "name": "Updated Key Name", // Optional
  "limit": 5000               // Optional, min: 100, max: 100000
}
```

**Response:**
```json
{
  "apiKey": {
    "id": "cuid",
    "key": "hit-xxxxx",
    "name": "Updated Key Name",
    "requests": 150,
    "limit": 5000,
    "lastUsedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-10T08:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Limit harus antara 100 dan 100000"
}
```

---

### 5. Reset API Key Rate Limit
**PATCH** `/api/apikey/[id]`

Me-reset request counter dan lastUsedAt untuk API key.

**Request Body:**
```json
{
  "action": "reset"
}
```

**Response:**
```json
{
  "message": "Rate limit direset",
  "apiKey": {
    "id": "cuid",
    "key": "hit-xxxxx",
    "name": "Production Key",
    "requests": 0,
    "limit": 1000,
    "lastUsedAt": null,
    "createdAt": "2024-01-10T08:00:00Z"
  }
}
```

---

### 6. Delete API Key
**DELETE** `/api/apikey/[id]`

Menghapus API key.

**Response:**
```json
{
  "message": "API key deleted",
  "ok": true
}
```

---

## Rate Limiting

- **Default limit**: 1000 request per hari
- **Daily reset**: Otomatis direset setiap tengah malam (00:00 UTC)
- **Max API keys per akun**: 10
- **Customizable limit**: 100 - 100000 request per hari

## Menggunakan API Key

API key dapat digunakan dengan tiga cara:

### 1. Query Parameter
```
GET /api/v1/weather?city=Jakarta&apikey=hit-xxxxx
```

### 2. Header Authorization
```
Authorization: Bearer hit-xxxxx
```

### 3. Custom Header
```
X-API-Key: hit-xxxxx
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```
User tidak login atau session expired.

### 401 API Key Required
```json
{
  "status": false,
  "message": "API key wajib. Tambahkan ?apikey=KEY_KAMU"
}
```
API key tidak disediakan dalam request.

### 403 Invalid API Key
```json
{
  "status": false,
  "message": "API key tidak valid"
}
```
API key yang diberikan tidak valid atau tidak ditemukan.

### 404 Not Found
```json
{
  "message": "Not found"
}
```
API key dengan id tertentu tidak ditemukan atau tidak milik user.

### 429 Rate Limit Exceeded
```json
{
  "status": false,
  "message": "Limit harian terlampaui (1000 request). Reset pada tengah malam."
}
```
Limit harian sudah terlampaui.

---

## Fitur-Fitur Baru

✅ **Daily Auto Reset** - Rate limit otomatis direset setiap hari
✅ **Customizable Limit** - Setiap API key bisa punya limit berbeda
✅ **PUT/PATCH Endpoints** - Update nama dan limit, atau reset counter
✅ **Konsisten Response Format** - Semua endpoint punya format response yang sama
✅ **Better Validation** - Validasi limit dan API key yang lebih ketat
