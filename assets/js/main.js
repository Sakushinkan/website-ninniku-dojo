$(document).on('click', '.navbar-toggler', function() {
    if (!$(this).hasClass('navbar-toggler')) { // changing page section
        preserveAndAddQueryParams(this);
        navbarResetAndScrollUp();
    }
    
    $('.navbar-toggler').trigger('classChanged');
});

function animateNavbarWith(obj, img) {
    $(obj).children('img').addClass('rotate');
        
    setTimeout(function() {
        $('.navbar-toggler').children('img').attr('src', img);
    }, 125); // ms
}

$(document).on('animationend', '.navbar-toggler > img', function() {
    $(this).removeClass('rotate');
});

$(document).on('classChanged', '.navbar-toggler', function() {
    if ($(this).hasClass('collapsed')) {
        animateNavbarWith(this, 'assets/img/hamburger.png');
    } else {
        animateNavbarWith(this, 'assets/img/x-icon.png');
    }
});

$(document).on("click", ".faq-item", function() {
    $('.faq-answer').not($(this).next()).slideUp(300);
    $('.faq-item').not($(this)).removeClass('faq-open');

    $(this).next('.faq-answer').slideToggle(300);
    $(this).toggleClass('faq-open');
});