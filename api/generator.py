import torch
from transformers import AutoTokenizer, AutoModelForCausalLM #GPT2LMHeadModel, GPT2Tokenizer
from config import config

class WebGenerator:
    def __init__(self):
        #self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(config.save_path)
        self.model = AutoModelForCausalLM.from_pretrained(config.save_path)#.to(self.device)
        
    def generate(self, prompt: str) -> str:
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")#.to(self.device)
        
        # Daha iyi generation parametreleri
        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                max_length=config.max_length,
                num_return_sequences=1,
                temperature=0.9,  # Daha yaratıcı çıktılar
                top_p=0.95,
                repetition_penalty=1.2,  # Tekrarları azalt
                no_repeat_ngram_size=3,  # 3-gram tekrarını engelle
                pad_token_id=self.tokenizer.eos_token_id,
                early_stopping=True
            )
        
        generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)
        
        return self._clean_output(generated_text)
        
    def _clean_output(self, code: str) -> str:
        # Temel HTML yapısını kontrol et ve düzelt
        if not code.startswith("<!DOCTYPE html>"):
            code = f"""<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Generated Website</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    {code}
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                </body>
                </html>"""
        
        # Gereksiz açıklamaları temizle
        code = code.split("<!--")[0].strip()
        
        # Bootstrap JS kontrolü
        # if "bootstrap.bundle.min.js" not in code:
        #     code = code.replace('</body>', 
        #         '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>\n</body>')
        
        return code
