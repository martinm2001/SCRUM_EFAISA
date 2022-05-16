$(document).ready(function () {
    $("#virtual-keyboard a").on('click', function () {
        if ($(this).attr('data') == 'DEL') {
            board_text = $('textarea.board').text();
            board_text = board_text.substring(0, board_text.length - 1);
            $('textarea.board').text(board_text);
        } else {
            $('textarea.board').text($('textarea.board').text() + $(this).attr('data'));
        }
    });
});