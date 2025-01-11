import os
import pandas as pd

base_dir = r"C:\Users\zohai\OneDrive\Documents\Creations\Actual\Spectrum\data"
labels = ['Left Data', 'Right Data', 'Center Data']

texts = []
labels_list = []

# traverse the folders and process files
for label in labels:
    folder_path = os.path.join(base_dir, label)
    print(folder_path)

    if not os.path.exists(folder_path):
        print('continued')
        continue
    
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".txt"):
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
                texts.append(text)
                labels_list.append(label)

df = pd.DataFrame({
    'text': texts,
    'label': labels_list
})

df.to_csv('political_articles2.csv', index=False)

print("Data saved as political_articles.csv")
