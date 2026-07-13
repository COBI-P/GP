/* ==========================================================
   live-toast.js — 왼쪽 아래 실시간 문의 알림 팝업
   - 멘트는 "문의 접수" 하나로 고정
   - 영업시간(11시~20시) 동안 랜덤 간격으로 출력
   - 클릭 시 해당 매장 카카오 채널로 연결
   - X 버튼으로 닫으면 세션 동안 다시 뜨지 않음
   - 반복될수록 간격이 점점 늘어나고, 세션당 최대 횟수 제한
   - 직전과 같은 매장/기종은 연속으로 나오지 않음
   - 탭이 백그라운드일 땐 알림을 띄우지 않음
   ========================================================== */
(function () {
    'use strict';

    const data = window.GOODPHONE;
    const toast = document.getElementById('live-toast');
    const toastText = document.getElementById('toast-text');
    const closeBtn = document.getElementById('toast-close');
    if (!data || !toast || !toastText) return;

    const DISMISS_KEY = 'gp-toast-dismissed';

    // 사용자가 이번 방문에서 이미 닫았으면 아예 시작하지 않음
    try {
        if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    } catch (err) { /* 시크릿 모드 등 sessionStorage 불가 환경은 무시 */ }

    const FIRST_DELAY_MS = 8000;    // 첫 알림: 페이지 진입 8초 후
    const DELAY_MIN_MS = 8000;      // 이후 알림 최소 간격
    const DELAY_MAX_MS = 20000;     // 이후 알림 최대 간격
    const BACKOFF_RATE = 1.3;       // 알림이 뜰 때마다 간격을 30%씩 늘림 (피로감 방지)
    const MAX_SHOWS_PER_SESSION = 10; // 세션당 최대 노출 횟수
    const TOAST_DURATION_MS = 5000; // animations.css slideUpMobile 재생 시간과 동일

    let showCount = 0;
    let backoff = 1;
    let lastStore = null;
    let lastProduct = null;
    let currentLink = data.defaultKakao;
    let hideTimer = null;
    let dismissed = false;

    // 직전 값과 같지 않은 항목을 랜덤으로 선택
    function pickRandom(list, exclude) {
        if (list.length < 2) return list[0];
        let item;
        do {
            item = list[Math.floor(Math.random() * list.length)];
        } while (item === exclude);
        return item;
    }

    function getNextDelay() {
        const base = DELAY_MIN_MS + Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS);
        return Math.floor(base * backoff);
    }

    function isBusinessHours() {
        const hour = new Date().getHours();
        return hour >= 11 && hour < 20;
    }

    function hideToast() {
        toast.classList.remove('toast-active');
    }

    function showToast() {
        const store = pickRandom(data.stores, lastStore);
        const product = pickRandom(data.mainProducts, lastProduct);
        lastStore = store;
        lastProduct = product;
        currentLink = store.kakao || data.defaultKakao;

        toastText.innerHTML =
            '<b>[' + store.name + ']</b> ' +
            '<span class="text-amber-400 font-bold">' + product + '</span> ' +
            '문의가 접수되었습니다';

        toast.classList.remove('toast-active');
        void toast.offsetWidth; // 애니메이션 재시작을 위한 리플로우
        toast.classList.add('toast-active');

        // prefers-reduced-motion 환경(애니메이션 없음)에서도 자동으로 사라지도록 보장
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hideToast, TOAST_DURATION_MS);

        showCount++;
        backoff *= BACKOFF_RATE;
    }

    function scheduleNext(delay) {
        setTimeout(function () {
            if (dismissed || showCount >= MAX_SHOWS_PER_SESSION) return;

            // 백그라운드 탭이거나 영업시간 외에는 띄우지 않고 다음 기회로 미룸
            if (!document.hidden && isBusinessHours()) {
                showToast();
            }

            if (showCount < MAX_SHOWS_PER_SESSION) {
                scheduleNext(getNextDelay());
            }
        }, delay);
    }

    // 🖱️ 알림 클릭 → 해당 매장 카카오 채널로 이동
    toast.addEventListener('click', function () {
        window.open(currentLink, '_blank', 'noopener');
    });

    // ❌ 닫기 버튼 → 즉시 숨기고 세션 동안 다시 띄우지 않음
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation(); // 카카오 채널로 이동하는 클릭과 분리
            dismissed = true;
            clearTimeout(hideTimer);
            hideToast();
            try {
                sessionStorage.setItem(DISMISS_KEY, '1');
            } catch (err) { /* 저장 불가 환경이면 이번 페이지에서만 중단 */ }
        });
    }

    scheduleNext(FIRST_DELAY_MS);
})();
