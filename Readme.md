# Pneumonia Detection Using Chest X-Ray Images with a Custom CNN 🩺🧠

Welcome! This documentation explains the **Pneumonia-Detection.ipynb** notebook—a complete pipeline for Pneumonia detection from chest X-ray images using a custom-built Convolutional Neural Network (CNN) in PyTorch. This solution is fully open, trained from scratch, and designed for reproducibility, clarity, and adaptation in real-world healthcare settings.

---

## 🏁 What Does This Project Do?

- **Automates** pneumonia detection in chest X-ray images.
- Uses a **custom CNN** (no pre-trained models!) for image classification.
- Provides a full, ready-to-use, and modifiable pipeline: from dataset setup to model training, testing, and performance visualization.
- Aims for **clinical relevance** and **deployability** in real-world hospitals.

---
## Used dataset URL
- https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
---
## 🗂️ Main Steps in the Pipeline

| Stage                      | Description                                                    |
|----------------------------|----------------------------------------------------------------|
| Data Loading               | Download & organize chest X-ray datasets                       |
| Data Preprocessing         | Resize, normalize, and augment training images                 |
| Model Architecture         | Define and initialize a custom CNN                             |
| Training                   | Train the model with weighted loss and data augmentation       |
| Evaluation                 | Test, classify, and visualize results (accuracy, confusion matrix, ROC/PR curves) |
| Saving & Loading Models    | Save trained weights for future use                            |

---

## 🎯 Quick Start: How to Use This Notebook

### 1. **Install Dependencies**

The notebook installs all necessary packages automatically.
```python
pip install pandas numpy torch torchvision scikit-learn seaborn matplotlib
```

> 💡 **Tip:** If you're running locally, ensure you have [PyTorch](https://pytorch.org/) installed with the right CUDA version for GPU support.

---

### 2. **Download the Dataset**

The notebook provides Kaggle CLI commands for dataset download. For the **Chest X-ray Pneumonia dataset**, you need a `kaggle.json` API key.

```bash
!mkdir -p ~/.kaggle
!cp kaggle.json ~/.kaggle/
!chmod 600 ~/.kaggle/kaggle.json
!kaggle datasets download -d paultimothymooney/chest-xray-pneumonia
!unzip -q chest-xray-pneumonia.zip -d .
```

**Dataset Structure:**
```
chest_xray/
    train/
        NORMAL/
        PNEUMONIA/
    val/
        NORMAL/
        PNEUMONIA/
    test/
        NORMAL/
        PNEUMONIA/
```

---

### 3. **Prepare the Data**

#### Training and Validation Data Loaders

- Images are resized to `224x224`
- Training images have **augmentation**: random rotation, flipping, brightness/contrast jitter, and random cropping.
- Validation & test images are only resized and normalized.

```python
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomRotation(15),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

train_loader = DataLoader(datasets.ImageFolder('chest_xray/train', transform=train_transform), batch_size=32, shuffle=True)
val_loader = DataLoader(datasets.ImageFolder('chest_xray/val', transform=test_transform), batch_size=32, shuffle=False)
test_loader = DataLoader(datasets.ImageFolder('chest_xray/test', transform=test_transform), batch_size=32, shuffle=False)
```

---

### 4. **Define the Custom CNN Model**

A balanced, efficient architecture (three convolutional blocks with BatchNorm, ReLU, MaxPool, followed by dense layers and dropout):

```python
import torch.nn as nn

class MedicalCNN(nn.Module):
    def __init__(self):
        super(MedicalCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 28 * 28, 128), nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 1)  # Logits for binary classification
        )

    def forward(self, x):
        return self.classifier(self.features(x))

model = MedicalCNN()
```

---

### 5. **Train the Model**

- **Loss:** `BCEWithLogitsLoss`, with class weighting to address imbalance
- **Optimizer:** Adam
- **Scheduler:** Option to reduce LR on plateau
- **Epochs:** 15–25

```python
import torch.optim as optim

criterion = nn.BCEWithLogitsLoss(pos_weight=torch.tensor([0.7]).to(device))
optimizer = optim.Adam(model.parameters(), lr=0.001)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=3, factor=0.5)

for epoch in range(25):
    model.train()
    train_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels.float().unsqueeze(1))
        loss.backward()
        optimizer.step()
        train_loss += loss.item()
    print(f"Epoch {epoch+1} | Loss: {train_loss/len(train_loader):.4f}")
```

