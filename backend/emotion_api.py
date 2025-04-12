import pandas as pd
import re
from transformers import pipeline
import torch
from transformers import BertTokenizer
from sklearn.model_selection import train_test_split
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.metrics import classification_report
import numpy as np
from transformers import BertTokenizer, BertForSequenceClassification
import torch

# Load dataset
file_path = "training.1600000.processed.noemoticon.csv"
columns = ["sentiment", "id", "date", "query", "user", "text"]
df = pd.read_csv(file_path, encoding="latin-1", names=columns)

# Keep only relevant columns
df = df[["sentiment", "text"]]
 
# Convert sentiment labels (0 → Negative, 4 → Positive)
df["sentiment"] = df["sentiment"].replace({0: "negative", 4: "positive"})

# Function to clean text
def clean_text(text):
    text = re.sub(r"http\S+|www\S+", "", text)  # Remove URLs
    text = re.sub(r"@\w+", "", text)  # Remove mentions
    text = re.sub(r"[^A-Za-z0-9(),!?\'\`]", " ", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text

# Apply text cleaning
df["text"] = df["text"].apply(clean_text)

# Sample preview
df.head()

# Load the GoEmotions model for emotion classification
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

# Function to assign emotions
def assign_emotion(text):
    try:
        prediction = emotion_classifier(text)[0][0]  # Get top predicted emotion
        return prediction["label"]
    except:
        return "neutral"  # Default to neutral in case of an error

# Apply emotion labeling to a subset (for speed)
df_sample = df.sample(10000, random_state=42)  # Using 10K tweets to avoid long processing time
df_sample["emotion"] = df_sample["text"].apply(assign_emotion)

# Display labeled dataset
df_sample.head()
# Load BERT tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Encode dataset
def tokenize_text(text):
    return tokenizer(text, padding="max_length", truncation=True, max_length=128, return_tensors="pt")

# Tokenize dataset
df_sample["tokens"] = df_sample["text"].apply(tokenize_text)

# Split into train/test
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df_sample["tokens"], df_sample["emotion"], test_size=0.2, random_state=42
)

# Convert emotion labels to numeric values
label_map = {label: i for i, label in enumerate(df_sample["emotion"].unique())}
train_labels = train_labels.map(label_map)
val_labels = val_labels.map(label_map)

# Custom PyTorch dataset
class EmotionDataset(Dataset):
    def __init__(self, texts, labels):
        self.texts = list(texts)
        self.labels = list(labels)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            "input_ids": self.texts[idx]["input_ids"].squeeze(),
            "attention_mask": self.texts[idx]["attention_mask"].squeeze(),
            "labels": torch.tensor(self.labels[idx], dtype=torch.long),
        }

# Create dataset objects
train_dataset = EmotionDataset(train_texts, train_labels)
val_dataset = EmotionDataset(val_texts, val_labels)

# Load BERT model
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(label_map))

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=1,
)

# Trainer setup
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# Train the model
trainer.train()

# Get predictions on the validation set
preds = trainer.predict(val_dataset)
pred_labels = np.argmax(preds.predictions, axis=1)

# Print classification report
print(classification_report(val_labels, pred_labels, target_names=label_map.keys()))

model.save_pretrained("./fine_tuned_bert_emotion")
tokenizer.save_pretrained("./fine_tuned_bert_emotion")

# Load the fine-tuned model and tokenizer
tokenizer = BertTokenizer.from_pretrained("./fine_tuned_bert_emotion")
model = BertForSequenceClassification.from_pretrained("./fine_tuned_bert_emotion")
model.eval()

# Move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def predict_emotion(text):
    tokens = tokenizer(text, padding="max_length", truncation=True, max_length=128, return_tensors="pt")
    tokens = {key: value.to(device) for key, value in tokens.items()}  # Move tokens to same device

    with torch.no_grad():
        output = model(**tokens)

    predicted_class = torch.argmax(output.logits, dim=1).item()
    return list(label_map.keys())[predicted_class]

# Example test cases
test_texts = ["I am so excited about the trip!", "This is the worst day ever!"] #user input
for text in test_texts:
    print(f"Text: {text} --> Emotion: {predict_emotion(text)}")