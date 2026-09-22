//gonna put my stuff here cause yeah :P

//button :P
console.log("EHLLO>");

document.getElementById("rat").addEventListener('click', async function() {
  console.log("click detected");
  await playStartAnimation();
  console.log("change");
  window.location.href = 'meow.html';
});
document.getElementById("daily").addEventListener('click', async function() {
  await playStartAnimation();
  window.location.href = 'meow.html?daily=1';
});
//story 
document.getElementById("fat").addEventListener('click', () => {
  window.location.href = 'story.html'
})
//background movement
const bg = document.getElementById("bg_div");
function playStartAnimation() {
  console.log("am i even here?")
  //promises are things u need to wait for css to complete :D
  //only use await to wait for js or web to finish i think :3
  return new Promise((resolve) => {
      const bg = document.getElementById("long_img")
      bg.classList.add("animation");
      console.log("so im here")
      bg.addEventListener('transitionend', () => {
        console.log("resolved. then it should print change.")
        resolve(); // ending! promise complete 
      });
      console.log("so im here 2")
    });
}