$(function () {
  $("#chat-input").on("submit", (e) => {
    e.preventDefault();

    const $input = $("#chat-input input");
    const value = $input.val();
    $input.val("");
    console.log(value);
    $(".message.user p").text(value);
  });
});
