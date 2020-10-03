var maize = ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'];
var snap;
declareOnce = true;
var name = localStorage.getItem('name');
$(document).ready(function () {
    var current;
    var room = localStorage.getItem('roomId').substr(0, 3) + '-' + localStorage.getItem('roomId').substr(3, 6);
    $('#room_code').html(`${room}&nbsp;&nbsp;<span class="badge success"><label for="modal-2"><i class="far fa-comment-dots"></i></label></span>`);
    firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).on('value', function (snapshot) {
        if (snapshot.val()) {
            snap = snapshot.toJSON();
            if (!Object.keys(snap).includes('close')) {
                if (Object.keys(snap).includes('hostConcent') && Object.keys(snap).includes('playerConcent')) {
                    if (snap.hostConcent && snap.playerConcent) {
                        reset();
                    }
                }
                var winner = [];
                if (Object.keys(snap).includes('winner')) {
                    winner = Object.values(snap.winner);
                }
                hostPoint = 0;
                playerPoint = 0;
                for (var i = 0; i < winner.length; i++) {
                    if (winner[i] == 'O') {
                        hostPoint++;
                    } else if (winner[i] == 'X') {
                        playerPoint++;
                    }
                }
                if (snap.current == snap.host) {
                    $('#players').html(`<input id="tab0" type="radio" name="tabs" checked><label for="tab0">${snap.host} ${hostPoint > 0 ? '<span class="badge danger">' + hostPoint + '</span>' : ''}</label>
                <input id="tab1" type="radio" name="tabs"><label for="tab1">${snap.player} ${playerPoint > 0 ? '<span class="badge danger">' + playerPoint + '</span>' : ''}</label>`);
                } else {
                    $('#players').html(`<input id="tab0" type="radio" name="tabs"><label for="tab0">${snap.host} ${hostPoint > 0 ? '<span class="badge danger">' + hostPoint + '</span>' : ''}</label>
                <input id="tab1" type="radio" name="tabs" checked><label for="tab1">${snap.player} ${playerPoint > 0 ? '<span class="badge danger">' + playerPoint + '</span>' : ''}</label>`);
                }
                current = snap.current;
                maize = snap.maize;
                for (var i = 0; i <= 8; i++) {
                    if (maize[i] == 'O' || maize[i] == 'X') {
                        $(`*[data-position="${i}"]`).text(maize[i]);
                    } else if (maize[i] == 'N') {
                        $(`*[data-position="${i}"]`).text('');
                    }
                }

                win = 'N';
                if (maize[0] == maize[1] && maize[1] == maize[2]) {
                    win = maize[1];
                } else if (maize[0] == maize[3] && maize[3] == maize[6]) {
                    win = maize[3];
                } else if (maize[0] == maize[4] && maize[4] == maize[8]) {
                    win = maize[4];
                } else if (maize[1] == maize[4] && maize[4] == maize[7]) {
                    win = maize[4];
                } else if (maize[2] == maize[5] && maize[5] == maize[8]) {
                    win = maize[5];
                } else if (maize[2] == maize[4] && maize[4] == maize[6]) {
                    win = maize[4];
                } else if (maize[3] == maize[4] && maize[4] == maize[5]) {
                    win = maize[4];
                } else if (maize[6] == maize[7] && maize[7] == maize[8]) {
                    win = maize[7];
                } else if (maize[0] == maize[1] && maize[1] == maize[2]) {
                    win = maize[1];
                }
                if (declareOnce && win != 'N') {
                    declareOnce = false;
                    pop('Yo..Ho..!!', '', `${(win == 'X') ? snap.player : snap.host} won the Match!!`);
                    if (name == snap.host) {
                        winner.push(win);
                        firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
                            winner: winner
                        });
                    }
                } else if (maize[0] != 'N' && maize[1] != 'N' && maize[2] != 'N' && maize[3] != 'N' && maize[4] != 'N' && maize[5] != 'N' && maize[6] != 'N' && maize[7] != 'N' && maize[8] != 'N') {
                    pop('Yo..Yo..!!', '', `Draw Match!!`);
                }
            } else {
                localStorage.clear();
                window.location.replace("index.html");
            }
        }
    });
    $(document).on('click', '.normal-child', function () {
        pos = $(this).attr("data-position");
        if (current == name && maize[pos] == 'N') {
            marker = (snap.host == name) ? 'O' : 'X';
            $(this).text(marker);
            maize[pos] = marker;
            firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
                current: (snap.host == name) ? snap.player : snap.host,
                maize: maize
            });
        } else {
            window.navigator.vibrate(200);
        }
    });
    function reset() {
        declareOnce = true;
        firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
            hostConcent: false,
            playerConcent: false,
            maize: ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']
        });
    }
});
function playAgain() {
    if (snap.host == name) {
        firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
            hostConcent: true
        });
    } else {
        firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
            playerConcent: true
        });
    }
}
function end() {
    firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/`).update({
        close: true
    }).then(() => {
        localStorage.clear();
        window.location.replace("index.html");
    });
}