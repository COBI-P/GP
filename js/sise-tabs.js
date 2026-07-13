/* ==========================================================
   sise-tabs.js — 수도권/충청권 시세표 탭 전환 + 이미지 자동 맞춤
   - 이미지 원본 크기가 제각각이어도 비율 그대로 딱 맞게 출력
   - 로딩 스피너 / 로드 실패 안내 처리
   ========================================================== */
(function () {
    'use strict';

    const TAB_ACTIVE   = 'py-2.5 text-xs sm:text-sm font-bold rounded-lg text-center transition bg-amber-500 text-white shadow-sm';
    const TAB_INACTIVE = 'py-2.5 text-xs sm:text-sm font-bold rounded-lg text-center transition text-gray-500 hover:text-gray-900';

    const tabs = {
        sudo:  { btn: document.getElementById('tab-sudo'),  img: document.getElementById('img-sise-sudo')  },
        chung: { btn: document.getElementById('tab-chung'), img: document.getElementById('img-sise-chung') }
    };
    const loader   = document.getElementById('sise-loader');
    const errorBox = document.getElementById('sise-error');

    if (!tabs.sudo.btn || !tabs.chung.btn || !tabs.sudo.img || !tabs.chung.img) return;

    let current = 'sudo';

    // 🖼️ 이미지 원본 비율을 읽어 컨테이너에 그대로 적용
    //    → 탭 전환 시 레이아웃이 튀지 않고, 어떤 크기의 시세표를 올려도 딱 맞음
    function prepareImage(img) {
        function applyRatio() {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                img.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
                img.classList.add('is-loaded');
                img.dataset.state = 'loaded';
                refreshLoader();
            }
        }
        function markError() {
            img.dataset.state = 'error';
            refreshLoader();
        }

        if (img.complete && img.naturalWidth > 0) {
            applyRatio();
        } else if (img.complete) {
            markError();
        } else {
            img.addEventListener('load', applyRatio);
            img.addEventListener('error', markError);
        }
    }

    // ⏳ 현재 보이는 이미지 상태에 맞춰 스피너/에러 표시 갱신
    function refreshLoader() {
        const img = tabs[current].img;
        const state = img.dataset.state || 'loading';

        if (loader)   loader.classList.toggle('hidden', state !== 'loading');
        if (errorBox) errorBox.classList.toggle('hidden', state !== 'error');
        img.classList.toggle('hidden', state === 'error');
    }

    // 📊 탭 전환
    function switchSiseTab(region) {
        if (!tabs[region] || region === current) return;
        current = region;

        Object.keys(tabs).forEach(function (key) {
            const isActive = key === region;
            tabs[key].btn.className = isActive ? TAB_ACTIVE : TAB_INACTIVE;
            tabs[key].btn.setAttribute('aria-selected', String(isActive));
            tabs[key].img.classList.toggle('hidden', !isActive);
        });

        refreshLoader();
    }

    // 버튼 이벤트 연결 (data-region 속성 기반)
    Object.keys(tabs).forEach(function (key) {
        tabs[key].btn.addEventListener('click', function () {
            switchSiseTab(key);
        });
    });

    prepareImage(tabs.sudo.img);
    prepareImage(tabs.chung.img);
    refreshLoader();
})();
