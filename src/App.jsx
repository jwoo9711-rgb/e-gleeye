import { useState, useEffect } from 'react';

// 카메라 초기 데이터 셋
const defaultActiveCam = { id: 'CAM-05', name: '메인 물류 창고 A구역', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw', isOffline: false };

const initialGridCams = [
    { id: 'CAM-01', name: '정문 주차장', time: '14:52:08', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuO6yejcR_OvplKhCtYeqc6dqtG-xGygg5VL87SGSoo4ygwpNUmtr1RsrD0WbjoHTqUGMhM8iFDAW5R4LARUFPz-1LQ2OuwN7lpJEiGJi_9V9SXx0v01fFaec82hvLzuaWyTE4BddkZWBNeBK0bc_9kQ2ghTizRyVvWJ7Eyuk1JDXVEgonPR7SkosRwRogF0cdTd4IHtCvEnc3DPZrfPr5FSCgB00t99ebQr2icGO4RozZjRrDjtmZOLLVIzqnR5Y3TUbPBSYGXi4', isOffline: false },
    { id: 'CAM-02', name: '로비 데스크', time: '14:52:07', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABmKNqT0wgVs66Djrmja8pp63xOWxTa9zOZc-y6F7q-UgceGlK0aYl13MnjSOTBqm9svvB4WF9R-Bu0fD19B0t2VcU4RTIMtPPv0WaGdpiRHGM5yo1hXwute0X2bE8kOvLIKvnpCaubPX9B2ad421PK8pmMkBxzaDZ6DjmpcVbHt2GWAdGz46DT8T0Nsl11FMUXjsps3pRD6fj84gjab8dwVl-XuapJpUuGu1ruq5Ei8JWa8d7iHVqvYWClQlX-CZhLzcNnWDIsKM', isOffline: false },
    { id: 'CAM-03', name: '자재 하역장', time: '14:52:09', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8knZ0WAd1E20p6l4DbFzBqoqPo8ECLyQAERSrfiNUW5t9rAURFem2XspR8rGHzX65la00Uh_lNKAHXtLgo68NmAQ6AhO1PaHZNAulG3jw3RQl7BqrEkIhuEsN6ttmu9gi-SWinXpGpr0zXsXRmV2dTD9VCMBFCiRyFuSDz11phAYjdRmfoCLQIR5FQOW8MLWYqy2xg71b_-NxAX0Wk43yFonWgeEFlxVgYdfta498nQKmAZjrI08zSjU9fqZMVQh52zkZjjk8aw', isOffline: false },
    { id: 'CAM-04', name: '데이터 센터', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXTuQ15QCfoHzR6qe_TUqRTR9P2W3_6J5lbDE1ZrGxtoY9OM7q7GpLDQtLbzRJmovz8V5jWBj38OuY2B4qbtpJSbYMAkWKEOXrvH7TvndO5v5XeBp69CqSWZT22BQ8cvv3MlY4cDCW8N9rEAU3PxbbHMxuAdAMYMApp6GeXp23gFMk1F5fktFuyBZcGN7pb3_EuNMRJYDJAYbG1J_Y9PnltLSS0WmB_5yoQZ5PUezcWNDelEJIq4612npsSFpgpo7yEGOEhLBGIUM', isOffline: false },
    { id: 'CAM-06', name: '직원 휴게실', time: '14:52:05', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy5JH2olA84oezMtWcRQwG1x1noYAJQEX07QG9LVazkk-xd9wvgGGPEC6dJtq2SsLUvsMqbbk_RExhequCBJ5b_eF-Q76o6RVPgqagotFhh17ePyJKWWpK1PHRhWhz7XAh0c6jVgPGUQpBbCIInp6_23Cltn5LxFo1C2xAX-J_f2iT-d6IPdR4lxQFOq5xyk2gRaZ-9VE5GWM_zWE6QagYytHX4H8kjzKbJ9b5D12cTrvYx2Ny-34Yk7KwEbU7ziZryF9E447nnoI', isOffline: false },
    { id: 'CAM-07', name: '3층 복도 B', time: '14:52:04', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZR4h0i7Ie70UVhA9JEU4Zu0W3ES5P4ejblahA4TfIxZmEI0jVJR0BmgLhHcUop03waPAExuiLkAfrM9g5Yt_6NZqAuYMl7FjWLr0d6wpA1nXfCUVlkYwUVMQoVmSbObQAFsNyS69zo-hviYvk1PcH-BXtx72exGt77mQaacXPXAy0vE1IZBnlERSiT40CY46YYpnu6Jm2-SfmrogNyU0PFfb4NIgM8IoewgAJjNIhtXuu3ZDhGvce0Jxd3KFxtRTzn-wAc_O-OFA', isOffline: false },
    { id: 'CAM-08', name: '후문 입구 (오프라인)', time: '14:52:04', src: '', isOffline: true },
];

const App = () => {
    const [isDark, setIsDark] = useState(false);

    // 카메라 상태 관리
    const [activeCam, setActiveCam] = useState(defaultActiveCam);

    // 실시간 시계 상태 관리
    const [currentTime, setCurrentTime] = useState(new Date());
    const [gridCams, setGridCams] = useState(initialGridCams);

    // 알림 상태 관리
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // 시간 1초마다 업데이트
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timeInterval);
    }, []);

    // 데모용: 처음 접속하고 5초 뒤에 오른쪽 아래 토스트 알림 띄우기
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToast(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // 1. 그리드 카메라 클릭 시 메인 카메라로 설정 (그리드 순서 고정)
    const handleCamSwap = (clickedCam, index) => {
        setActiveCam(clickedCam); // 클릭한 캠을 메인캠으로 설정
    };

    // 2. 알림창에서 '확인'을 눌렀을 때, 화재가 발생한 캠을 메인캠으로 설정 (그리드 순서 고정)
    const handleEmergencySwap = () => {
        // CAM-08을 찾아서 메인으로 표시
        const targetId = 'CAM-08';

        const targetIndex = gridCams.findIndex(cam => cam.id === targetId);
        if (targetIndex !== -1) {
            const targetCam = gridCams[targetIndex];

            // 데이터 업데이트 (오프라인 상태 해제 후 샘플 이미지 추가)
            const updatedAlertCam = {
                ...targetCam,
                isOffline: false,
                name: '후문 입구 (화재 감지)',
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw'
            };

            const newGridCams = [...gridCams];
            newGridCams[targetIndex] = updatedAlertCam; // 그리드의 해당 카메라 상태 반영
            setGridCams(newGridCams);
            setActiveCam(updatedAlertCam);
        }

        setShowModal(false);
        setShowToast(false);
    };

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
                            <h1 className="text-xl font-bold tracking-tight">E-gle Eye <span className="text-primary">통합 관제 대시보드</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex items-center gap-6">
                                <a className="text-sm font-semibold text-primary" href="#">대시보드</a>
                                <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">카메라 목록</a>
                                <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">로그 데이터</a>
                                <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#">통계 분석</a>
                            </nav>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <span className="text-sm font-mono font-bold">
                                    {currentTime.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\. /g, '-').replace('.', '')}
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
                    <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl group border-4 border-slate-700 dark:border-slate-800 transition-all duration-500">
                        {activeCam.isOffline ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 opacity-60 grayscale">
                                <span className="material-symbols-outlined text-slate-400 text-6xl">videocam_off</span>
                            </div>
                        ) : (
                            <img className="w-full h-full object-cover opacity-90 transition-all" alt="Active Feed" src={activeCam.src} />
                        )}

                        <div className="absolute inset-0 pointer-events-none border border-white/10"></div>

                        {/* Camera Overlay Info */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="bg-black/60 text-white px-3 py-1 rounded-md text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/20">
                                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                LIVE: {activeCam.id} - {activeCam.name}
                            </span>
                            <span className="bg-black/60 text-white px-3 py-1 rounded-md text-xs font-mono backdrop-blur-md border border-white/20">
                                {activeCam.time}
                            </span>
                        </div>

                        {/* Camera Controls */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
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
                                className={`relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-all ${cam.isOffline ? 'opacity-60 grayscale' : ''}`}
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
                                    <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">94%</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">신뢰도</span>
                                </div>
                            </div>
                        </div>

                        {/* Window Frame Analysis */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">5초 윈도우 프레임 분석</p>
                                <p className="text-[10px] text-primary font-bold">ALL CLEAR</p>
                            </div>
                            <div className="flex gap-1.5 h-8">
                                <div className="flex-1 bg-success rounded-sm opacity-60"></div>
                                <div className="flex-1 bg-success rounded-sm opacity-60"></div>
                                <div className="flex-1 bg-success rounded-sm opacity-60"></div>
                                <div className="flex-1 bg-success rounded-sm opacity-80"></div>
                                <div className="flex-1 bg-success rounded-sm"></div>
                                <div className="flex-1 bg-success rounded-sm"></div>
                                <div className="flex-1 bg-success rounded-sm"></div>
                                <div className="flex-1 bg-success rounded-sm opacity-90"></div>
                                <div className="flex-1 bg-success rounded-sm opacity-80"></div>
                                <div className="flex-1 bg-success rounded-sm opacity-70"></div>
                            </div>
                        </div>

                        {/* Emergency Test Button (To manually trigger the alarm) */}
                        <button
                            onClick={() => setShowToast(true)}
                            className="w-full py-4 bg-danger hover:bg-danger/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-danger/20 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">report_problem</span>
                            수동 알림 테스트 (화재)
                        </button>
                    </div>

                    {/* Event Log Panel */}
                    <div className="flex-1 bg-white dark:bg-background-dark/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm min-h-[300px]">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-500 text-sm">list_alt</span>
                                최근 이벤트 로그
                            </h2>
                            <button className="text-[10px] text-slate-500 hover:text-primary underline">더보기</button>
                        </div>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
                            <div className="flex items-start gap-3 p-2 rounded-lg bg-danger/5 border-l-2 border-danger">
                                <span className="text-[10px] font-mono text-danger font-bold mt-0.5">[14:52:10]</span>
                                <div>
                                    <p className="text-xs font-bold text-danger">CAM-05 화재 감지됨</p>
                                    <p className="text-[10px] text-slate-500">객체 식별: Flame (94.2%)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-lg bg-warning/5 border-l-2 border-warning">
                                <span className="text-[10px] font-mono text-warning font-bold mt-0.5">[14:45:10]</span>
                                <div>
                                    <p className="text-xs font-bold text-warning">CAM-05 연기 감지됨</p>
                                    <p className="text-[10px] text-slate-500">창고 A구역 미세 연기</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Bottom-right Toast Alert */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-[90] bg-white dark:bg-slate-800 border-l-4 border-danger rounded-xl shadow-2xl p-4 w-80 animate-bounce cursor-pointer"
                    onClick={() => setShowModal(true)}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center justify-center size-8 rounded-full bg-danger/10 text-danger">
                            <span className="material-symbols-outlined">local_fire_department</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">화재 위험 탐지!</h4>
                            <p className="text-xs text-slate-500">CAM-08 (후문 입구)에서 연기 패턴이 식별되었습니다.</p>
                        </div>
                        <button className="text-slate-400 hover:text-danger" onClick={(e) => { e.stopPropagation(); setShowToast(false); }}>
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowModal(true); setShowToast(false); }}
                        className="w-full mt-3 py-2 bg-danger/10 hover:bg-danger text-danger hover:text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors">
                        상세 확인하기 <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">탐지 장소</p>
                                            <p className="text-xl font-black text-slate-800 dark:text-slate-100">CAM-08 후문 입구</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">위험 등급</p>
                                            <p className="text-xl font-black text-danger">CRITICAL (LV. 4)</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-slate-500 uppercase">AI 분석 신뢰도</p>
                                            <span className="text-xl font-black text-danger">82%</span>
                                        </div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                            <div className="h-full bg-danger w-[82%] relative">
                                                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-danger/5 border-2 border-danger/20 p-4 rounded-xl">
                                        <h3 className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">info</span>
                                            권장 조치 사항
                                        </h3>
                                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                            <li className="flex items-center gap-2">• 즉시 현장 보안 요원 출동 지시</li>
                                            <li className="flex items-center gap-2">• 건물 내 화재 경보 알람 활성화 검토</li>
                                            <li className="flex items-center gap-2">• 소방서(119) 자동 신고 시스템 확인</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="relative w-full lg:w-[400px] aspect-video lg:aspect-square rounded-2xl overflow-hidden border-4 border-danger/30 shadow-2xl">
                                    <img alt="Detection Frame" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw" />
                                    <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                                    <div className="absolute top-4 left-4 bg-danger text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                                        DETECTED: SMOKE/FLAME
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
                                    현장 상황 즉시 관제
                                </button>
                                <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
                                    무시하기
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900 px-8 py-3 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-danger">
                                <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                                AI 실시간 분석 엔진 가동 중
                            </div>
                            <div>
                                EVENT ID: ER-2024-001 | TIME: 14:22:04
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
