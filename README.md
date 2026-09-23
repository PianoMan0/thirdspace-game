# Bounce
Bounce is a game made for Hack Club's Third Space event by Jyoshita and PianoMan0!
---

### Contents

* [Access](#access)


* [Description](#description)


* [How to play?](#how-to-play)


* [Features](#features)


* [Ai Usage](#ai-usage)


* [Learning](#learning)


* [Screenshots](#screenshots)



## ACCESS

---
* **Github Repo:** https://github.com/PianoMan0/thirdspace-game

* **Github Pages Link:** https://pianoman0.github.io/thirdspace-game/

(no installation!)

	
## DESCRIPTION
#### Creation Details
---
* by: **jyoshitanair and PianoMan0** (github)


* project name: **Bounce** 


* made with: **Html + Css + JavaScript** in VS Code


* deployed to *Github Pages*


#### Quick Overview
---
A simple web platformer game made with HTML+CSS+JS. You are a cat ball that is roaming around the platformer world that is inspired by fall, pumpkins, and the harvest! You can move using Arrow Keys or by dragging. You have to avoid the obstacles and use the pumpkins/portals to reach the end! There are multiple different ways to get there. There are 8 levels overall. There is also a home page, a pause menu, and an instructions page! Have fun!

## HOW TO PLAY
* Move using Arrow Keys or drag the player for precision.
* Avoid Spikes and Lazers
* Pumpkins will toggle secret platforms!
* Portals teleport you to new locations!
* Some platforms crumble if you stay on them too long!
* Pause the game with **P**, and restart or move on using **R**
* If you die you can respawn
* Try to make it to the end of all 8 levels!

## FEATURES
---
* **Level Setup**
1) A seperate easy to read level file to create new levels quickly! It makes our game a lot more readable and easier to impliment new levels later!
---
* **Pause Menu**
1) Toggle the pause by clicking P, there is also a pause menu that save everything about when you last were playing!
---
* **Cool Intro**
1) When you start the game it zooms past a harvest bg before dropping you in the world.

---
* **Restart and Move to the Next level using R**
1) Click R can you can: restart the game at any time, restart after loosing, move on to the next level after wininng.

---
* **Switching directions for the last level**	
1) Switches the normal vectors when the world name is Backwards - so everything is flipped

---
* **Spikes / Lazers**	
1) Spikes are triangles, lazers are two cool rectangles in one another that flicker!
2) When you land on both there is a burst to show you died and a custom death message!

---
* **Portal:**
1) There are randomly generated cicles outside of the main circle to make it look like it's flickering and it's fuzzy. It teleports you to somewhere new.

---
* **Pumpkin:**
1) They are like a toggle switch to show you new hidden paths.
2) It also pushes you out of the pumpkin, making it seem more like a switch!

---
* **Trail:**
1) A cool trail behind the player! It shows the arc of where they have been!
---
* **Gravity:**
1) There is gravity in our game making the ball fall in an arc
---
* **Drag and use Arrow Keys:**
---
1) Two different ways to play making it compatible for both mobile and computer - although it is definetly easier and intended to be played with arrow keys!
---
* **Additional Stuff:**
1) cool art :D
2) in the future songs might be added too!

---

## AI USAGE: 
* Gemini for debugging and learning new stuff!
* For example, jyoshita learned a lot about drawing stuff (ctx stuff) from gemini! (especially the pumpkin it was so hard to draw! and the cat ears on the player!)
* Gemini was also used as a debugging tool when jyoshita would get stuck :D
* javascript was also a new language to me so jyoshita used ai to help her understand how to start smth. Some things she learned include: ctx, hypot, window.location.href, promises,pushing, event listeners, and adding classes!
* But in the end all code and core concepts are written authentically by us!
* All the art is done by jyoshita (<3)
* And the read me is written by jyoshita!

## LEARNING:


