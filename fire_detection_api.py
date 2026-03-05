from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import tensorflow as tf
import keras
from keras.applications.resnet50 import preprocess_input
from collections import deque
import time
import yt_dlp
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. 모델 로드
# 다운로드 폴더의 모델 경로 하드코딩
model_path = r'c:\Users\USER\Downloads\Fastapi_e-gleEye2\Fastapi_e-gleEye\resnet50_padding_model.keras'
model = keras.models.load_model(model_path, custom_objects={'preprocess_input': preprocess_input}, safe_mode=False)

# 상태 관리를 위한 변수 (메모리 유지)
# 서버가 켜져 있는 동안 최근 8회 검사 결과를 저장
history = deque(maxlen=8)
ewma_prob = 0.0

def resize_with_padding(image, target_size=(224, 224)):
    h, w = image.shape[:2]
    ratio = min(target_size[0] / h, target_size[1] / w)
    new_h, new_w = int(h * ratio), int(w * ratio)
    resized = cv2.resize(image, (new_w, new_h))
    pad_h, pad_w = (target_size[0] - new_h) // 2, (target_size[1] - new_w) // 2
    return cv2.copyMakeBorder(resized, pad_h, target_size[0]-new_h-pad_h, pad_w, target_size[1]-new_w-pad_w, cv2.BORDER_CONSTANT, value=[0, 0, 0])

def predict_and_gradcam(img_ready, img_input):
    with tf.GradientTape() as tape:
        x = tf.convert_to_tensor(img_input)
        for layer in model.layers[:3]:
            x = layer(x)
        last_conv_layer_output = x
        tape.watch(last_conv_layer_output)
        for layer in model.layers[3:]:
            x = layer(x)
        preds = x
        top_class_channel = preds[:, 0]
        
    raw_prob = float(preds[0][0])
    
    grads = tape.gradient(top_class_channel, last_conv_layer_output)
    b64_str = ""
    if grads is not None:
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        last_conv_layer_output_squeeze = last_conv_layer_output[0]
        heatmap = last_conv_layer_output_squeeze @ tf.expand_dims(pooled_grads, axis=-1)
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0)
        max_val = tf.math.reduce_max(heatmap)
        if max_val > 0:
            heatmap = heatmap / max_val
        heatmap = heatmap.numpy()

        if len(heatmap.shape) == 2:
            heatmap_resized = cv2.resize(heatmap, (img_ready.shape[1], img_ready.shape[0]))
            heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
            superimposed_img = cv2.addWeighted(img_ready, 0.6, heatmap_colored, 0.4, 0)
            _, buffer = cv2.imencode('.jpg', superimposed_img)
            b64_str = base64.b64encode(buffer).decode('utf-8')
            
    return raw_prob, b64_str

@app.get("/analyze")
async def analyze_frame(video_url: str = Query(..., description="분석할 영상 URL"), 
                        time_param: float = Query(0.0, alias="time"), 
                        playing: bool = Query(True)):
    global ewma_prob
    
    try:
        # 1. 영상 프레임 가져오기 (yt-dlp)
        ydl_opts = {'format': 'best[ext=mp4]', 'quiet': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            actual_url = info.get('url')

        cap = cv2.VideoCapture(actual_url)
        
        # 클라이언트에서 보낸 time에 맞게 프레임 설정
        if time_param > 0:
            cap.set(cv2.CAP_PROP_POS_MSEC, time_param * 1000)
            
        ret, frame = cap.read()
        cap.release()

        if not ret:
            return {"error": "영상을 불러올 수 없습니다."}

        # 2. 민감도 설정
        FIRE_THRESHOLD = 0.20
        EMERGENCY_COUNT = 2
        EMERGENCY_EWMA = 0.30
        SAFE_EXIT_THRESHOLD = 0.05

        # 3. 모델 추론 및 Grad-CAM 생성
        img_ready = resize_with_padding(frame, (224, 224))
        img_input = preprocess_input(np.expand_dims(cv2.cvtColor(img_ready, cv2.COLOR_BGR2RGB), axis=0))
        
        raw_prob, gradcam_b64 = predict_and_gradcam(img_ready, img_input)
        
        # 4. EWMA(지수 이동 평균) 및 상태 관리
        alpha = 0.5 if raw_prob > FIRE_THRESHOLD else 0.2
        ewma_prob = (alpha * raw_prob) + ((1 - alpha) * ewma_prob)
        
        detected = 'fire' if raw_prob > FIRE_THRESHOLD else 'normal' 
        history.append(detected)
        fire_count = history.count('fire')

        # 5. 최종 상태 판정
        if (fire_count >= EMERGENCY_COUNT or ewma_prob > EMERGENCY_EWMA) and raw_prob > SAFE_EXIT_THRESHOLD:
            status = "!!! EMERGENCY: FIRE !!!"
            status_code = 2
        elif fire_count >= 1 or ewma_prob > 0.15:
            status = "WARNING: SCANNING..."
            status_code = 1
        else:
            status = "NORMAL"
            status_code = 0

        return {
            "status": status,
            "status_code": status_code,
            "probability": round(raw_prob, 4),
            "ewma": round(ewma_prob, 4),
            "fire_count": fire_count,
            "timestamp": time.strftime('%H:%M:%S'),
            "history": list(history),
            "gradcam_b64": gradcam_b64
        }
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
