# Web Generator API

GPT-2 tabanlı web sitesi HTML kodu üretici API.

## Gereksinimler

- Python 3.8+
- CUDA uyumlu GPU (en az 2GB VRAM)
- CPU modu da desteklenir

## Kurulum

```bash
pip install -r requirements.txt
```

## Kullanım

1. Modeli eğit:
```bash
python train.py
```

2. API sunucusunu başlat:
```bash
python main.py
```

3. Test et:
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a landing page for a coffee shop"}'
```

## API Endpointleri

- `POST /generate` - Metin açıklamadan HTML kodu üretir
- `GET /health` - API durumunu kontrol eder