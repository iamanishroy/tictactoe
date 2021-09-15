firebase
  .database()
  .ref(`tictactoe/rooms/${localStorage.getItem("roomId")}`)
  .on("value", function (snapshot) {
    if (snapshot.val()["start"]) {
      if (snapshot.val()["type"] == 1) {
        location.replace("playground.html");
      } else {
        location.replace("play-ground.html");
      }
    }
    $(".flex-spaces").html(
      '<div class="alert alert-primary">' + snapshot.val()["host"] + "</div>"
    );
    snap = Object.keys(snapshot.toJSON());
    if (snap.includes("player")) {
      $(".flex-spaces").append(
        '<div class="alert alert-primary">' +
          snapshot.val()["player"] +
          "</div>"
      );
      if (snapshot.val()["host"] == localStorage.getItem("name")) {
        $("#start").show();
      } else {
        $("#start").hide();
      }
    }
  });
function room() {
  var room =
    localStorage.getItem("roomId").substr(0, 3) +
    "-" +
    localStorage.getItem("roomId").substr(3, 6);
  $("#room_code").html(
    `${room}&nbsp;&nbsp;<span class="badge success"><label for="modal-2"><i class="far fa-comment-dots"></i></label></span>`
  );
  $("#share").attr(
    "href",
    `whatsapp://send?text=Play Tic-Tac-Toe game with me by clicking on the link ${document.location.hostname}/?room=${room} or By the code *${room}*`
  );
}
function copyToClipboard() {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($("#room_code").text()).select();
  document.execCommand("copy");
  $temp.remove();
}
function start() {
  firebase
    .database()
    .ref(`tictactoe/rooms/${localStorage.getItem("roomId")}`)
    .update({
      start: true,
      current: localStorage.getItem("name"),
    });
}
