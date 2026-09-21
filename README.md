# Bounce
Bounce is a game made for Hack Club's Third Space event by Jyoshita and PianoMan0!
---

### Contents

* [Access](#access)


* [Description](#description)


* [How to use?](#how-to-use)


* [Features](#features)


* [Ai Usage](#ai-usage)


* [Learning](#learning)



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


* made with: **Html+Css+JavaScript** in VS Code


* deployed to *Github Pages*


#### Quick Overview
---
bleh

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
* **Pause Menu**
1) Pause by clicking P
---
* **Cool Intro**
1) When you start the game it zooms past a harvest bg before dropping you in the world.

---
* **Restart and Move to the Next level using R**
1) This way you don't need to keep clicking the button - and makes it easy to quickly play a bunch of game!

---
* **Toaster:**	
1) A intresting library that allows for popups to be created MUCH easier than manually styling alerts with CSS
2) I used it for all my alerts and it looks very professional! with minimal code written!

---
* **Shelf:**	
1) A cute shelf that stores all your gacha!
2) The shelf has a fixed height and using slice() the gacha that it should display is dynamically calculated
3) You can also see the gacha id (unique to every unique gacha) and rarity on the shelf (ooh!)

---
* **Cool font:**
1) A cool font I made on calligraphr
2) Has 52 characters that I drew

---
* **Dashboard:**
1) displays your email and uuid (unique to each user)
2) you can also gamble, head to flashcards, or logout here

---
* **Flashcards:**
1) Here you can create new flashcards with a title and description. 
2) or you can view your library of flashcards! something cool i did here was adding the '...' when the text is full! >.<
3) once you click on the button you can practice your flashcards in two modes: learn and test. 
5) test means you gain a coin for a right answer and lose one for a wrong answer!
4) learn is no risk and you can just skim through the flashcards
5) there is a ending page when you finish in test mode that shows you your stats and also 3 different patch images based on how well you did!
6) when you exit test mode it resets your coins and all assosiated states :D
7) the library is the same grid as the shelf...shh...don't let anyone know

---
* **Additional Stuff:**
1) yeah. my project as a super cute cat icon when you click on the link
2) and a title!


---

## AI USAGE: 
* Gemini for debugging and learning!
* I learned about useState, useEffect, upsert, and more from AI!
* But in the end all code and core concepts are written authentically by me!
* All the art is done by me (<3 i hope you likee itt)
* And of course this read me is written by the one and only me :P

## LEARNING:


### Learned:
---
1) This was my first every react project and website
2) I knew a bit of html/css before this but not much js. now i definetly know a lot more and feel comfortable with it too!
3) I learned how to use supabase, toaster, html2canvas (to take screenshots of the gacha) and much more!
4) I learned about new js tools like useState and useEffect!
5) I learned how to set up a vercel site
6) I got more familiar with flex (my greatest opp...) and css
7) I learned about tables and grids (actually never used them before)
8) I learned about new tags like description and summary ! super cool!
9) I learned about position event in css :D
10) I learned how to add style into the jsx code :3
11) I learned how to user framer motion! Will totally be using this again 

... and more! but that's off the top of my head

### Struggles :
	
---
1) **The gambling page.** As you'd expect this took up a bulk of the time. It was so hard to have everything stack ontop of each other and I was so confused how I'd store the state when the user spam clicked. That's why there are two div containers for the image - one the use sees and one that is only used to take a split second screenshot using html2 canvas that is then stored in the db. A lot of this was a logic race and a PAIN to debug. I also learned a lot about the Object class and mapping stuff and using glob for the image path (also a pain because I kept messing up the path T-T)
2) **The table.** Uh formatting the css was terrible for this. I'm sure there's a better way out there but I just kept guessing things and hoping the shelf would end up the way I wanted. I was also learning how to use a grid so I found it kind of confusing.
In the end though it turned out amazing and I'm glad I took the time to make it look like a shelf instead of leaving it a plain table.
scaled down/up nodes everywhere this was a guess and check process! 
3) **The captchas..** For some reason they wouldn't reset when the fields were wrong. So there are actually two captchas on every page so that they get recreacted when there is an error and the field is set to null again. This seems simple but it actually took me forever and crazy logic to get to.
of the nodes and dynamically connect multiple files (mainly fish,shark,and start) to return to how it was at the start
4) **the formula...**  Sure it seems simple enough to randomly generate images right. WRONG. tell me why there was so much probability math involved? At some point I just guessed formulas until one seemed to work and I had to be reminded of permutations again. This made me sad. I also made the rarity to get a 5 realllly hard like less than one percent. So if you get a 5 you are reallllyyy lucky. 
4) **the css...** shiver. i hate css. i spent so long trying to just align everything and had to scrap classes countless times leading to other stuff getting affected and i had to reformat EVERYTHING T-T . especially for the flashcard section this got me

**bonus!: the website is called fortune kitties because fortune cat was taken...so sad T-T**

*...and more but those are the big ones*


*Made with 💖 by jyoshita and pianoman0!*
