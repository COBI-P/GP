/* ==========================================================
   config.js — 사이트 전역 데이터 (매장 / 상품)
   다른 스크립트보다 먼저 로드되어야 함
   ========================================================== */
window.GOODPHONE = {
    // 공식 카카오 채널 (매장별 채널이 없을 때 기본값)
    defaultKakao: "http://pf.kakao.com/_QxeLdn",

    // 매장 목록 + 매장별 카카오 상담 채널 (매장 카드의 '실시간문의' 링크와 동일)
    stores: [
        { name: "창동점",   kakao: "http://pf.kakao.com/_HTUPn/chat" },
        { name: "DMC점",    kakao: "http://pf.kakao.com/_jJEcG/chat" },
        { name: "왕십리점", kakao: "http://pf.kakao.com/_QxeLdn" },
        { name: "가산점",   kakao: "http://pf.kakao.com/_QxeLdn" },
        { name: "다산점",   kakao: "http://pf.kakao.com/_QxeLdn" },
        { name: "검단점",   kakao: "http://pf.kakao.com/_YJYVX/chat" },
        { name: "세종점",   kakao: "http://pf.kakao.com/_xdbGxkG/chat" },
        { name: "청주점",   kakao: "http://pf.kakao.com/_NJvin/chat" },
        { name: "아산점",   kakao: "http://pf.kakao.com/_qJxfjn/chat" }
    ],

    mainProducts: [
        "S26", "S26", "S26+", "S26 울트라", "S26 울트라 512G",
        "아이폰17", "아이폰17", "아이폰17 프로", "아이폰17 프로맥스", "아이폰 에어",
        "Z플립7", "Z폴드7", "갤럭시 A17"
    ]
};
