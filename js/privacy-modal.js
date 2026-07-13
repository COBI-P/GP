/* ==========================================================
   privacy-modal.js — 개인정보처리방침 모달 열기/닫기
   (열기/닫기 버튼, 배경 클릭, ESC 키 모두 지원)
   ========================================================== */
(function () {
    'use strict';

    const modal = document.getElementById('privacy-modal');
    const content = document.getElementById('privacy-content');
    if (!modal || !content) return;

    let isOpen = false;

    function openPrivacyModal() {
        isOpen = true;
        modal.style.display = 'flex';

        setTimeout(function () {
            modal.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
            modal.classList.add('opacity-100');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);

        document.body.style.overflow = 'hidden';
    }

    function closePrivacyModal() {
        isOpen = false;
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        document.body.style.overflow = '';

        setTimeout(function () {
            if (!isOpen) {
                modal.classList.add('invisible');
                modal.style.display = 'none';
            }
        }, 300);
    }

    // data-privacy 속성이 붙은 요소에 자동으로 이벤트 연결
    document.querySelectorAll('[data-privacy="open"]').forEach(function (el) {
        el.addEventListener('click', openPrivacyModal);
    });
    document.querySelectorAll('[data-privacy="close"]').forEach(function (el) {
        el.addEventListener('click', closePrivacyModal);
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closePrivacyModal();
    });
})();
