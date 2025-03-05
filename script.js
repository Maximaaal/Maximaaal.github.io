$(window).on('load', function() {

    $('#preloader').fadeOut(500);
    
    setTimeout(function() {
      $('.fade-in').each(function(index) {
        var $this = $(this);
        setTimeout(function() {
          $this.addClass('active');
        }, 150 * index);
      });
    }, 300);
    
    $(window).on('scroll', function() {
      $('.fade-in').each(function() {
        var elementTop = $(this).offset().top;
        var elementVisible = 150;
        var windowHeight = $(window).height();
        var scrollY = $(window).scrollTop();
        
        if (elementTop < (windowHeight + scrollY - elementVisible)) {
          $(this).addClass('active');
        }
      });
    });
    
    $('.project').hover(
      function() {
        $(this).find('.project-image').css('opacity', '0.9');
        $(this).find('.project-title').css('opacity', '1');
      },
      function() {
        $(this).find('.project-image').css('opacity', '1');
        $(this).find('.project-title').css('opacity', '0.9');
      }
    );
  });