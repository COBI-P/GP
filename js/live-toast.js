/* ==========================================================
   live-toast.js — 왼쪽 아래 실시간 상담 요청 팝업
   영업시간(11시~20시) 동안 30초 정각 단위로 전국 동기화 출력
   ========================================================== */
(function () {
    'use strict';

    const data = window.GOODPHONE;
    const toast = document.getElementById('live-toast');
    const toastText = document.getElementById('toast-text');
    if (!data || !toast || !toastText) return;

    // 🤝 [전국 동기화] 30초 정각 단위 타임 스탬프 계산
    function getNextDelay() {
        const currentSeconds = new Date().getSeconds();
        return (30 - (currentSeconds % 30)) * 1000;
    }

    function triggerLiveUpdate() {
        const checkTime = new Date();
        const currentHour = checkTime.getHours();
        const currentMinute = checkTime.getMinutes();

        if (currentHour >= 11 && currentHour < 20) {
            const contentSeed = currentHour + currentMinute + (checkTime.getSeconds() >= 30 ? 50 : 20);

            const selectedProduct = data.mainProducts[contentSeed % data.mainProducts.length];
            const randomStore = data.stores[(contentSeed * 2) % data.stores.length];
            const consultType = data.consultTypes[(contentSeed * 3) % data.consultTypes.length];

            toastText.innerHTML =
                '방금 전 <b>[' + randomStore + ']</b>에서 ' +
                '<span class="text-amber-400 font-bold">' + selectedProduct + '</span> ' +
                consultType;

            toast.classList.remove('toast-active');
            void toast.offsetWidth; // 애니메이션 재시작을 위한 리플로우
            toast.classList.add('toast-active');
        }

        setTimeout(triggerLiveUpdate, getNextDelay());
    }

    setTimeout(triggerLiveUpdate, 2000);
})();
