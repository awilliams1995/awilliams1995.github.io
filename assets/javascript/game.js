$( document ).ready(function(){

/*this will change as soon as the primary character is chosen, has no way of going back to being false unless the program restarts*/
var hasCharacterBeenChosen = false;
/*place to store the current location on the enemies array below in order to know what the index is, in order to be able to successfully remove the element from the array in question*/
var characterChosen = 0;
/*this is where your hp information will be stored, pulled from the jquery object generated for the player button selected*/
var yourhp;
/*this is where your attack information will be stored, pulled from the jquery object generated for the player button selected*/
var yourattack;
/*this is where the enemy hp information will be stored, pulled from the jquery object generated for the enemy button selected*/
var enemyhp;
/*this is where the enemy counter attack information will be stored, pulled from the jquery object generated for the enemy button selected*/
var enemyattack;
/*this will be true as soon as you select an opponent, however, it will change back to false as soon as you either lose or a character dies. thereby only making it possible for you to select opponent characters when no round is currently ongoing*/
var roundHasBegun = false;
/*this is where the jquery object with the element button selected will be stored. this will be transient as well. */
var enemy;
/*this will store all of the enemies so that it will be known when you won the game. once the array length is zero you win the game.*/ 
var enemies = ["ObiOne","DarthVader","Yoda","AnakinSkyWalker"];
/*this variable is intended to store the original value of the character attack power in order to know how much to add each time the attack power gets selected. */
var attackAdder;
/*this boolean is intended to be a determinant for whether or not the attack or character selection buttons should be active*/
var gameOver = false;
/*this is where the jquery object for the button with the opponent selected gets stored. this is transient and will change on a per round basis. */
var characterChosenForRound2;
/*intended to move the emoji with dead face at the end*/

function moveRightAndLeft(){//see comment above^^^
						/*at the end of the game, if you lose, a dead face emoji goes to the right*/			
						$("#hideDead").animate({right:"0px"},800);//see comment above^^^
						/*at the end of the game, if you lose, a dead face emoji goes to the left*/
						$("#hideDead").animate({left:"0px"},800);//see comment above^^^
					};
/*this function is designed in order to display both the hp and attack stats for you*/ 
function displayyourvalues(){//see comment above^^^
	//displaying your hp
	$("#yourattack").html(yourattack);//see comment above^^^
	//displaying your attack stats
	$("#yourhp").html(yourhp);//see comment above^^^
};
//this function is designed in order to display both the hp and attack stats for the enemy
function displayenemyvalues(){//see comment above^^^
	//displaying enemy hp
	$("#enemyhp").html(enemyhp);//see comment above^^^
	//displaying enemy attack stats
	$("#enemyattack").html(enemyattack);//see comment above^^^
};


//this function will execute as soon as anything with the characters class is selected. interestingly enough though,
// although you remove the class "characters"(within the codeblock of this functino) from any of the elements 
//that might trigger this function on click, they will still trigger the function the 2+ nth time they are clicked.
//- in order to resolve that I had to use if statements and booleans.
$(".characters").click(function(){//see comment above^^^
	/*this if clause will only go if the the game has not been deemed over and if the initial 
	character has not yet been chosen*/
	if(!hasCharacterBeenChosen && !gameOver){//see comment above^^^
	/*since this will only run when the character initially gets selected, it makes sense to 
	remove it as a character option since it will not be part of the enemies group*/
	$(this).removeClass("characters");//see comment above^^^
	/*since the players choice has been removed from the characters class, now I can place 
	everyone left in the characters class in the pending enemies section of the page*/
	$ ("#enemies").append($(".characters"));//see comment above^^^
	/*I will need to refer back to the character that was chosen later, in the interest of 
	being able to access all the information in that particular element, I save it below in
	jquery object form under the characterChosen variable*/
	characterChosen = $(this);//see comment above^^^
	/*here we are assigning the value of whatever is in the value attribute of the element
	 selected that triggered this on click event character to our yourhp variable*/
	yourhp = $(this).attr("value");//see comment above^^^
	/*doing the same thing described in the previous comment, only to the your attack variable*/
	yourattack = $(this).data("attack");//see comment above^^^
	/*now this one is a little different, your attack is constantly going to be changing,
	 so what we need is to store the original attack value so that only that will be added every click*/
	attackAdder = $(this).data("attack");//see comment above^^^
	/*our enemies array can only ever comprise of the enemies pending to be selected, since
	 the character chosen doesn't logically fall under that category, we have to remove it
	 by using the javascript splicemethod below, in order to know what index to remove we take
	 advantage of the fact that the id values, in this case are the exact same as the values
	 inside the enemies array. this way we can use the indexOf method to pull up the value
	 of the element being selected, the second argument in the enemies.splice call is the
	 amount of values that we want removed.*/
	enemies.splice(enemies.indexOf($(this).attr("id")), 1);//see comment above^^^
	/*finally, we have to tell the program to display all these values that we spent the 
	last couple of lines storing and manipulating, you can find a more comprehensive 
	explanation of the displayyourvalues function on line 148.*/
	displayyourvalues();//see comment above^^^
	/*with this boolean we are storing the fact that the players character has been chosen
	 as true.*/
	hasCharacterBeenChosen = true;//see comment above^^^
	/*I am creating a variable in the local scope because I never use this variable outside 
	the context of this function so it is unnecessary to generate a global variable. what I
	am assigning to it is the value of the id attribute for the element being selected and 
	concatenating a period(.) so that the end result is a class representation with that same text*/
 	var characterChosenForRound = "."+ characterChosen.attr("id");//see comment above^^^
 	/*now I use that class representation in order to select that particular class, unique 
 	to one element on the body, and give it the css value of inline-block, which in effect 
 	will make it visible, since prior to this it had display:none as its css display property.
 	I use the css method instead of show because I do not want it to go back to block, because 
 	then the two characters, one enemy, one main player will not be next to one another. */
 	$(characterChosenForRound).css("display","inline-block");//see comment above^^^
 	/*I want it to be known that the character chosem will always be fighting someone else,
 	 to signal that I added a text statement to the right of the chosen character of the player. */
 	$("#characterVisuals").append("<span style='font-size:16px'>  Versus  </span>");//see comment above^^^
}
/*this else if will only run if the players character has already been chosen and the game is not over*/
else if(!roundHasBegun && $(this).attr("id") != characterChosen.attr("id") && !gameOver){//see comment above^^^
	/*if this code block is being executed, that means there is nobody in the defenders section, which consists of the character that the user is currently combatting. so if a element with a character class is selected that means that that character is intended to be moved to the defenders section, which is what the command below does. */
	$("#defenders").append($(this));//see comment above^^^
	/*since the character will now be part of the defenders section, it has be kicked out of the enemies pending label, aka the characters class, which we do so by using the removeClass method.*/
	$(this).removeClass("characters");//see comment above^^^
	/*we need to refer back to the enemy that was chosen to defend for later, in the interest of being able to access all the information in that particular element, I save it below in jquery object form under the enemy variable*/
	enemy = $(this);//see comment above^^^
	/*here we are assigning the value of whatever is in the value attribute(where the unique hp for each element in stored) of the element selected that triggered this on click event character to our enemyhp variable.*/
	enemyhp = $(this).attr("value");//see comment above^^^
	/*here we are assigning the value of whatever is in the data-conter attribute(where the unique hp for each element in stored) of the element selected that triggered this on click event character to our enemyattack variable.*/
	enemyattack = $(this).data("counter");//see comment above^^^
	/*refer to the previous time this method was used in the previous code block for a more thorough explanation of what is being done below, only difference is that it is being done because an enemy is moving from pending to currently in fight.*/
	enemies.splice(enemies.indexOf($(this).attr("id")), 1);//see comment above^^^
	/*funtion below modifies the html for all the html elements that are meant to display enemy health and attack data.*/ 
	displayenemyvalues();//see comment above^^^
	/*as soon as an enemy is chosen, that defacto means that a match is about to start between the user and 
	the enemy that has moved from pending to fighting mode. in order to ensure that no other character can be chosen and thereby execute this code block again, I change the boolean value of roundHasBegun to true.*/ 
	roundHasBegun = true;//see comment above^^^
	/*this is to store the class selector representation as a string to be recognized by the jquery selector on the line right after it*/
	characterChosenForRound2 = "."+ $(this).attr("id");//see comment above^^^
	/*this uses the stored jquery/css selector format in the variable characterChosenForRound2 to select the class that relates to the id value of the element being selected and append it to the characterVisuals Div*/
	$("#characterVisuals").append($(characterChosenForRound2));//see comment above^^^
	/*does the same thing as 189 but for the defending enemy*/
	$(characterChosenForRound2).css("display","inline-block");//see comment above^^^
}
});
/*this will only be triggered when the attack button is selected*/
$("#attack").click(function(){
/*we only want the attack to be executed if the game isn't over already and the actual fighting round has 
begun, meaning there is someone in the defender position and someone in the offensive position. those are the reasons for the two conditions below. */
if(roundHasBegun && !gameOver){// see comment above
/*this reduces the enemies health points. since the user is always the one that attack first, it will be the first thing executed while the game is in opponent vs user mode.*/
enemyhp = enemyhp - yourattack;//see comment above
/*your attack power has to increase every time attack, but it has to happen after the actual attack , otherwisethe enemy would never receive a damage amount that equals to the users base attack power, it will start at that attack power plus itself.*/
yourattack = yourattack + attackAdder;//see comment above
/*this hide element(gif) should be active as soon as the attack button is selected for the first time until either the user of the active opponent dies. how to ensure that happens is detailed below.*/ 
$("#hide").show();//see comment above
/*if after your attack, your enemy is still alive, then he has to attack. this if statement just makes sure that he can only attack if he is still alive.*/ 
if(enemyhp>0){//see comment above
/*his attack should reduce your hp by his attack power, represented mathematically below.*/ 	
yourhp = yourhp - enemyattack;//see comment above^^

				if(yourhp <= 0){
					yourhp = "DEAD";
					$("#hide").hide();
					$("#characterVisuals").empty();
					$("#characterVisuals").append($("#hideDead"));
					$("#hideDead").fadeTo(10,1);
					roundHasBegun = false;
					gameOver = true;
					moveRightAndLeft();	
							}

displayyourvalues();
displayenemyvalues();
}
		else if(enemyhp <= 0){
		$("#hide").hide();
		enemyhp = "DEAD";
		$(characterChosenForRound2).hide(200);
		$("#defenders").empty();
		displayenemyvalues();
				if(enemies.length>0){
				alert("you beat " + $(enemy).attr("id") + " choose another character");
				roundHasBegun = false;
									}
				else{
					$("#characterVisuals").empty();
					$("#characterVisuals").html("<img src='https://media.tenor.com/images/034c2c7c4397a96ac3ee1bed1f25d033/tenor.gif'>");
					roundHasBegun = false;
					gameOver=true;
										}
		}
}
else if(gameOver){
	alert("Game is over, select reset to play again")

}
else if(characterChosen == 0){
	alert("you haven't even chosen a character, what do you think you're doing");
}
else{
	alert("need to choose an enemy before you play buddy.")
}

});

$("#reset").click(function(){

location.reload();

});

});	





