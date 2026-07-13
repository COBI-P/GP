/* ==========================================================
   date-title.js — 시세표 타이틀에 오늘 날짜 자동 반영
   ========================================================== */
(function () {
    'use strict';

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const dateTitleElem = document.getElementById('sise-auto-date-title');
    if (dateTitleElem) {
        dateTitleElem.textContent = `${year}년 ${month}월 ${day}일 굳폰 특가표`;
    }
})();
