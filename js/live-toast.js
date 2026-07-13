/* ==========================================================
   live-toast.js — 왼쪽 아래 실시간 문의 알림 팝업
   - 멘트는 "문의 접수" 하나로 고정 (과장 문구 제거)
   - 영업시간(11시~20시) 동안 랜덤 간격으로 출력
   ========================================================== */
(function () {
    'use strict';

    const data = window.GOODPHONE;
    const toast = document.getElementById('live-toast');
    const toastText = document.getElementById('toast-text');
    if (!data || !toast || !toastText) return;

    // 알림 애니메이션(5초)이 끝난 뒤 다음 알림까지의 대기 시간 범위
    const DELAY_MIN_MS = 8000;   // 최소 8초
    const DELAY_MAX_MS = 25000;  // 최대 25초

    function getRandomDelay() {
        return DELAY_MIN_MS + Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS));
    }

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function isBusinessHours() {
        const hour = new Date().getHours();
        return hour >= 11 && hour < 20;
    }

    function triggerLiveUpdate() {
        if (isBusinessHours()) {
            const store = pickRandom(data.stores);
            const product = pickRandom(data.mainProducts);

            toastText.innerHTML =
                '<b>[' + store + ']</b> ' +
                '<span class="text-amber-400 font-bold">' + product + '</span> ' +
                '문의가 접수되었습니다';

            toast.classList.remove('toast-active');
            void toast.offsetWidth; // 애니메이션 재시작을 위한 리플로우
            toast.classList.add('toast-active');
        }

        setTimeout(triggerLiveUpdate, getRandomDelay());
    }

    setTimeout(triggerLiveUpdate, 2000);
})();
