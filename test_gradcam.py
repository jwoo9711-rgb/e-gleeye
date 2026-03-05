import cv2
import numpy as np
import tensorflow as tf
import keras
from keras.applications.resnet50 import preprocess_input
import base64

def resize_with_padding(image, target_size=(224, 224)):
    h, w = image.shape[:2]
    ratio = min(target_size[0] / h, target_size[1] / w)
    new_h, new_w = int(h * ratio), int(w * ratio)
    resized = cv2.resize(image, (new_w, new_h))
    pad_h, pad_w = (target_size[0] - new_h) // 2, (target_size[1] - new_w) // 2
    return cv2.copyMakeBorder(resized, pad_h, target_size[0]-new_h-pad_h, pad_w, target_size[1]-new_w-pad_w, cv2.BORDER_CONSTANT, value=[0, 0, 0])

model = keras.models.load_model(r'c:\Users\USER\Downloads\Fastapi_e-gleEye2\Fastapi_e-gleEye\resnet50_padding_model.keras', custom_objects={'preprocess_input': preprocess_input}, safe_mode=False)

frame = np.zeros((720, 1280, 3), dtype=np.uint8)
img_ready = resize_with_padding(frame, (224, 224))
img_input = preprocess_input(np.expand_dims(cv2.cvtColor(img_ready, cv2.COLOR_BGR2RGB), axis=0))

with tf.GradientTape() as tape:
    x = tf.convert_to_tensor(img_input)
    # Forward pass until resnet50
    for layer in model.layers[:3]:
        x = layer(x)
        
    last_conv_layer_output = x
    tape.watch(last_conv_layer_output)
    
    # Forward pass the rest
    for layer in model.layers[3:]:
        x = layer(x)
        
    preds = x
    top_class_channel = preds[:, 0]

grads = tape.gradient(top_class_channel, last_conv_layer_output)
if grads is None:
    print("Gradients are None!")
else:
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ tf.expand_dims(pooled_grads, axis=-1)
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.math.reduce_max(heatmap)
    if max_val > 0:
        heatmap = heatmap / max_val
    heatmap = heatmap.numpy()

    # Ensure heatmap is not a scalar if something fails
    if len(heatmap.shape) == 2:
        heatmap_resized = cv2.resize(heatmap, (img_ready.shape[1], img_ready.shape[0]))
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
        superimposed_img = cv2.addWeighted(img_ready, 0.6, heatmap_colored, 0.4, 0)

        _, buffer = cv2.imencode('.jpg', superimposed_img)
        b64_str = base64.b64encode(buffer).decode('utf-8')
        print("Grad-CAM generation successful. Str length:", len(b64_str))
    else:
        print("Failed to generate heatmap geometry, shape:", heatmap.shape)
