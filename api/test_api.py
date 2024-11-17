import requests
import json

def test_generation():
    test_prompts = [
        "Create a modern e-commerce website for a fashion brand",
        "Create a landing page for a mobile app",
        "Create a portfolio website for a graphic designer"
    ]

    print("Testing website generation...\n")

    for prompt in test_prompts:
        print(f"Testing prompt: '{prompt}'")
        
        try:
            response = requests.post(
                'http://localhost:3000/generate',
                json={"prompt": prompt}
            )
            
            if response.status_code != 200:
                print(f"Error: HTTP {response.status_code}")
                print(f"Details: {response.text}\n")
                continue
                
            data = response.json()
            html = data["code"]
            
            print(f"Generated HTML length: {len(html)}")
            print(f"Valid HTML structure: {'<!DOCTYPE html>' in html and '</html>' in html}")
            print("Generation successful!\n")
            
        except Exception as e:
            print(f"Failed to test prompt: {str(e)}\n")

if __name__ == "__main__":
    test_generation()