### Learned (Jyoshita):
---
1) I learned a lot about how to code in javascript and making javascript games! This was really cool i'd really only ever made godot games before!
2) I learned a lot of javascript syntax that I wasn't familiar with!(for example: ctx, hypot, window.location.href, promises, event listeners, pushing, and adding classes!) and especially drawing stuff in javascript!
3) I also learned about new things in css (like inset!)
4) This was also my first web game!

... and more! but that's off the top of my head

### Learned (PianoMan0):
---
1) I learned so much about making gravity in games!
2) I learned how to make music that works well in video games
3) I learned that most modern browsers block autoplay - that's why there's a button to play music!
4) I learned a lot about collaboration on projects :D

### Struggles (Jyoshita) :
	
---
1) **The portal** It was taking up a lot of space with the particles for each portal and making the game laggy so I had to find a way around that (limiting total partilcles). Figuring out a way to randomly generate particles was also kinda hard, and blurring them. There was even polar coordinates involved! It took me way too long to get it to woork!
2) **The pumpkin.** It kept glitching because I didn't make the pumpkin a solid object but rather more like a switch. When the player got pushed out sometimes the platform would js dissapear and never come back again T_T or it would get stuck in it like quicksand kind of. It took a while to get it to work as a switch - and honestly it's still not quiet perfect! I would love to fix it up in the future!
3) **Working Together** Working together on a project was pretty hard since unlike at hackathons we couldn't be talking to each other the whole time! We had to create a system were we would be working on different parts of the game - but at the same time in order to bring everything together in the end we needed to have an understanding of one anothers code. So whenever I needed to edit something from piano's code it was kinda hard to find it, but at the same time having someone to working with was also SUPER FUN :D and it motivated me more too! It also made it easier to focus on doing the things we were good at!
4) **the page moving**  I was just very new to javascript and this was the first thing I made so maybe a bit biased. I was pretty confuesd how to set up the promise, find the object, have it scroll through, ect and it took a while. Overall though this is my favorite thing that I coded though! It looks really cool!

*...and more but those are the big ones*

## SCREENSHOTS:
---

1) Menu
---
<img width="10000" height="700" alt="Illustration 20260919" src="https://github.com/user-attachments/assets/06b8babb-cbe0-40d5-8016-0ffff38eab70" />
<img width="1815" height="991" alt="mainbounce" src="https://github.com/user-attachments/assets/0ed84a94-38a0-4da0-8500-c795eafc9b79" />


2) Pause
---
<img width="1830" height="1010" alt="pause" src="https://github.com/user-attachments/assets/675d8936-c2b7-48cc-b8b6-458821f172b9" />


3) Levels
---
<img width="1822" height="1007" alt="level8" src="https://github.com/user-attachments/assets/7d660ef5-b3c0-4893-bb10-3c49cac794fe" />
<img width="1832" height="1007" alt="level7" src="https://github.com/user-attachments/assets/bec24604-0049-4df7-933f-63d8614b7c1c" />
<img width="1837" height="1002" alt="level6" src="https://github.com/user-attachments/assets/5c580458-f3c1-400b-ab5d-12fc10104c95" />
<img width="1831" height="1011" alt="level5" src="https://github.com/user-attachments/assets/f6c93318-8ac4-4036-b699-ec917abf5e96" />
<img width="1827" height="1005" alt="level3" src="https://github.com/user-attachments/assets/d4447159-a6e6-4138-9a31-861050456d07" />
<img width="1827" height="1002" alt="level4" src="https://github.com/user-attachments/assets/9812b1c8-7e78-4261-bbda-163e42279fe6" />
<img width="1835" height="1010" alt="level2" src="https://github.com/user-attachments/assets/610ac41c-62b5-4625-be90-262b137e830e" />
<img width="1835" height="1012" alt="level1" src="https://github.com/user-attachments/assets/3a9f5ea4-18b2-4b99-9262-bc1aa4368c0b" />


4) Instructions
---
<img width="1842" height="1020" alt="instructions" src="https://github.com/user-attachments/assets/2c550126-db22-44aa-8a52-bdeafe50b8ac" />



*Made with 💖 by jyoshita and pianoman0!*
