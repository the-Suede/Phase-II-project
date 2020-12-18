
var swiper = new Swiper('.swiper-container', {
    loop: true, // 循环
    autoplay:true,//轮播
    autoplay: {
        delay: 2000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
    },
    navigation: {//左右切换
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {//分页按钮
        el: '.swiper-pagination',
      }
  });
