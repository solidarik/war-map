var box;

$(document).ready(function () {
    $('#wrapper').scrollTo($('#box1'), 800);

    $(".content").resizable({ ghost: true });

    $(window).bind('resize', function (event) {
        window.resizeEvt;
        $(window).resize(function () {
            clearTimeout(window.resizeEvt);
            window.resizeEvt = setTimeout(function () {
                if (box !== null) {
                    $('#wrapper').scrollTo(box, 1);
                    //box = null;
                }
            }, 250);
        });
    });

//    $(window).bind('resize', function (event) {
//        if (!$(event.target).hasClass('ui-resizable')) {
//            if (box !== null) {
//                $('#wrapper').scrollTo(box, 800);
//                box = null;
//            }
//
//        }
//    });

    $('a.link').click(function () {
        box = $(this).attr('href');
        $('#wrapper').scrollTo($(this).attr('href'), 800);
        return false;
    });
});
