from dataclasses import dataclass

@dataclass
class ModelConfig:
    model_name: str = "distilgpt2"  # Daha küçük model, ~1GB VRAM gerektirir
    max_length: int = 1024  # Maksimum sekans uzunluğunu artırdık
    batch_size: int = 1  # Daha düşük batch size
    learning_rate: float = 1e-4
    num_epochs: int = 3
    save_path: str = "model"
    dataset_path: str = "data/templates.json"

config = ModelConfig()