---

### 6. **Save and Restore Model Weights**

```python
torch.save(model.state_dict(), "pneumoniaDetectorModelv2.pth")
# ...
model.load_state_dict(torch.load("pneumoniaDetectorModelv2.pth", map_location=device, weights_only=True))
model.eval()
```

---

### 7. **Evaluate on Test Data**

- **Accuracy**, **Precision**, **Recall**, **F1-score**
- **Confusion Matrix** (with heatmap)
- **ROC** and **Precision-Recall** curves

```python
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score, roc_curve, auc, precision_recall_curve, average_precision_score
import seaborn as sns
import matplotlib.pyplot as plt

model.eval()
y_true, y_pred, y_probs = [], [], []

with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(device)
        outputs = torch.sigmoid(model(images))
        y_probs.extend(outputs.cpu().numpy().reshape(-1))
        preds = (outputs > 0.5).float().cpu()
        y_true.extend(labels.tolist())
        y_pred.extend(preds.reshape(-1).tolist())

accuracy = accuracy_score(y_true, y_pred)
print(f"Test Accuracy: {accuracy * 100:.2f}%")
print(classification_report(y_true, y_pred, target_names=['Normal', 'Pneumonia']))

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Normal', 'Pneumonia'], yticklabels=['Normal', 'Pneumonia'])
plt.title('Confusion Matrix')
plt.show()

# ROC and PR curves
fpr, tpr, _ = roc_curve(y_true, y_probs)
roc_auc = auc(fpr, tpr)
plt.plot(fpr, tpr, label=f'ROC curve (area = {roc_auc:.2f})')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()
```

---

## 🔬 Project Pipeline Overview

```
flowchart TD
    A[Download Dataset] ==> B[Data Preprocessing]
    B ==> C[Data Augmentation (Training)]
    C ==> D[Model Definition]
    D ==> E[Model Training]
    E ==> F[Validation]
    F ==> G[Testing]
    G ==> H[Metric Calculation & Visualization]
    H ==> I[Model Saving/Loading]
```

---

## 📊 Example Results

| Metric            | Value (Example)        |
|-------------------|-----------------------|
| Test Accuracy     | 85.10%                |
| Precision         | 0.99 (Normal), 0.71 (Pneumonia) |
| Recall            | 0.31 (Normal), 1.00 (Pneumonia) |
| F1-Score          | 0.47 (Normal), 0.83 (Pneumonia) |
| ROC AUC           | 0.91                   |
| PR Curve (AP)     | 0.91                   |

**Visualizations:**  
- Confusion matrix heatmap  
- ROC curve and Precision-Recall curve

---

## 🚦 Frequently Asked Questions

**Q: What hardware do I need?**  
A: Basic GPU (e.g., Google Colab, mid-range NVIDIA GPU) is recommended for training. CPU is sufficient for inference.

**Q: Can I use my own X-ray dataset?**  
A: Yes! Just organize your data in subfolders by class and point the `ImageFolder` loader to your directory.

**Q: Is this suitable for clinical use?**  
A: This is a prototype for research and should not replace a radiologist. Clinical deployment requires regulatory validation.

---

## 🛠️ Tips for Adapting or Extending

- **Add Explainability:** Integrate Grad-CAM for interpretable heatmaps.
- **Multi-class Tasks:** Extend for more diseases by adjusting the output layer and class labels.
- **Data Diversity:** Use more datasets and balance classes for robust training.
- **Deploy:** Use `torchscript` or ONNX to export the model for clinical integration.

---

## ⚠️ Limitations

- Binary classification (Normal / Pneumonia) only.
- Performance depends on image quality and dataset diversity.
- Not a substitute for expert clinical interpretation.

---

## 💡 Key Takeaways

```card
{
    "title": "Summary and Best Practices",
    "content": "This notebook delivers an end-to-end, reproducible deep learning pipeline for pneumonia detection using a custom CNN. Always validate with clinical experts before deployment."
}
```

---

## 📝 Citation

If you use or modify this notebook, please cite or acknowledge as:

> Pneumonia Detection using Chest X-Ray Images with Custom CNN  
> https://github.com/your-repo/pneumonia-detection

---

## 👏 Contributing & Feedback

We welcome feedback, issues, and contributions!  
Feel free to fork the repo, open pull requests, or raise issues.

---

**Ready to save lives with AI? Run the notebook, plug in your data, and get started! 🚀**
