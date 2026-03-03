import { useState, useEffect } from 'react';

// 카메라 초기 데이터 셋 (status 추가)
const defaultActiveCam = { id: 'CAM-05', name: '메인 물류 창고 A구역', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw', isOffline: false, status: 'danger' };

const initialGridCams = [
    { id: 'CAM-01', name: '정문 주차장', time: '14:52:08', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuO6yejcR_OvplKhCtYeqc6dqtG-xGygg5VL87SGSoo4ygwpNUmtr1RsrD0WbjoHTqUGMhM8iFDAW5R4LARUFPz-1LQ2OuwN7lpJEiGJi_9V9SXx0v01fFaec82hvLzuaWyTE4BddkZWBNeBK0bc_9kQ2ghTizRyVvWJ7Eyuk1JDXVEgonPR7SkosRwRogF0cdTd4IHtCvEnc3DPZrfPr5FSCgB00t99ebQr2icGO4RozZjRrDjtmZOLLVIzqnR5Y3TUbPBSYGXi4', isOffline: false, status: 'normal' },
    { id: 'CAM-02', name: '로비 데스크', time: '14:52:07', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABmKNqT0wgVs66Djrmja8pp63xOWxTa9zOZc-y6F7q-UgceGlK0aYl13MnjSOTBqm9svvB4WF9R-Bu0fD19B0t2VcU4RTIMtPPv0WaGdpiRHGM5yo1hXwute0X2bE8kOvLIKvnpCaubPX9B2ad421PK8pmMkBxzaDZ6DjmpcVbHt2GWAdGz46DT8T0Nsl11FMUXjsps3pRD6fj84gjab8dwVl-XuapJpUuGu1ruq5Ei8JWa8d7iHVqvYWClQlX-CZhLzcNnWDIsKM', isOffline: false, status: 'normal' },
    { id: 'CAM-03', name: '자재 하역장', time: '14:52:09', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8knZ0WAd1E20p6l4DbFzBqoqPo8ECLyQAERSrfiNUW5t9rAURFem2XspR8rGHzX65la00Uh_lNKAHXtLgo68NmAQ6AhO1PaHZNAulG3jw3RQl7BqrEkIhuEsN6ttmu9gi-SWinXpGpr0zXsXRmV2dTD9VCMBFCiRyFuSDz11phAYjdRmfoCLQIR5FQOW8MLWYqy2xg71b_-NxAX0Wk43yFonWgeEFlxVgYdfta498nQKmAZjrI08zSjU9fqZMVQh52zkZjjk8aw', isOffline: false, status: 'normal' },
    { id: 'CAM-04', name: '데이터 센터', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXTuQ15QCfoHzR6qe_TUqRTR9P2W3_6J5lbDE1ZrGxtoY9OM7q7GpLDQtLbzRJmovz8V5jWBj38OuY2B4qbtpJSbYMAkWKEOXrvH7TvndO5v5XeBp69CqSWZT22BQ8cvv3MlY4cDCW8N9rEAU3PxbbHMxuAdAMYMApp6GeXp23gFMk1F5fktFuyBZcGN7pb3_EuNMRJYDJAYbG1J_Y9PnltLSS0WmB_5yoQZ5PUezcWNDelEJIq4612npsSFpgpo7yEGOEhLBGIUM', isOffline: false, status: 'normal' },
    { id: 'CAM-05', name: '메인 물류 창고 A구역', time: '14:52:10', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw', isOffline: false, status: 'danger' },
    { id: 'CAM-06', name: '직원 휴게실', time: '14:52:05', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy5JH2olA84oezMtWcRQwG1x1noYAJQEX07QG9LVazkk-xd9wvgGGPEC6dJtq2SsLUvsMqbbk_RExhequCBJ5b_eF-Q76o6RVPgqagotFhh17ePyJKWWpK1PHRhWhz7XAh0c6jVgPGUQpBbCIInp6_23Cltn5LxFo1C2xAX-J_f2iT-d6IPdR4lxQFOq5xyk2gRaZ-9VE5GWM_zWE6QagYytHX4H8kjzKbJ9b5D12cTrvYx2Ny-34Yk7KwEbU7ziZryF9E447nnoI', isOffline: false, status: 'normal' },
    { id: 'CAM-07', name: '3층 복도 B', time: '14:52:04', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZR4h0i7Ie70UVhA9JEU4Zu0W3ES5P4ejblahA4TfIxZmEI0jVJR0BmgLhHcUop03waPAExuiLkAfrM9g5Yt_6NZqAuYMl7FjWLr0d6wpA1nXfCUVlkYwUVMQoVmSbObQAFsNyS69zo-hviYvk1PcH-BXtx72exGt77mQaacXPXAy0vE1IZBnlERSiT40CY46YYpnu6Jm2-SfmrogNyU0PFfb4NIgM8IoewgAJjNIhtXuu3ZDhGvce0Jxd3KFxtRTzn-wAc_O-OFA', isOffline: false, status: 'normal' },
    { id: 'CAM-08', name: '후문 입구', time: '14:52:04', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw', isOffline: false, status: 'normal' },
];

const App = () => {
    const [isDark, setIsDark] = useState(false);

    // 카메라 상태 관리
    const [activeCam, setActiveCam] = useState(defaultActiveCam);

    // 실시간 시계 상태 관리
    const [currentTime, setCurrentTime] = useState(new Date());
    const [gridCams, setGridCams] = useState(initialGridCams);

    // AI 및 시뮬레이션 상태 관리
    const [aiConfidence, setAiConfidence] = useState(94);
    const [isMultiFire, setIsMultiFire] = useState(false);
    const [isFalseAlarmSim, setIsFalseAlarmSim] = useState(false);
    const [eventLogs, setEventLogs] = useState([
        { id: 1, time: '14:52:10', type: 'danger', cam: 'CAM-05', title: 'CAM-05 화재 감지됨', desc: '객체 식별: Flame (94.2%)' },
        { id: 2, time: '14:45:10', type: 'warning', cam: 'CAM-05', title: 'CAM-05 연기 감지됨', desc: '창고 A구역 미세 연기' }
    ]);

    // 알림/팝업 상태 관리
    const [toastMessages, setToastMessages] = useState([]); // 요소: { id, camId, title, desc, icon, iconColor }
    const [isAlertActive, setIsAlertActive] = useState(false); // 화재 경보 활성화 여부

    // 전체화면 토글 관리
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenCam, setFullscreenCam] = useState(null);

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

    // 글로벌 ESC 키 감지 (전체화면 종료)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsFullscreen(false);
                setFullscreenCam(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 화재 경보 트리거 함수 (데모나 수동 발동용)
    const triggerFireAlert = () => {
        setIsAlertActive(true);

        // CAM-08의 상태를 'danger'로 업데이트
        const updatedGrid = [...gridCams];
        const targetIndex = updatedGrid.findIndex(cam => cam.id === 'CAM-08');
        if (targetIndex !== -1) {
            updatedGrid[targetIndex] = {
                ...updatedGrid[targetIndex],
                isOffline: false,
                status: 'danger',
                name: '후문 입구 (화재 감지)',
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw'
            };
            setGridCams(updatedGrid);
        }

        // 현재 보고 있던 메인캠이 CAM-08이라면 메인캠 상태도 업데이트
        if (activeCam.id === 'CAM-08') {
            setActiveCam({
                ...activeCam,
                isOffline: false,
                status: 'danger',
                name: '후문 입구 (화재 감지)',
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mvhsFVbX8M0YzqSmpAp_uT5lWHjqXVZzZKI1udODesBd2zs8NZFJeKc-BPzFszurL5i_xImpcww7GYf_hcWxcxF4f6MsPTbCl35HCEBMZwVMStB7RWkW22hYdR1H9KBOdO52tPeLsbQ9yVow8Pfw4WalBJtmzvr3-PeFFNUX5fKjC8IUi8vAa10psW6ILxkI16W4KIa6D04B7rr-Op9xgy73qrefAjlKCI4bAwxXXodXDSaG_00YVKQoB56Y1x4vTeBphGkFuRw'
            });
        }
    };

    // 데모용: 처음 접속하고 5초 뒤에 오른쪽 아래 토스트 알림 띄우기 (화재 시뮬레이션)
    useEffect(() => {
        const timer = setTimeout(() => {
            triggerFireAlert();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // 1. 그리드 카메라 클릭 시 메인 카메라로 전환 (위치 고정, 소스 전환)
    const handleCamChange = (clickedCam) => {
        setActiveCam(clickedCam);
    };

    // 더블클릭 시 전체화면 토글
    const handleDoubleClick = (cam) => {
        if (isFullscreen) {
            setIsFullscreen(false);
            setFullscreenCam(null);
        } else {
            setFullscreenCam(cam);
            setIsFullscreen(true);
        }
    };

    // --- 시뮬레이터 함수 시작 ---

    // 시뮬레이션 공통 초기화 로직
    const resetSimulations = () => {
        setIsAlertActive(false);
        setToastMessages([]);
        setIsMultiFire(false);
        setIsFalseAlarmSim(false);
        setAiConfidence(8);

        const normalGrid = initialGridCams.map(cam => ({
            ...cam, status: 'normal', name: cam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '')
        }));
        setGridCams(normalGrid);
        return normalGrid;
    };

    // 1. [정상 모드]
    const handleSimNormal = () => {
        const baseGrid = resetSimulations();
        const normalActive = { ...baseGrid[0], time: currentTime.toLocaleTimeString('ko-KR', { hour12: false }) };
        setActiveCam(normalActive);
    };

    // 2. [연기 감지]
    const handleSimSmoke = () => {
        const baseGrid = resetSimulations();
        setIsAlertActive(true);
        setAiConfidence(45);

        const targetId = 'CAM-03';
        const smokeImgSrc = `${import.meta.env.BASE_URL}smoke_sim.png`;
        const updatedGrid = baseGrid.map(cam =>
            cam.id === targetId ? { ...cam, status: 'warning', src: smokeImgSrc, name: cam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '') + ' (연기 감지)' } : cam
        );
        setGridCams(updatedGrid);

        const targetCam = updatedGrid.find(cam => cam.id === targetId);
        setActiveCam(targetCam);

        // 연기 감지 전용 팝업 추가
        setToastMessages([{
            id: Date.now(),
            camId: targetId,
            title: `주의: ${targetId}에서 연기 감지!`,
            desc: `확인 필요`,
            icon: "warning",
            iconColor: "text-warning bg-warning/10"
        }]);
    };

    // 3. [화재 발생]
    const handleSimFire = () => {
        const baseGrid = resetSimulations();
        setIsAlertActive(true);
        setAiConfidence(95);

        const targetId = 'CAM-08';
        const fireImgSrc = `${import.meta.env.BASE_URL}fire_sim.png`;
        const updatedGrid = baseGrid.map(cam =>
            cam.id === targetId ? { ...cam, status: 'danger', src: fireImgSrc, name: cam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '') + ' (화재 감지)' } : cam
        );
        setGridCams(updatedGrid);

        const targetCam = updatedGrid.find(cam => cam.id === targetId);
        setActiveCam(targetCam);

        // 화재 발생 전용 팝업 추가
        setToastMessages([{
            id: Date.now(),
            camId: targetId,
            title: `위험: ${targetId} 화재 발생 탐지!`,
            desc: `즉각적인 조치 요망`,
            icon: "local_fire_department",
            iconColor: "text-danger bg-danger/10"
        }]);
    };

    // 4. [다중 화재]
    const handleSimMultiFire = () => {
        const baseGrid = resetSimulations();
        setIsMultiFire(true);
        setIsAlertActive(true);
        setAiConfidence(98);

        const cam03FireImgSrc = `${import.meta.env.BASE_URL}fire_sim_cam03.png`;
        const cam07FireImgSrc = `${import.meta.env.BASE_URL}fire_sim.png`;

        const updatedGrid = baseGrid.map(cam => {
            if (cam.id === 'CAM-03') {
                return { ...cam, status: 'danger', src: cam03FireImgSrc, name: cam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '') + ' (화재 확정)' };
            }
            if (cam.id === 'CAM-07') {
                return { ...cam, status: 'danger', src: cam07FireImgSrc, name: cam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '') + ' (화재 확정)' };
            }
            return cam;
        });
        setGridCams(updatedGrid);

        setToastMessages([
            {
                id: Date.now() + 1,
                camId: 'CAM-07',
                title: `긴급: CAM-07 화재 탐지`,
                desc: `다중 복합 위험 탐지`,
                icon: "warning",
                iconColor: "text-danger bg-danger/20"
            },
            {
                id: Date.now() + 2,
                camId: 'CAM-03',
                title: `긴급: CAM-03 화재 탐지`,
                desc: `다중 복합 위험 탐지`,
                icon: "warning",
                iconColor: "text-danger bg-danger/20"
            }
        ]);
    };

    // 5. [오탐지]
    const handleSimFalseAlarm = () => {
        const baseGrid = resetSimulations();
        setIsAlertActive(true);
        setIsFalseAlarmSim(true);
        setAiConfidence(92);

        const targetId = 'CAM-01';
        const falseAlarmImgSrc = `${import.meta.env.BASE_URL}false_alarm_sim.png`;

        const updatedGrid = baseGrid.map(cam =>
            cam.id === targetId ? { ...cam, status: 'danger', src: falseAlarmImgSrc, name: '정문 주차장 (오탐지 추정)' } : cam
        );
        setGridCams(updatedGrid);

        const targetCam = updatedGrid.find(cam => cam.id === targetId);
        setActiveCam(targetCam);

        setToastMessages([{
            id: Date.now(),
            camId: targetId,
            title: `경고: ${targetId} 화재 감지`,
            desc: `AI 신뢰도 92% - 관리자 확인 요망`,
            icon: "warning",
            iconColor: "text-danger bg-danger/10"
        }]);

        setEventLogs(prev => [{
            id: Date.now() + 1,
            time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
            type: 'danger',
            cam: targetId,
            title: `[${targetId}] 화재 의심 객체 탐지`,
            desc: `오탐지 가능성. 관제사 검토 대기 중.`
        }, ...prev].slice(0, 50));
    };

    // 카메라별 맞춤형 바운딩 박스 위치 및 크기 생성 헬퍼
    const getBoundingBoxStyles = (camId, status) => {
        const baseClasses = "absolute z-20 pointer-events-none transition-all ";
        if (status === 'danger') {
            if (camId === 'CAM-01') return baseClasses + "top-[10%] left-[30%] w-[35%] h-[60%] border-[3px] border-danger";
            if (camId === 'CAM-03') return baseClasses + "top-[15%] left-[25%] w-[45%] h-[55%] border-[3px] border-danger";
            if (camId === 'CAM-07') return baseClasses + "top-[30%] left-[30%] w-1/3 h-[45%] border-[3px] border-danger";
            // Default 08 화재
            return baseClasses + "top-[40%] left-[45%] w-[25%] h-[35%] border-[3px] border-danger";
        }
        if (status === 'warning') {
            // Default 연기 (CAM-03)
            return baseClasses + "top-[20%] left-[40%] w-[35%] h-[40%] border-[3px] border-warning";
        }
        return "hidden";
    };

    // --- 시뮬레이터 함수 끝 ---

    // [개별 카메라 컨트롤] 부분 해제 및 로그
    const handleIndividualFalseAlarm = (e, camId) => {
        e.stopPropagation();

        const timeNow = new Date().toLocaleTimeString('ko-KR', { hour12: false });

        // 오탐지 시뮬레이션 동작 중일 때의 특수 피드백 (CAM-01 대상)
        if (isFalseAlarmSim && camId === 'CAM-01') {
            // 특별 토스트 노출
            setToastMessages([{
                id: Date.now(),
                camId: 'SYSTEM', // 특수 팝업이므로 포커싱 막기 위해 시스템 부여
                title: `오탐지 신고 접수 완료`,
                desc: `입력하신 데이터는 AI 학습에 즉시 반영됩니다.`,
                icon: "psychology",
                iconColor: "text-success bg-success/20"
            }]);

            // AI 학습 성공 특별 로그 추가
            setEventLogs(prev => [{
                id: Date.now() + 1,
                time: timeNow,
                type: 'success',
                cam: camId,
                title: `[${camId}] 오탐지 피드백 AI 학습 적용`,
                desc: `가로등 플레어 오인식 패턴 DB 업데이트 완료`
            }, ...prev].slice(0, 50));
        } else {
            // 일반 로그 추가
            setEventLogs(prev => [{
                id: Date.now() + 1,
                time: timeNow,
                type: 'success',
                cam: 'SYSTEM',
                title: `[${camId}] 관제사 오보 확인 완료`,
                desc: `데이터 전송 및 정상 상태 복구`
            }, ...prev].slice(0, 50));
        }

        // 대상 캠 닫기 로직 (토스트 제거 등 포함) -> 실제 오보 신고 버튼
        const updatedGrid = gridCams.map(cam => {
            if (cam.id === camId) {
                return { ...cam, status: 'normal', name: cam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '') };
            }
            return cam;
        });
        setGridCams(updatedGrid);

        // 현재 메시지 목록에서도 제거
        setToastMessages(prev => prev.filter(t => t.camId !== camId));

        // 현재 메인캠 화면이 방금 해제된 캠이라면 업데이트
        if (activeCam.id === camId) {
            setActiveCam({ ...activeCam, status: 'normal', name: activeCam.name.replace(/ \(화재 감지\)| \(연기 감지\)| \(화재 확정\)/g, '') });
        }

        // 위험이나 알람 캠이 남아있는지 확인
        const remainingHazards = updatedGrid.some(cam => cam.status === 'danger' || cam.status === 'warning');
        if (!remainingHazards) {
            setIsAlertActive(false);
            setAiConfidence(8);
            if (isMultiFire) setIsMultiFire(false);
            if (isFalseAlarmSim) setIsFalseAlarmSim(false);
        }
    };

    // 인디케이터 렌더링 헬퍼 함수
    const getStatusIndicator = (status) => {
        switch (status) {
            case 'danger':
                return <span className="size-2 rounded-full bg-[#F44336] animate-fast-pulse"></span>;
            case 'warning':
                return <span className="size-2 rounded-full bg-[#FF9800] animate-pulse"></span>;
            case 'normal':
            default:
                return <span className="size-2 rounded-full bg-[#4CAF50]"></span>;
        }
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
            {isAlertActive && (
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

            <main className={`max-w-[1920px] mx-auto p-6 flex flex-col lg:flex-row gap-6 ${isAlertActive ? 'animate-siren' : ''}`}>
                {/* Main Area Left (75%) */}
                <section className="lg:w-3/4 flex flex-col gap-6">
                    {/* Main Camera / Multi-Fire split view */}
                    {!isMultiFire ? (
                        <div
                            onDoubleClick={() => handleDoubleClick(activeCam)}
                            className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl group border-4 border-slate-700 dark:border-slate-800 transition-all duration-500 cursor-pointer"
                            title="더블클릭하여 전체화면"
                        >
                            {activeCam.isOffline ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 opacity-60 grayscale">
                                    <span className="material-symbols-outlined text-slate-400 text-6xl">videocam_off</span>
                                </div>
                            ) : (
                                <img className="w-full h-full object-cover opacity-90 transition-all" alt="Active Feed" src={activeCam.src} />
                            )}

                            <div className="absolute inset-0 pointer-events-none border border-white/10"></div>

                            {/* 화재 객체 인식 바운딩 박스 오버레이 */}
                            {activeCam.status === 'danger' && !activeCam.isOffline && (
                                <>
                                    <div className={getBoundingBoxStyles(activeCam.id, 'danger')}>
                                        <div className="absolute -top-6 left-0 bg-danger text-white text-xs font-bold px-2 py-0.5 whitespace-nowrap">
                                            Fire: {aiConfidence}%
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                        <div className="flex flex-col items-center justify-center animate-pulse drop-shadow-2xl bg-danger/10 rounded-full p-8 backdrop-blur-sm border-2 border-danger/30 text-danger">
                                            <span className="material-symbols-outlined text-[100px] leading-none text-yellow-400 drop-shadow-[0_0_15px_rgba(255,200,0,0.8)]">warning</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCam.status === 'warning' && !activeCam.isOffline && (
                                <>
                                    <div className={getBoundingBoxStyles(activeCam.id, 'warning')}>
                                        <div className="absolute -top-6 left-0 bg-warning text-white text-xs font-bold px-2 py-0.5 whitespace-nowrap">
                                            Smoke: {aiConfidence}%
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                        <div className="flex flex-col items-center justify-center animate-pulse drop-shadow-2xl bg-warning/10 rounded-full p-8 backdrop-blur-sm border-2 border-warning/30 text-warning">
                                            <span className="material-symbols-outlined text-[100px] leading-none text-orange-400 drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]">warning</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Camera Overlay Info */}
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <span className="bg-black/60 text-white px-3 py-1 rounded-md text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/20">
                                    {getStatusIndicator(activeCam.status)}
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
                    ) : (
                        // 다중 화재 분할 뷰
                        <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-danger transition-all duration-500 flex gap-2 p-2">
                            {/* CAM-03 */}
                            <div
                                onClick={() => handleCamChange(gridCams.find(c => c.id === 'CAM-03'))}
                                onDoubleClick={() => handleDoubleClick(gridCams.find(c => c.id === 'CAM-03'))}
                                className={`flex-1 relative cursor-pointer hover:ring-2 hover:ring-white bg-black rounded-lg overflow-hidden border-2 transition-all duration-300 ${gridCams.find(c => c.id === 'CAM-03')?.status === 'danger' ? 'border-danger shadow-lg shadow-danger/50 animate-pulse' : 'border-success'}`}
                            >
                                <img className="w-full h-full object-cover opacity-90" alt="CAM-03 Fire Feed" src={gridCams.find(c => c.id === 'CAM-03')?.src} />
                                {gridCams.find(c => c.id === 'CAM-03')?.status === 'danger' && (
                                    <>
                                        <div className={getBoundingBoxStyles('CAM-03', 'danger')}>
                                            <div className="absolute -top-6 left-0 bg-danger text-white text-xs font-bold px-2 py-0.5 whitespace-nowrap">
                                                Fire: {aiConfidence}%
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                            <span className="material-symbols-outlined text-[80px] text-yellow-400 drop-shadow-[0_0_15px_rgba(255,200,0,0.8)] animate-pulse">warning</span>
                                        </div>
                                        <div className="absolute top-2 right-2 z-30">
                                            <button
                                                onClick={(e) => handleIndividualFalseAlarm(e, 'CAM-03')}
                                                className="bg-slate-800/90 hover:bg-slate-900 border border-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg backdrop-blur flex items-center gap-1 transition-all active:scale-95 pointer-events-auto"
                                            >
                                                <span className="material-symbols-outlined text-[14px] text-yellow-400">task_alt</span>
                                                오보 신고
                                            </button>
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-2 left-2 flex items-center gap-2">
                                    <span className={`bg-black/60 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border ${gridCams.find(c => c.id === 'CAM-03')?.status === 'danger' ? 'border-danger' : 'border-success'}`}>
                                        <span className={`size-2 rounded-full ${gridCams.find(c => c.id === 'CAM-03')?.status === 'danger' ? 'bg-danger animate-ping' : 'bg-success'}`}></span> 1. CAM-03
                                    </span>
                                </div>
                            </div>
                            {/* CAM-07 */}
                            <div
                                onClick={() => handleCamChange(gridCams.find(c => c.id === 'CAM-07'))}
                                onDoubleClick={() => handleDoubleClick(gridCams.find(c => c.id === 'CAM-07'))}
                                className={`flex-1 relative cursor-pointer hover:ring-2 hover:ring-white bg-black rounded-lg overflow-hidden border-2 transition-all duration-300 ${gridCams.find(c => c.id === 'CAM-07')?.status === 'danger' ? 'border-danger shadow-lg shadow-danger/50 animate-pulse' : 'border-success'}`}
                            >
                                <img className="w-full h-full object-cover opacity-90" alt="CAM-07 Fire Feed" src={gridCams.find(c => c.id === 'CAM-07')?.src} />
                                {gridCams.find(c => c.id === 'CAM-07')?.status === 'danger' && (
                                    <>
                                        <div className={getBoundingBoxStyles('CAM-07', 'danger')}>
                                            <div className="absolute -top-6 left-0 bg-danger text-white text-xs font-bold px-2 py-0.5 whitespace-nowrap">
                                                Fire: {aiConfidence}%
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                            <span className="material-symbols-outlined text-[80px] text-yellow-400 drop-shadow-[0_0_15px_rgba(255,200,0,0.8)] animate-pulse">warning</span>
                                        </div>
                                        <div className="absolute top-2 right-2 z-30">
                                            <button
                                                onClick={(e) => handleIndividualFalseAlarm(e, 'CAM-07')}
                                                className="bg-slate-800/90 hover:bg-slate-900 border border-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg backdrop-blur flex items-center gap-1 transition-all active:scale-95 pointer-events-auto"
                                            >
                                                <span className="material-symbols-outlined text-[14px] text-yellow-400">task_alt</span>
                                                오보 신고
                                            </button>
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-2 left-2 flex items-center gap-2">
                                    <span className={`bg-black/60 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border ${gridCams.find(c => c.id === 'CAM-07')?.status === 'danger' ? 'border-danger' : 'border-success'}`}>
                                        <span className={`size-2 rounded-full ${gridCams.find(c => c.id === 'CAM-07')?.status === 'danger' ? 'bg-danger animate-ping' : 'bg-success'}`}></span> 2. CAM-07
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid of Smaller Previews */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {gridCams.map((cam) => (
                            <div
                                key={cam.id}
                                onClick={() => handleCamChange(cam)}
                                onDoubleClick={() => handleDoubleClick(cam)}
                                className={`relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-all ${cam.isOffline ? 'opacity-60 grayscale' : ''} ${cam.status === 'danger' ? 'ring-2 ring-danger shadow-lg shadow-danger/50' : cam.status === 'warning' ? 'ring-2 ring-warning shadow-lg shadow-warning/50' : ''}`}
                                title={`클릭: 메인뷰 전환 / 더블클릭: 전체화면 (${cam.name})`}
                            >
                                {cam.isOffline ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                        <span className="material-symbols-outlined text-slate-400">videocam_off</span>
                                    </div>
                                ) : (
                                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={cam.name} src={cam.src} />
                                )}
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    <span className="text-[10px] font-bold text-white flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                        {getStatusIndicator(cam.status)}
                                        {cam.id}
                                        {cam.status === 'danger' && <span className="material-symbols-outlined text-[12px] text-danger ml-1">warning</span>}
                                    </span>
                                    <span className="text-[10px] font-medium text-white/90 bg-black/40 px-1.5 py-0.5 rounded w-fit backdrop-blur-sm">{cam.name}</span>
                                </div>
                                <div className="absolute bottom-2 right-2 z-10">
                                    <span className="text-[10px] font-mono text-white/90 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">{cam.time}</span>
                                </div>
                                {cam.status === 'danger' && (
                                    <>
                                        <div className="absolute inset-0 pointer-events-none bg-danger/10 animate-fast-pulse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="material-symbols-outlined text-yellow-400 text-6xl drop-shadow-[0_0_10px_rgba(255,200,0,0.8)] animate-pulse">warning</span>
                                        </div>
                                    </>
                                )}
                                {cam.status === 'warning' && (
                                    <>
                                        <div className="absolute inset-0 pointer-events-none bg-warning/10 animate-pulse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="material-symbols-outlined text-orange-400 text-6xl drop-shadow-[0_0_10px_rgba(255,100,0,0.8)] animate-pulse">warning</span>
                                        </div>
                                    </>
                                )}
                                {cam.status !== 'normal' && (
                                    <div className="absolute top-2 right-2 z-30">
                                        <button
                                            onClick={(e) => handleIndividualFalseAlarm(e, cam.id)}
                                            className="bg-slate-800/90 hover:bg-slate-900 border border-slate-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg backdrop-blur flex items-center gap-1 transition-all active:scale-95 pointer-events-auto"
                                        >
                                            <span className="material-symbols-outlined text-[12px] text-yellow-400">task_alt</span>
                                            오보 신고
                                        </button>
                                    </div>
                                )}
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
                                    <circle className="stroke-primary transition-all duration-1000 ease-in-out" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${aiConfidence}, 100`} strokeLinecap="round" strokeWidth="3"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white transition-all duration-500">{aiConfidence}%</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">신뢰도</span>
                                </div>
                            </div>
                        </div>

                        {/* Window Frame Analysis */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">5초 윈도우 프레임 분석</p>
                                <p className={`text-[10px] font-bold ${(activeCam.status === 'danger' || isAlertActive) ? 'text-danger' : 'text-primary'}`}>
                                    {(activeCam.status === 'danger' || isAlertActive) ? 'HAZARD DETECTED' : 'ALL CLEAR'}
                                </p>
                            </div>
                            <div className="flex gap-1.5 h-8">
                                {Array.from({ length: 10 }).map((_, idx) => {
                                    // Make 7/10 bars red to show detection
                                    const isRed = (activeCam.status === 'danger' || isAlertActive) && idx >= 3;
                                    const bgColor = isRed ? 'bg-danger' : 'bg-success';
                                    const opacity = `opacity-${(idx + 1) * 10}`;

                                    return <div key={idx} className={`flex-1 rounded-sm ${bgColor} ${isRed ? 'animate-pulse' : opacity}`}></div>;
                                })}
                            </div>
                        </div>

                        {/* Emergency Test Button / Dismiss Alert Button */}
                        {(isAlertActive || activeCam.status !== 'normal') ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleIndividualFalseAlarm(e, activeCam.id)}
                                    className={`w-full py-4 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-lg transition-all active:scale-95 bg-slate-800 hover:bg-slate-900 border-2 border-slate-700 shadow-slate-900/20 group relative overflow-hidden`}
                                >
                                    <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
                                    <span className="material-symbols-outlined text-xl text-yellow-400">task_alt</span>
                                    <span className="text-sm">현재 화면({activeCam.id}) 오탐지 확정</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleSimFire}
                                className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 bg-danger hover:bg-danger/90 shadow-danger/20`}
                            >
                                <span className="material-symbols-outlined">report_problem</span>
                                화재 경보 시연 트리거
                            </button>
                        )}
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
                            {eventLogs.map(log => (
                                <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 shadow-sm
                                    ${log.type === 'danger' ? 'bg-danger/5 border-danger' :
                                        log.type === 'warning' ? 'bg-warning/10 border-warning' :
                                            log.type === 'primary' ? 'bg-primary/5 border-primary' :
                                                'bg-success/5 border-success'} transition-all`}
                                >
                                    <span className={`text-[10px] font-mono font-bold mt-0.5 whitespace-nowrap
                                        ${log.type === 'danger' ? 'text-danger' :
                                            log.type === 'warning' ? 'text-warning' :
                                                log.type === 'primary' ? 'text-primary' : 'text-success'}`}>
                                        [{log.time}]
                                    </span>
                                    <div>
                                        <p className={`text-xs font-bold 
                                            ${log.type === 'danger' ? 'text-danger' : log.type === 'warning' ? 'text-warning' : 'text-success'}`}>
                                            {log.title}
                                        </p>
                                        <p className="text-[10px] text-slate-500">{log.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>

            {/* Bottom-right Dynamic Toast Alert Array */}
            <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
                {toastMessages.map((toast) => (
                    <div
                        key={toast.id}
                        className="bg-white dark:bg-slate-800 border-l-4 border-l-current rounded-xl shadow-2xl p-4 w-80 animate-bounce cursor-pointer hover:scale-[1.02] transition-transform"
                        style={{ borderColor: toast.title.includes('위험') || toast.title.includes('긴급') ? '#F44336' : '#FF9800' }}
                        onClick={() => {
                            // 토스트 클릭 시 해당 캠 화면을 메인에 포커싱 후 전체화면 모드 진입
                            const target = gridCams.find(c => c.id === toast.camId);
                            if (target) {
                                handleCamChange(target);
                                setFullscreenCam(target);
                                setIsFullscreen(true);
                            }
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className={`flex items-center justify-center size-8 rounded-full ${toast.iconColor}`}>
                                <span className="material-symbols-outlined">{toast.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{toast.title}</h4>
                                <p className="text-xs text-slate-500 break-words">{toast.desc}</p>
                            </div>
                            <button className="text-slate-400 hover:text-danger" onClick={(e) => {
                                e.stopPropagation();
                                setToastMessages(prev => prev.filter(t => t.id !== toast.id));
                            }}>
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>

                    </div>
                ))}
            </div >

            <footer className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pb-24">
                <p>© 2023 E-gle Eye Security Systems. All Rights Reserved.</p>
                <div className="flex gap-4">
                    <a className="hover:text-primary" href="#">개인정보처리방침</a>
                    <a className="hover:text-primary" href="#">시스템 이용약관</a>
                    <a className="hover:text-primary" href="#">고객센터</a>
                </div>
            </footer>

            {/* 🔥 전체화면 모달 오버레이 🔥 */}
            {
                isFullscreen && fullscreenCam && (
                    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center backdrop-blur-md">
                        <div className="absolute top-6 right-6 z-10 flex gap-4">
                            {fullscreenCam.status === 'danger' && (
                                <div className="bg-danger text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-danger/50 animate-pulse border-2 border-white/20">
                                    <span className="material-symbols-outlined">warning</span> 위험 상황 감지
                                </div>
                            )}
                            <button
                                onClick={() => handleDoubleClick()}
                                className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all border border-white/30"
                            >
                                <span className="material-symbols-outlined">close_fullscreen</span>
                                전체화면 종료 (ESC)
                            </button>
                        </div>

                        <div
                            onDoubleClick={() => handleDoubleClick()}
                            className="w-full aspect-video mx-auto max-h-[90vh] bg-black relative cursor-pointer group shadow-2xl border-2 border-white/10 rounded-xl overflow-hidden"
                        >
                            <img className="w-full h-full object-cover" alt="Fullscreen Feed" src={fullscreenCam.src} />

                            {/* Information Overlay in Fullscreen */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className="bg-black/60 text-white px-4 py-2 rounded-lg text-lg font-bold backdrop-blur-md flex items-center gap-3 border border-white/20">
                                    {getStatusIndicator(fullscreenCam.status)}
                                    LIVE: {fullscreenCam.id} - {fullscreenCam.name}
                                </span>
                                <span className="bg-black/60 text-white px-3 py-1 w-fit rounded-lg text-sm font-mono backdrop-blur-md border border-white/20">
                                    {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
                                </span>
                            </div>

                            {/* Bounding Box if danger/warning in fullscreen */}
                            {fullscreenCam.status === 'danger' && (
                                <div className={getBoundingBoxStyles(fullscreenCam.id, 'danger')}>
                                    <div className="absolute -top-10 left-0 bg-danger text-white text-lg font-bold px-4 py-1 whitespace-nowrap">
                                        Fire: {aiConfidence}%
                                    </div>
                                </div>
                            )}
                            {fullscreenCam.status === 'warning' && (
                                <div className={getBoundingBoxStyles(fullscreenCam.id, 'warning')}>
                                    <div className="absolute -top-10 left-0 bg-warning text-white text-lg font-bold px-4 py-1 whitespace-nowrap">
                                        Smoke: {aiConfidence}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* 🔥 플로팅 시연용 컨트롤러 (화면 하단 중앙 고정) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/30 dark:border-slate-700 rounded-full px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary text-white size-8 rounded-full shadow-inner mr-2">
                    <span className="material-symbols-outlined text-[16px]">science</span>
                </div>
                <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mr-1"></div>

                <button onClick={handleSimNormal} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold transition-all hover:-translate-y-0.5">
                    🟢 정상 모드
                </button>
                <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

                <button onClick={handleSimSmoke} className="px-4 py-2 bg-warning/10 hover:bg-warning/20 text-warning border border-warning/30 rounded-full text-xs font-bold transition-all hover:-translate-y-0.5">
                    🟡 연기 감지
                </button>
                <button onClick={handleSimFire} className="px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 rounded-full text-xs font-bold transition-all hover:-translate-y-0.5">
                    🔴 화재 발생
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5"></div>
                <button onClick={handleSimFalseAlarm} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 rounded-full text-xs font-bold transition-all hover:-translate-y-0.5">
                    ❓ 오탐지
                </button>
                <button onClick={handleSimMultiFire} className="px-4 py-2 bg-black border border-danger text-danger hover:bg-danger hover:text-white rounded-full text-xs font-black uppercase transition-all shadow-lg animate-pulse hover:-translate-y-0.5">
                    다중 화재
                </button>
            </div>
        </div >
    );
};

export default App;
