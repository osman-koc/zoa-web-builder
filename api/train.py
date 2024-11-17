import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, GPT2Config
from datasets import Dataset
import json
from config import config

def train_model():
    # GPU kontrolü
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    if torch.cuda.is_available():
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**2:.0f}MB")
    
    # Model ve tokenizer yükleme
    tokenizer = GPT2Tokenizer.from_pretrained(config.model_name)
    tokenizer.pad_token = tokenizer.eos_token
    
    # Model konfigürasyonunu güncelle
    model_config = GPT2Config.from_pretrained(config.model_name)
    model_config.n_positions = config.max_length  # Pozisyon embedding'lerini artır
    model = GPT2LMHeadModel.from_pretrained(config.model_name, config=model_config).to(device)
    
    # Veri hazırlama
    with open(config.dataset_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Veriyi tokenize et ve uzun sekansları kes
    def preprocess_data(examples):
        texts = [f"Create website: {item['description']}\n{item['html']}" for item in data['templates']]
        encoded = tokenizer(
            texts,
            padding=True,
            truncation=True,
            max_length=config.max_length,
            return_tensors="pt"
        )
        return encoded
    
    dataset = Dataset.from_list([{
        "text": f"Create website: {item['description']}\n{item['html']}"
    } for item in data['templates']])
    
    # Eğitim
    model.train()
    optimizer = torch.optim.AdamW(model.parameters(), lr=config.learning_rate)
    
    for epoch in range(config.num_epochs):
        total_loss = 0
        batch_count = 0
        
        for i in range(0, len(dataset), config.batch_size):
            batch = dataset[i:i + config.batch_size]
            
            # Batch'i tokenize et
            inputs = tokenizer(
                batch['text'],
                padding=True,
                truncation=True,
                max_length=config.max_length,
                return_tensors="pt"
            ).to(device)
            
            # Forward pass
            outputs = model(**inputs, labels=inputs['input_ids'])
            loss = outputs.loss
            
            # Backward pass
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()
            
            total_loss += loss.item()
            batch_count += 1
            
            if batch_count % 10 == 0:
                print(f"Epoch {epoch+1}/{config.num_epochs}, Batch {batch_count}, Loss: {loss.item():.4f}")
        
        avg_loss = total_loss / batch_count
        print(f"Epoch {epoch+1}/{config.num_epochs}, Average Loss: {avg_loss:.4f}")
    
    # Modeli kaydetme
    model.save_pretrained(config.save_path)
    tokenizer.save_pretrained(config.save_path)
    print(f"Model saved to {config.save_path}")

if __name__ == "__main__":
    train_model()