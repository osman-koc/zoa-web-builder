from datasets import load_dataset
import json
import os

def convert_alpaca_to_template():
    # Load the dataset from huggingface
    dataset = load_dataset("ttbui/html_alpaca")
    
    # Read existing templates
    with open('data/templates.json', 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
    
    # Convert alpaca format to our template format
    new_templates = []
    for item in dataset['train']:
        template = {
            "description": item['instruction'] + " " + item['input'] if item['input'] else item['instruction'],
            "html": item['output']
        }
        new_templates.append(template)
    
    # Combine existing and new templates
    existing_data['templates'].extend(new_templates)
    
    # Save the combined dataset
    with open('data/templates.json', 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
    
    print(f"Added {len(new_templates)} new templates to the dataset")

if __name__ == "__main__":
    convert_alpaca_to_template()