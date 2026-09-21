from flask import Flask, request, jsonify
from ultralytics import YOLO
import os

app = Flask(__name__)

model = YOLO("yolov8n.pt")

CATEGORY_MAP = {
    "bottle": "Utensils",
    "cup": "Utensils",
    "bowl": "Utensils",
    "fork": "Utensils",
    "knife": "Utensils",
    "spoon": "Utensils",

    "laptop": "Electronics",
    "cell phone": "Electronics",
    "tv": "Electronics",
    "keyboard": "Electronics",
    "mouse": "Electronics",

    "chair": "Furniture",
    "couch": "Furniture",
    "bed": "Furniture",
    "dining table": "Furniture",

    "banana": "Food",
    "apple": "Food",
    "orange": "Food",
    "carrot": "Food",
    "broccoli": "Food"
}

@app.route("/detect", methods=["POST"])
def detect_items():

    if "image" not in request.files:
        return jsonify({
            "message": "Image is required"
        }), 400

    image = request.files["image"]

    image_path = "temp_image.jpg"
    image.save(image_path)

    results = model(image_path)

    detected_items = []

    for result in results:
        for box in result.boxes:

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            item_name = model.names[class_id]

            # Ignore low confidence objects
            if confidence < 0.50:
                continue

            category = CATEGORY_MAP.get(
                item_name,
                "Other"
            )

            detected_items.append({
                "item_name": item_name,
                "category": category,
                "confidence": round(confidence, 2)
            })

    if os.path.exists(image_path):
        os.remove(image_path)

    return jsonify({
        "total_items": len(detected_items),
        "detected_items": detected_items
    })


if __name__ == "__main__":
    app.run(port=8000, debug=True)