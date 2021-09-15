const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var type = 0;
var snap;
function returntype() {
  type = 0;
}
function startGameDisplay(ty) {
  if (ty === 1 || ty === 2) {
    type = ty;
    $(".intro").hide();
    $("#start").show();
  }
}
function joinGameDisplay() {
  $(".intro").hide();
  $("#join").show();
}
function checkNameAndCreateUltimate() {
  if ($("#paperInputs1").val().trim() != "") {
    $("#btn_create").text("Creating Room...");
    var result = "";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    firebase
      .database()
      .ref("rooms/" + result)
      .once("value", function (snapshot) {
        if (!snapshot.val()) {
          if (type === 1) {
            firebase
              .database()
              .ref("rooms/" + result)
              .set({
                roomId: result,
                type: 1,
                host: $("#paperInputs1").val().trim(),
                start: false,
                maize: [
                  [true, true, true, true, true, true, true, true, true],
                  [true, true, true, true, true, true, true, true, true],
                  [true, true, true, true, true, true, true, true, true],

                  [true, true, true, true, true, true, true, true, true],
                  [true, true, true, true, true, true, true, true, true],
                  [true, true, true, true, true, true, true, true, true],

                  [true, true, true, true, true, true, true, true, true],
                  [true, true, true, true, true, true, true, true, true],
                  [true, true, true, true, true, true, true, true, true],
                ],
              })
              .then(() => {
                localStorage.clear();
                localStorage.setItem("name", $("#paperInputs1").val().trim());
                localStorage.setItem("roomId", result);
                window.location.replace("wait.html");
              });
          } else if (type === 2) {
            firebase
              .database()
              .ref("rooms/" + result)
              .set({
                roomId: result,
                type: 2,
                host: $("#paperInputs1").val().trim(),
                start: false,
                maize: ["N", "N", "N", "N", "N", "N", "N", "N", "N"],
              })
              .then(() => {
                localStorage.clear();
                localStorage.setItem("name", $("#paperInputs1").val().trim());
                localStorage.setItem("roomId", result);
                window.location.replace("wait.html");
              });
          }
        } else {
          checkNameAndCreateUltimate();
        }
      });
  } else {
    pop("Oaa!!", "", "Enter Your Name!!");
  }
}
function checkRoomAndEnter() {
  if ($("#paperInputs2").val().trim() != "") {
    $("#btn_enter").text("Entering Room...");
    firebase
      .database()
      .ref(
        "rooms/" +
          $("#paperInputs2").val().trim().replace("-", "").toUpperCase()
      )
      .once("value", function (snapshot) {
        if (snapshot.val()) {
          snap = snapshot.toJSON();
          localStorage.clear();
          if (!Object.keys(snap).includes("player")) {
            localStorage.setItem(
              "roomId",
              $("#paperInputs2").val().trim().replace("-", "").toUpperCase()
            );
            $("#enter_room").hide();
            $("#enter_name").show();
          } else {
            pop("Sorry!!", "", "House is already full!!");
          }
        } else {
          pop("Hello!!", "", "The Room ID has expired or does not exist!!");
        }
      })
      .then(() => {
        $("#btn_enter").text("Enter Room");
      });
  } else {
    pop("Oaa!!", "", "Enter the Room Code!!");
  }
}
function checkNameAndJoin() {
  if ($("#paperInputs3").val().trim() != "") {
    $("#btn_join").text("Joining...");
    if (
      snap.host.trim().toLowerCase() !=
      $("#paperInputs3").val().trim().toLowerCase()
    ) {
      localStorage.setItem("name", $("#paperInputs3").val().trim());
      firebase
        .database()
        .ref(`tictactoe/rooms/${localStorage.getItem("roomId")}`)
        .update({
          player: localStorage.getItem("name"),
        })
        .then(() => {
          window.location.replace("wait.html");
        });
    } else {
      pop(
        "Sorry!!",
        "",
        "There is someone with your name.. Please change it!!"
      );
    }
    $("#btn_join").text("Join");
  } else {
    pop("Oaa!!", "", "Enter Your Name!!");
  }
}
$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams != "") {
    roomCode = urlParams.get("room");
    joinGameDisplay();
    $("#paperInputs2").val(roomCode);
    checkRoomAndEnter();
  }
});
