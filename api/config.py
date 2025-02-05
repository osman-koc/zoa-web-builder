from dataclasses import dataclass

@dataclass
class ModelConfig:
    model_name: str = "osmankoc/llama-2-7b-zoa" #"distilgpt2"
    max_length: int = 1024 
    batch_size: int = 4  
    learning_rate: float = 2e-4
    num_epochs: int = 1
    save_path: str = "model"
    dataset_path: str = "data/templates.json"

config = ModelConfig()