var activeBox = 9;
var markedMaize = [
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']
];
markedBox = ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'];
var snap;
declareOnce = true;
$(document).ready(function () {
    var name = localStorage.getItem('name');
    var maize = new Array();
    var current;
    var room = localStorage.getItem('roomId').substr(0, 3) + '-' + localStorage.getItem('roomId').substr(3, 6);
    $('#room_code').html(`${room}&nbsp;&nbsp;<span class="badge success"><label for="modal-2"><i class="far fa-comment-dots"></i></label></span>`);
    firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).on('value', function (snapshot) {
        if (snapshot.val()) {
            snap = snapshot.toJSON();
            if (snap.current == snap.host) {
                $('#players').html(`<input id="tab0" type="radio" name="tabs" checked><label for="tab0">${snap.host}</label>
                <input id="tab1" type="radio" name="tabs"><label for="tab1">${snap.player}</label>`);
            } else {
                $('#players').html(`<input id="tab0" type="radio" name="tabs"><label for="tab0">${snap.host}</label>
                <input id="tab1" type="radio" name="tabs" checked><label for="tab1">${snap.player}</label>`);
            }
            maize = snap.maize;
            if (Object.keys(snap).includes('markedMaize')) {
                markedMaize = snap.markedMaize;
                activeBox = snap.activeBox;
                $('.border-dashed').removeClass('border-secondary', 'border-thick').addClass('border');
                for (var i = 0; i <= 8; i++) {
                    for (var j = 0; j <= 8; j++) {
                        if (markedMaize[i][j] == 'O' || markedMaize[i][j] == 'X') {
                            $(`*[data-position="${i},${j}"]`).text(markedMaize[i][j]);
                        }
                    }
                }
                check(snap.markedMaize);
            }
            current = snap.current;
            if (Object.keys(snap).includes('checked')) {
                markedBox = snap.checked.markedBox;
                win = 'N';
                if (snap.checked.markedBox[0] == snap.checked.markedBox[1] && snap.checked.markedBox[1] == snap.checked.markedBox[2]) {
                    win = snap.checked.markedBox[1];
                } else if (snap.checked.markedBox[0] == snap.checked.markedBox[3] && snap.checked.markedBox[3] == snap.checked.markedBox[6]) {
                    win = snap.checked.markedBox[3];
                } else if (snap.checked.markedBox[0] == snap.checked.markedBox[4] && snap.checked.markedBox[4] == snap.checked.markedBox[8]) {
                    win = snap.checked.markedBox[4];
                } else if (snap.checked.markedBox[1] == snap.checked.markedBox[4] && snap.checked.markedBox[4] == snap.checked.markedBox[7]) {
                    win = snap.checked.markedBox[4];
                } else if (snap.checked.markedBox[2] == snap.checked.markedBox[5] && snap.checked.markedBox[5] == snap.checked.markedBox[8]) {
                    win = snap.checked.markedBox[5];
                } else if (snap.checked.markedBox[2] == snap.checked.markedBox[4] && snap.checked.markedBox[4] == snap.checked.markedBox[6]) {
                    win = snap.checked.markedBox[4];
                } else if (snap.checked.markedBox[3] == snap.checked.markedBox[4] && snap.checked.markedBox[4] == snap.checked.markedBox[5]) {
                    win = snap.checked.markedBox[4];
                } else if (snap.checked.markedBox[6] == snap.checked.markedBox[7] && snap.checked.markedBox[7] == snap.checked.markedBox[8]) {
                    win = snap.checked.markedBox[7];
                } else if (snap.checked.markedBox[0] == snap.checked.markedBox[1] && snap.checked.markedBox[1] == snap.checked.markedBox[2]) {
                    win = snap.checked.markedBox[1];
                }
                if (declareOnce && win != 'N') {
                    declareOnce = false;
                    pop('Yo..Ho..!!', '', `${(win == 'X') ? snap.player : snap.host} won the Ultimate Match!!`);
                } else if (declareOnce && snap.checked.markedBox[0] != 'N' && snap.checked.markedBox[1] != 'N' && snap.checked.markedBox[2] != 'N' && snap.checked.markedBox[3] != 'N' && snap.checked.markedBox[4] != 'N' && snap.checked.markedBox[5] != 'N' && snap.checked.markedBox[6] != 'N' && snap.checked.markedBox[7] != 'N' && snap.checked.markedBox[8] != 'N') {
                    declareOnce = false;
                    pop('Yo..Yo..!!', '', `Draw Match!!`);
                }
                activeBox = (markedBox[activeBox] == 'N') ? activeBox : 9;
            }
            $('#' + activeBox).removeClass('border').addClass('border-secondary', ' border-thick');
        }
    });
    $(document).on('click', '.child', function () {
        pos = $(this).attr("data-position").split(',');
        if (current == name && (maize[pos[0]][pos[1]] && (activeBox == 9 || activeBox == pos[0])) && markedBox[pos[0]] == 'N') {
            $('.border-dashed').removeClass('border-secondary', 'border-thick').addClass('border');
            marker = (snap.host == name) ? 'O' : 'X';
            $(this).text(marker);
            activeBox = (markedBox[pos[1]] == 'N') ? pos[1] : 9;
            maize[pos[0]][pos[1]] = false;
            markedMaize[pos[0]][pos[1]] = marker;
            firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
                activeBox: activeBox,
                current: (snap.host == name) ? snap.player : snap.host,
                maize: maize,
                markedMaize: markedMaize
            });
        } else {
            window.navigator.vibrate(200);
        }
    });
    function check(maize) {
        for (e = 0; e <= 8; e++) {
            var matched = false;
            win = 'N';
            subMaize = maize[e];
            filled = true;
            for (var i = 0; i <= 8; i++) {
                if (subMaize[i] != 'O' && subMaize[i] != 'X') {
                    filled = false;
                }
            }
            if (filled) {
                win = 'V';
                matched = true;
            }
            for (var i = 0; i <= 6; i += 3) {
                if (subMaize[i] == subMaize[i + 1] && subMaize[i] == subMaize[i + 2] && subMaize[i] != 'N') {
                    win = subMaize[i];
                    matched = true;
                }
            }
            for (var i = 0; i <= 2; i++) {
                if (subMaize[i] == subMaize[i + 3] && subMaize[i] == subMaize[i + 6] && subMaize[i] != 'N') {
                    win = subMaize[i];
                    matched = true;
                }
            }
            if (((subMaize[0] == subMaize[4] && subMaize[0] == subMaize[8]) ||
                (subMaize[2] == subMaize[4] && subMaize[2] == subMaize[6])) && subMaize[4] != 'N') {
                win = subMaize[4];
                matched = true;
            }
            if (matched) {
                if (win == 'X') {
                    $('#' + e).attr('style', 'background-color: tomato');
                } else if (win == 'O') {
                    $('#' + e).attr('style', 'background-color: aquamarine');
                }
                markedBox[e] = win;
                firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/checked`).update({
                    markedBox: markedBox
                });
            }
        }
    }
});
function end() {
    localStorage.clear();
    window.location.replace("index.html");
}