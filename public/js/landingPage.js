// scroll function 
$(window).scroll( () => {
    var scroll_position = $(this).scrollTop()/2;
    $('section').css({
        'background-position-x' : - scroll_position + 'px',
})
})


// animation
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml6 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
  .add({
    targets: '.ml6 .letter',
    translateY: ["1.1em", 0],
    translateZ: 0,
    duration: 750,
    delay: (el, i) => 50 * i
  })

  // hide animation
 
  const hideAnimation = () => {
    if( $("#mainNav").offset().top > 1380) {
      $(".arrow").css('display', 'none');
    }
    if( $("#mainNav").offset().top < 1380) {
      $(".arrow").css('display', 'inline-block');
    }
  }
  hideAnimation();

  $(window).scroll(hideAnimation);
