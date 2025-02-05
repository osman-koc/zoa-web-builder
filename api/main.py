from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from generator import WebGenerator
import uvicorn

app = FastAPI(title="Website Generator API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Güvenlik için production'da spesifik origin'leri belirtin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class WebResponse(BaseModel):
    code: str

generator = WebGenerator()

@app.post("/api/generate", response_model=WebResponse)
async def generate_website(request: PromptRequest) -> WebResponse:
    try:
        generated_code = generator.generate(request.prompt)
        return WebResponse(code=generated_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
