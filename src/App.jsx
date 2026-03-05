import { useState, useEffect, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player';

// 더미 카메라 초기 데이터
const defaultActiveCam = { id: 'CAM-05', name: '메인 창고 입고 A라인', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw', isOffline: false };

const initialGridCams = [
    { id: 'CAM-01', name: '정문 이중잠금', time: '14:52:08', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuO6yejcR_OvplKhCtYeqc6dqtG-xGygg5VL87SGSoo4ygwpNUmtr1RsrD0WbjoHTqUGMhM8iFDAW5R4LARUFPz-1LQ2OuwN7lpJEiGJi_9V9SXx0v01fFaec82hvLzuaWyTE4BddkZWBNeBK0bc_9kQ2ghTizRyVvWJ7Eyuk1JDXVEgonPR7SkosRwRogF0cdTd4IHtCvEnc3DPZrfPr5FSCgB00t99ebQr2icGO4RozZjRrDjtmZOLLVIzqnR5Y3TUbPBSYGXi4', isOffline: false },
    { id: 'CAM-02', name: '물류 데스크', time: '14:52:07', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABmKNqT0wgVs66Djrmja8pp63xOWxTa9zOZc-y6F7q-UgceGlK0aYl13MnjSOTBqm9svvB4WF9R-Bu0fD19B0t2VcU4RTIMtPPv0WaGdpiRHGM5yo1hXwute0X2bE8kOvLIKvnpCaubPX9B2ad421PK8pmMkBxzaDZ6DjmpcVbHt2GWAdGz46DT8T0Nsl11FMUXjsps3pRD6fj84gjab8dwVl-XuapJpUuGu1ruq5Ei8JWa8d7iHVqvYWClQlX-CZhLzcNnWDIsKM', isOffline: false },
    { id: 'CAM-03', name: '외부 주차장', time: '14:52:09', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8knZ0WAd1E20p6l4DbFzBqoqPo8ECLyQAERSrfiNUW5t9rAURFem2XspR8rGHzX65la00Uh_lNKAHXtLgo68NmAQ6AhO1PaHZNAulG3jw3RQl7BqrEkIhuEsN6ttmu9gi-SWinXpGpr0zXsXRmV2dTD9VCMBFCiRyFuSDz11phAYjdRmfoCLQIR5FQOW8MLWYqy2xg71b_-NxAX0Wk43yFonWgeEFlxVgYdfta498nQKmAZjrI08zSjU9fqZMVQh52zkZjjk8aw', isOffline: false },
    { id: 'CAM-04', name: '데이터 서버실', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXTuQ15QCfoHzR6qe_TUqRTR9P2W3_6J5lbDE1ZrGxtoY9OM7q7GpLDQtLbzRJmovz8V5jWBj38OuY2B4qbtpJSbYMAkWKEOXrvH7TvndO5v5XeBp69CqSWZT22BQ8cvv3MlY4cDCW8N9rEAU3PxbbHMxuAdAMYMApp6GeXp23gFMk1F5fktFuyBZcGN7pb3_EuNMRJYDJAYbG1J_Y9PnltLSS0WmB_5yoQZ5PUezcWNDelEJIq4612npsSFpgpo7yEGOEhLBGIUM', isOffline: false },
    { id: 'CAM-06', name: '직원 휴게실', time: '14:52:05', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy5JH2olA84oezMtWcRQwG1x1noYAJQEX07QG9LVazkk-xd9wvgGGPEC6dJtq2SsLUvsMqbbk_RExhequCBJ5b_eF-Q76o6RVPgqagotFhh17ePyJKWWpK1PHRhWhz7XAh0c6jVgPGUQpBbCIInp6_23Cltn5LxFo1C2xAX-J_f2iT-d6IPdR4lxQFOq5xyk2gRaZ-9VE5GWM_zWE6QagYytHX4H8kjzKbJ9b5D12cTrvYx2Ny-34Yk7KwEbU7ziZryF9E447nnoI', isOffline: false },
    { id: 'CAM-07', name: '3층 복도 B', time: '14:52:04', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZR4h0i7Ie70UVhA9JEU4Zu0W3ES5P4ejblahA4TfIxZmEI0jVJR0BmgLhHcUop03waPAExuiLkAfrM9g5Yt_6NZqAuYMl7FjWLr0d6wpA1nXfCUVlkYwUVMQoVmSbObQAFsNyS69zo-hviYvk1PcH-BXtx72exGt77mQaacXPXAy0vE1IZBnlERSiT40CY46YYpnu6Jm2-SfmrogNyU0PFfb4NIgM8IoewgAJjNIhtXuu3ZDhGvce0Jxd3KFxtRTzn-wAc_O-OFA', isOffline: false },
    { id: 'CAM-08', name: '창고 적재함 (오프라인)', time: '14:52:04', src: '', isOffline: true },
];

const App = () => {
    const [isDark, setIsDark] = useState(false);
    const [activeCam, setActiveCam] = useState(defaultActiveCam);
    const [clockTime, setClockTime] = useState(new Date()); // ✅ BUG FIX: 'currentTime' → 'clockTime' (변수명 충돌 해결)
    const [gridCams, setGridCams] = useState(initialGridCams);

    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [toastMessages, setToastMessages] = useState([]);

    const [isAiRunning, setIsAiRunning] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [aiData, setAiData] = useState({
        probability: 0,
        ewma: 0,
        fireCount: 0,
        status: 'NORMAL',
        status_code: 0,
        history: [],
        gradcam_b64: ''
    });

    const aiIntervalRef = useRef(null);
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // ✅ BUG FIX: isPlaying을 ref로도 관리하여 setInterval 클로저 문제 해결
    // setInterval 콜백은 생성 시점의 isPlaying 값만 캡처(클로저)하므로
    // ref를 통해 항상 최신 값을 읽을 수 있게 함
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // youtubeUrl도 동일한 이유로 ref로 관리
    const youtubeUrlRef = useRef(youtubeUrl);
    useEffect(() => {
        youtubeUrlRef.current = youtubeUrl;
    }, [youtubeUrl]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // 시계 1초마다 업데이트
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setClockTime(new Date()); // ✅ BUG FIX: setCurrentTime → setClockTime
        }, 1000);
        return () => clearInterval(timeInterval);
    }, []);

    const handleCamSwap = (clickedCam) => {
        setActiveCam(clickedCam);
    };

    const handleEmergencySwap = () => {
        const targetId = 'CAM-08';
        const targetIndex = gridCams.findIndex(cam => cam.id === targetId);
        if (targetIndex !== -1) {
            const targetCam = gridCams[targetIndex];
            const updatedAlertCam = {
                ...targetCam,
                isOffline: false,
                name: '창고 적재함 (경보 발생)',
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw'
            };
            const newGridCams = [...gridCams];
            newGridCams[targetIndex] = updatedAlertCam;
            setGridCams(newGridCams);
            setActiveCam(updatedAlertCam);
        }
        setShowModal(false);
        setShowToast(false);
    };

    const API_ENDPOINT = "http://localhost:8000/analyze";

    // ✅ BUG FIX: useCallback + ref 사용으로 클로저 문제 완전 해결
    // setInterval에 등록된 함수가 항상 최신 상태값을 참조하도록 함
    const fetchAiData = useCallback(async () => {
        const url = youtubeUrlRef.current; // ✅ ref로 최신 URL 참조
        if (!url.trim()) return;

        // ✅ BUG FIX: 변수명을 playerCurrentTime으로 변경하여 clockTime 상태와 충돌 방지
        let playerCurrentTime = 0;
        let playingState = isPlayingRef.current; // ✅ ref로 최신 재생 상태 참조

        if (playerRef.current) {
            playerCurrentTime = playerRef.current.getCurrentTime() || 0;
        }

        try {
            const res = await fetch(
                `${API_ENDPOINT}?video_url=${encodeURIComponent(url)}&time=${playerCurrentTime}&playing=${playingState}`
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data && data.status) {
                const probability = parseFloat(data.probability || 0);
                const confidencePercent = Math.round(probability * 100);
                const backendStatus = data.status;

                setAiData({
                    probability: confidencePercent,
                    ewma: Math.round(parseFloat(data.ewma || 0) * 100),
                    fireCount: data.fire_count || 0,
                    status: backendStatus,
                    status_code: data.status_code || 0,
                    timestamp: data.timestamp || new Date().toLocaleTimeString(),
                    history: data.history || [],
                    gradcam_b64: data.gradcam_b64 || '' // ✅ Grad-CAM 이미지 저장
                });

                let newStatus = 'normal';

                if (backendStatus.includes('EMERGENCY') || data.status_code >= 2 || probability >= 0.70) {
                    newStatus = 'danger';
                    setShowToast(true);
                    setToastMessages(prev => {
                        if (prev.length > 0 && prev[0].title.includes('AI 화재 감지') && prev[0].data_prob === confidencePercent) {
                            return prev;
                        }
                        return [{
                            id: Date.now().toString(),
                            camId: 'CAM-08',
                            title: '경보: AI 화재 감지!',
                            desc: `Python 모델이 화재를 감지했습니다 (${confidencePercent}%)`,
                            icon: 'local_fire_department',
                            iconColor: 'bg-red-500 text-white',
                            data_prob: confidencePercent
                        }, ...prev];
                    });
                } else if (backendStatus.includes('WARNING') || data.status_code === 1 || probability >= 0.40) {
                    newStatus = 'warning';
                    setToastMessages(prev => {
                        if (prev.length > 0 && prev[0].title.includes('연기 또는 열기 감지') && prev[0].data_prob === confidencePercent) {
                            return prev;
                        }
                        return [{
                            id: Date.now().toString(),
                            camId: 'CAM-08',
                            title: '주의: 연기 또는 열기 감지 (경고)',
                            desc: `화재 가능성이 있습니다 (${confidencePercent}%)`,
                            icon: 'warning',
                            iconColor: 'bg-warning text-white',
                            data_prob: confidencePercent
                        }, ...prev];
                    });
                } else {
                    newStatus = 'normal';
                    setShowToast(false);
                }

                setActiveCam(prev => ({ ...prev, status: newStatus }));
                setGridCams(prevGrid => prevGrid.map(cam =>
                    cam.isYoutube ? { ...cam, status: newStatus } : cam
                ));
            }
        } catch (error) {
            console.error("Python API Error:", error);
        }
    }, []); // ✅ 의존성 배열 비움 - ref를 통해 최신값 접근하므로 재생성 불필요

    const toggleAiAnalysis = () => {
        if (!youtubeUrl.trim()) {
            alert("분석할 유튜브 링크를 먼저 입력해주세요!");
            return;
        }

        if (isAiRunning) {
            clearInterval(aiIntervalRef.current);
            setIsAiRunning(false);
            setShowToast(false);
            setActiveCam(prev => ({ ...prev, status: 'normal' }));
        } else {
            setIsAiRunning(true);

            const targetCamId = "CAM-08";
            const updatedCam8 = {
                ...gridCams.find(c => c.id === targetCamId),
                name: '유튜브 실시간 분석',
                isOffline: false,
                status: 'normal',
                isYoutube: true,
                youtubeUrl: youtubeUrl
            };

            setGridCams(prevGrid => prevGrid.map(c => c.id === targetCamId ? updatedCam8 : c));
            setActiveCam(updatedCam8);

            // 최초 1회 즉시 호출
            fetchAiData();

            // ✅ BUG FIX: setInterval은 fetchAiData(useCallback)을 참조
            // fetchAiData 내부에서 ref를 통해 최신 상태를 읽으므로 클로저 문제 없음
            aiIntervalRef.current = setInterval(() => {
                fetchAiData();
            }, 1000);
        }
    };

    useEffect(() => {
        return () => {
            if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
        }
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen relative overflow-x-hidden">
            <style>
                {`
                @keyframes siren {
                    0%, 100% { background-color: rgba(239, 68, 68, 0); }
                    50% { background-color: rgba(239, 68, 68, 0.25); }
                }
                .animate-siren {
                    animation: siren 0.8s infinite;
                }
                @keyframes pulse-border {
                    0%, 100% { border-color: #ef4444; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    50% { border-color: #fca5a5; box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.4); }
                }
                .animate-pulse-border {
                    animation: pulse-border 1s infinite;
                }
                `}
            </style>

            {/* Emergency Siren Overlay */}
            {(showModal || showToast) && (
                <div className="fixed inset-0 z-[95] pointer-events-none animate-siren"></div>
            )}

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3">
                <div className="max-w-[1920px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined text-2xl">visibility</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">E-gle Eye <span className="text-primary">화재 감시 시스템</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex items-center gap-6">
                                <a className="text-sm font-semibold text-primary" href="#">대시보드</a>
                                <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">카메라 목록</a>
                                <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">로그 데이터</a>
                                <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">AI 분석</a>
                            </nav>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <span className="text-sm font-mono font-bold">
                                    {/* ✅ BUG FIX: currentTime → clockTime */}
                                    {clockTime.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\. /g, '-').replace('.', '')}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-danger rounded-full border-2 border-white dark:border-background-dark"></span>
                            </button>
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                title="Toggle Dark Mode"
                            >
                                <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                            <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-800">
                                <img className="w-full h-full object-cover" alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzM04oFAezpu8zoht4vmH9GRSR4qzT-UO5-I_xJWX9-G-s0oW-FRMWYAnjtR0HjiYtIgCJNoFnhal7KPZD_qR1p1-vRymci7t31g7Jm-3zVVu03L6ieCizx17bnxELDLVUnjAkSEBYsgEqSjJuBCnsyjFk5g8JhRL8wugOhAoXH2moGBLO-Mt_jRPgcTfhFLZiZDtlDmB87f1v9ttKR5CyFcRlxS_uSHvT2W9rtN7zgujEfvLARfT7nNTyHHAkEAE2r4TiVRHOiwU" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1920px] mx-auto p-6 flex flex-col lg:flex-row gap-6">
                {/* Main Area Left (75%) */}
                <section className="lg:w-3/4 flex flex-col gap-6">
                    {/* Large Main Camera Feed */}
                    <div className={`relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl group border-4 transition-all duration-500 ${isAiRunning ? (aiData.status_code >= 2 ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : aiData.status_code === 1 ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'border-slate-700 dark:border-slate-800') : (activeCam.status === 'danger' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : activeCam.status === 'warning' ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'border-slate-700 dark:border-slate-800')}`}>
                        {activeCam.isOffline ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 opacity-60 grayscale">
                                <span className="material-symbols-outlined text-slate-400 text-6xl">videocam_off</span>
                            </div>
                        ) : (youtubeUrl && isAiRunning) ? (
                            <ReactPlayer
                                ref={playerRef}
                                url={youtubeUrl}
                                playing={true}
                                muted={true}
                                controls={false}
                                width="100%"
                                height="100%"
                                className="w-full h-full object-cover opacity-90 transition-all pointer-events-none"
                            />
                        ) : (
                            <img className="w-full h-full object-cover opacity-90 transition-all" alt="Active Feed" src={activeCam.src} />
                        )}

                        <div className="absolute inset-0 pointer-events-none border border-white/10 z-20"></div>

                        {/* Camera Overlay Info */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-30">
                            <span className="bg-black/60 text-white px-3 py-1 rounded-md text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/20">
                                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                LIVE: {activeCam.id} - {activeCam.name}
                            </span>
                            <span className="bg-black/60 text-white px-3 py-1 rounded-md text-xs font-mono backdrop-blur-md border border-white/20">
                                {activeCam.time}
                            </span>
                        </div>

                        {/* Camera Controls */}
                        <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-auto z-30">
                            <button className="p-2 bg-black/60 text-white rounded-lg backdrop-blur-md hover:bg-black/80 transition-colors">
                                <span className="material-symbols-outlined text-sm">fullscreen</span>
                            </button>
                            <button className="p-2 bg-black/60 text-white rounded-lg backdrop-blur-md hover:bg-black/80 transition-colors">
                                <span className="material-symbols-outlined text-sm">videocam</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid of Smaller Previews */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {gridCams.map((cam, index) => (
                            <div
                                key={cam.id}
                                onClick={() => handleCamSwap(cam, index)}
                                className={`relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-all ${cam.isOffline ? 'opacity-60 grayscale' : ''} ${cam.status === 'danger' ? 'ring-4 ring-danger shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10' : cam.status === 'warning' ? 'ring-4 ring-warning z-10' : ''}`}
                            >
                                {cam.isOffline ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                        <span className="material-symbols-outlined text-slate-400">videocam_off</span>
                                    </div>
                                ) : (
                                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={cam.name} src={cam.src} />
                                )}
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded">{cam.id}</span>
                                    <span className="text-[10px] font-medium text-white/80">{cam.name}</span>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <span className="text-[10px] font-mono text-white/90">{cam.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main Area Right (25%) */}
                <aside className="lg:w-1/4 flex flex-col gap-6">
                    {/* AI Analysis Panel */}
                    <div className="bg-white dark:bg-background-dark/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                실시간 AI 분석
                            </h2>
                            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase">Monitoring</span>
                        </div>

                        {/* Gauge */}
                        <div className="flex flex-col items-center justify-center py-2">
                            <div className="relative size-32 flex items-center justify-center">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                    <circle
                                        className={`${isAiRunning ? (aiData.probability >= 70 ? 'stroke-danger' : aiData.probability >= 40 ? 'stroke-warning' : 'stroke-success') : 'stroke-slate-300 dark:stroke-slate-700'} transition-all duration-500`}
                                        cx="18" cy="18" fill="none" r="16"
                                        strokeDasharray={`${isAiRunning ? aiData.probability : 0}, 100`}
                                        strokeLinecap="round" strokeWidth="3"
                                    ></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className={`text-2xl font-black ${isAiRunning ? (aiData.probability >= 70 ? 'text-danger' : aiData.probability >= 40 ? 'text-warning' : 'text-success') : 'text-slate-400'}`}>
                                        {isAiRunning ? `${aiData.probability}%` : '---'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">위험도</span>
                                </div>
                            </div>
                        </div>

                        {/* Window Frame Analysis */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">최근 8프레임 분석</p>
                                <p className={`text-[10px] font-bold ${aiData.history?.includes('fire') ? 'text-danger' : 'text-primary'}`}>
                                    {aiData.history?.includes('fire') ? 'DETECTED' : 'ALL CLEAR'}
                                </p>
                            </div>
                            <div className="flex gap-1.5 h-8">
                                {Array.from({ length: 8 }).map((_, idx) => {
                                    const historyList = aiData.history || [];
                                    const item = historyList[idx];
                                    const hasData = item !== undefined;
                                    const isFire = item === 'fire';

                                    return (
                                        <div key={idx} className={`flex-1 rounded-sm opacity-80 transition-colors duration-300 ${!isAiRunning ? 'bg-slate-200 dark:bg-slate-700' : (hasData ? (isFire ? 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-success') : 'bg-slate-200 dark:bg-slate-700')}`}></div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AI Video Analysis Controls */}
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-sm">link</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="분석할 유튜브 링크를 입력..."
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    disabled={isAiRunning}
                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-300 disabled:opacity-50"
                                />
                            </div>

                            <button
                                onClick={toggleAiAnalysis}
                                disabled={!youtubeUrl.trim() && !isAiRunning}
                                className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${(!youtubeUrl.trim() && !isAiRunning)
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : isAiRunning
                                        ? 'bg-danger hover:bg-danger/90 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                                        : 'bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {isAiRunning ? 'stop_circle' : 'play_circle'}
                                </span>
                                {isAiRunning ? 'AI 분석 중지' : '유튜브 실시간 분석 시작'}
                            </button>

                            {/* Detailed Stats - AI 동작 중일 때만 표시 */}
                            {isAiRunning && (
                                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-slate-500">EWMA (평활화)</span>
                                        <span className="font-mono">{aiData.ewma}%</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-slate-500">누적 화재 프레임</span>
                                        <span className="font-mono">{aiData.fireCount} frames</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-500">현재 판단 상태</span>
                                        <span className={`font-mono font-bold ${aiData.status.includes('EMERGENCY') ? 'text-danger flex items-center gap-1' : ''}`}>
                                            {aiData.status.includes('EMERGENCY') && <span className="material-symbols-outlined text-[10px] animate-ping">priority_high</span>}
                                            {aiData.status}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Event Log Panel */}
                    <div className="flex-1 bg-white dark:bg-background-dark/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm min-h-[300px]">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-500 text-sm">list_alt</span>
                                최근 이벤트 로그
                            </h2>
                            <button className="text-[10px] text-slate-500 hover:text-primary underline">전체보기</button>
                        </div>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
                            {toastMessages.length === 0 ? (
                                <div className="text-center text-xs text-slate-400 py-4">새로운 이벤트가 없습니다.</div>
                            ) : (
                                toastMessages.slice(0, 5).map((log, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-danger/5 border-l-2 border-danger">
                                        <span className="text-[10px] font-mono text-danger font-bold mt-0.5">[{new Date().toLocaleTimeString('ko-KR', { hour12: false })}]</span>
                                        <div>
                                            <p className="text-xs font-bold text-danger">{log.title}</p>
                                            <p className="text-[10px] text-slate-500">{log.desc}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </main>

            {/* Bottom-right Toast Alert */}
            {showToast && toastMessages.length > 0 && (
                <div className="fixed bottom-6 right-6 z-[90] bg-white dark:bg-slate-800 border-l-4 border-danger rounded-xl shadow-2xl p-4 w-80 animate-bounce cursor-pointer"
                    onClick={() => setShowModal(true)}>
                    <div className="flex items-start justify-between gap-3">
                        <div className={`flex items-center justify-center size-8 rounded-full ${toastMessages[0].iconColor || 'bg-danger/10 text-danger'}`}>
                            <span className="material-symbols-outlined">{toastMessages[0].icon || 'local_fire_department'}</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{toastMessages[0].title}</h4>
                            <p className="text-xs text-slate-500">{toastMessages[0].desc}</p>
                        </div>
                        <button className="text-slate-400 hover:text-danger" onClick={(e) => { e.stopPropagation(); setShowToast(false); }}>
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowModal(true); setShowToast(false); }}
                        className="w-full mt-3 py-2 bg-danger/10 hover:bg-danger text-danger hover:text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors">
                        상세 확인하러 가기 <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                </div>
            )}

            {/* Main Alert Modal Popup */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] border-[6px] border-danger overflow-hidden animate-pulse-border">
                        <div className="bg-danger text-white py-4 px-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-4xl animate-bounce">warning</span>
                                <h2 className="text-3xl font-black tracking-tighter">EMERGENCY: FIRE DETECTED</h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-2xl">close</span>
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">발생 장소</p>
                                            <p className="text-xl font-black text-slate-800 dark:text-slate-100">{youtubeUrl ? "유튜브 분석 중" : activeCam.name}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">위험 등급</p>
                                            <p className="text-xl font-black text-danger">{aiData.status_code >= 2 ? 'CRITICAL (LV. 4)' : aiData.status_code === 1 ? 'WARNING (LV. 2)' : 'NORMAL'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-slate-500 uppercase">AI 분석 위험도</p>
                                            <span className="text-xl font-black text-danger">{aiData.probability}%</span>
                                        </div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                            <div className="h-full bg-danger relative" style={{ width: `${aiData.probability}%` }}>
                                                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-danger/5 border-2 border-danger/20 p-4 rounded-xl">
                                        <h3 className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">info</span>
                                            긴급 조치 사항
                                        </h3>
                                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                            <li className="flex items-center gap-2">• 즉시 주변 인원 대피 및 안전 거리 확보</li>
                                            <li className="flex items-center gap-2">• 소화기 또는 화재 진압 장비 사용 시도</li>
                                            <li className="flex items-center gap-2">• 소방서(119) 자동 신고 시스템 확인</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* ✅ BUG FIX: 모달에서도 Grad-CAM 이미지 우선 표시, 없을 때만 카메라 이미지 표시 */}
                                <div className="relative w-full lg:w-[400px] aspect-video lg:aspect-square rounded-2xl overflow-hidden border-4 border-danger/30 shadow-2xl">
                                    <img
                                        alt="Detection Frame"
                                        className="w-full h-full object-cover"
                                        src={aiData.gradcam_b64 ? `data:image/jpeg;base64,${aiData.gradcam_b64}` : activeCam.src}
                                    />
                                    <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                                    <div className="absolute top-4 left-4 bg-danger text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                                        {aiData.gradcam_b64 ? 'GRAD-CAM: HOTSPOT DETECTED' : 'DETECTED: SMOKE/FLAME'}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20">
                                        <span className="size-2 rounded-full bg-danger animate-ping"></span>
                                        <span className="text-[10px] font-mono font-bold text-white tracking-widest">CAM_08_REC</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button onClick={handleEmergencySwap} className="flex-[2] py-5 bg-danger hover:bg-red-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all active:scale-[0.97] hover:-translate-y-1">
                                    <span className="material-symbols-outlined text-3xl">fullscreen</span>
                                    해당 카메라 메인 화면 전환
                                </button>
                                <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
                                    닫기
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900 px-8 py-3 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-danger">
                                <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                                AI 실시간 분석 지속 중
                            </div>
                            <div>
                                EVENT ID: ER-2024-001 | TIME: {aiData.timestamp}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <p>© 2023 E-gle Eye Security Systems. All Rights Reserved.</p>
                <div className="flex gap-4">
                    <a className="hover:text-primary" href="#">개인정보처리방침</a>
                    <a className="hover:text-primary" href="#">시스템 이용약관</a>
                    <a className="hover:text-primary" href="#">고객센터</a>
                </div>
            </footer>
        </div>
    );
};

export default App;
