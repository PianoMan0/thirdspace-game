//gonna put my stuff here cause yeah :P

//button :P
console.log("EHLLO>");
document.getElementById("rat").addEventListener('click', async function() {
  console.log("click detected");
  await playStartAnimation();
  console.log("change");
  window.location.href = 'meow.html';
});
//background movement
const bg = document.getElementById("bg_div");
function playStartAnimation() {
  //promises are things u need to wait for css to complete :D
  //only use await to wait for js or web to finish i think :3
  return new Promise((resolve) => {
      const bg = document.getElementById("long_img")
      bg.classList.add("animation");
      bg.addEventListener('transitioned', () => {
        console.log("resolved. then it should print change.")
        resolve(); // ending! promise complete 
      });
    });
}