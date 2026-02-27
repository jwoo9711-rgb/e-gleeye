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

    // 데모용: 처음 접속하고 5초 뒤에 오른쪽 아래 토스트 알림 띄우기
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToast(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // 1. 그리드 카메라 클릭 시 메인 카메라와 스왑
    const handleCamSwap = (clickedCam, index) => {
        const newGridCams = [...gridCams];
        newGridCams[index] = activeCam; // 기존 메인캠을 그리드 자리로
        setGridCams(newGridCams);
        setActiveCam(clickedCam); // 클릭한 캠을 메인캠으로 설정
    };

    // 2. 알림창에서 '확인'을 눌렀을 때, 화재가 발생한 캠을 메인캠으로 강제 전환
    const handleEmergencySwap = () => {
        // CAM-08을 찾아서 메인으로 스왑
        const targetId = 'CAM-08';
        if (activeCam.id === targetId) {
            // 이미 메인캠이면 모달과 토스트만 닫기
            setShowModal(false);
            setShowToast(false);
            return;
        }

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
            newGridCams[targetIndex] = activeCam;
            setGridCams(newGridCams);
            setActiveCam(updatedAlertCam);
        }

        setShowModal(false);
        setShowToast(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen relative">
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
                                <span className="text-sm font-mono font-bold">2023-10-27 14:52:10</span>
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
                            {/* Logs list omitted for brevity, kept essential ones */}
                            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-2 border-slate-300">
                                <span className="text-[10px] font-mono text-slate-500 mt-0.5">[14:50:45]</span>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">CAM-01 차량 진입</p>
                                    <p className="text-[10px] text-slate-500">차량번호: 12가 3456</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-2 border-slate-300">
                                <span className="text-[10px] font-mono text-slate-500 mt-0.5">[14:40:02]</span>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">시스템 자가 진단 완료</p>
                                    <p className="text-[10px] text-slate-500">모든 카메라 정상 작동 중</p>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border-4 border-danger overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-full bg-danger flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-3xl">report</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">CAM-08에서 화재 감지!</h2>
                                        <p className="text-danger font-bold text-sm tracking-tight">즉각적인 주의 필요</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">탐지유형</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">화재 / 연기 탐지</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">AI 신뢰도</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-danger w-[82%]"></div>
                                            </div>
                                            <span className="text-sm font-black text-danger">82%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative w-full md:w-64 aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                                    <img alt="Detection Frame" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw" />
                                    <div className="absolute inset-0 border-2 border-danger m-8">
                                        <div className="absolute -top-6 left-0 bg-danger text-white text-[8px] font-bold px-1 py-0.5">객체: 연기</div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1">
                                        <span className="size-1.5 rounded-full bg-danger animate-pulse"></span>
                                        <span className="text-[8px] font-mono text-white">CAM_08_REC</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleEmergencySwap} className="flex-1 py-4 bg-danger hover:bg-danger/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-danger/20 transition-all active:scale-[0.98]">
                                    <span className="material-symbols-outlined">fullscreen</span>
                                    확인 및 메인 뷰 전환
                                </button>
                                <button onClick={() => setShowModal(false)} className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    Dismiss
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                탐지 시간: 14:22:04 (현지 시간)
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-danger animate-pulse"></span>
                                실시간 데이터 전송 중
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
