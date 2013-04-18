/**
 *
 *  @author Amruth Venkatraman
 */

 var numRows=1;
 var capPerRow=4;
 var numPerRow={1:0};
 var cart=[];
 var activeName=null;
 var activePhoto=null;
 var toys=[];

$(document).ready(function(){
	var toy1= new toy(1,'Pony Bike','4-7','New',['Bikes, Boards & Scooters'],"Best young girl's bike ever!","images/toys/kids_bike.jpg");
	var toy2= new toy(1,'Hot Wheels Collection','4-7','Lightly used',['Toy Cars'],'Great hot wheels collection',"images/toys/car.jpg");
	var toy3= new toy(1,'Monopoly','8-12','Heavily used',['Games & Puzzles'],'This board game gave me many hours of enjoyment!',"images/toys/monopoly.jpg");
	var toy4= new toy(1,'Stradivarius','13+','New',['Musical Instruments'],'Antique violin',"images/toys/violin.jpg");
	var toy5= new toy(1,'Lite Brite Kit','4-7','Heavily used',['Games & Puzzles'],'Kids can make all sorts of cool shapes!',"images/toys/litebrite.jpg");
	var toy6= new toy(1,'Ferrari Toy Race Car','4-7','Lightly used',['Toy Cars'],'Quality car that can be pulled back to run a short distance upon letting go.',"images/toys/racecar.jpg");
	var toy7= new toy(1,'Halo Reach','13+','New',['Video Games'],'Cool game where you get to play as a soldier and not a Spartan.',"images/toys/reach.jpg");
	var toy8= new toy(1,'Etch-A-Sketch','0-3','New',['Learning Toys'],"Great way to get your kid's creativity going!","images/toys/sketch.jpg");
	var toy9= new toy(1,'Beast action figure','4-7','Heavily used',['Action Figures & Dolls'],"Beast will tear the rest of your action figures to shreds.","images/toys/beast.jpg");
	var toy10= new toy(1,'Army men action figure set','4-7','Heavily used',['Action Figures & Dolls'],"Manliest of all action figures.","images/toys/army_men.jpg");
	var toy11= new toy(1,'Atlas bike','8-12','Lightly used',['Bikes, Boards & Scooters'],"Need to get places? This is your bike.","images/toys/new_bikebike.gif");
	var toy12= new toy(1,'Weird old bike','8-12','New',['Bikes, Boards & Scooters'],"Need to get places? This may not be your bike.","images/toys/old_bike.jpg");

	//Add toys to the array of toys
	toys.push(toy1);
	toys.push(toy2);
	toys.push(toy3);
	toys.push(toy4);
	toys.push(toy5);
	toys.push(toy6);
	toys.push(toy7);
	toys.push(toy8);
	toys.push(toy9);
	toys.push(toy10);
	toys.push(toy11);
	toys.push(toy12);
	//Add the toys to the page on page load
	for (i=0;i<toys.length;i++){
		addNewToy(toys[i]);
	}
	//Function to filter displayed toys whenever a checkbox is clicked
	$(':checked').change(function(){
		var checkedCats = [];
		//Get all checked categories
		$(':checked').each(function(i){
			//Add the category name to an array
			checkedCats.push($(this).val());
		});
		//Remove all current displayed toys
		$('#toyWrapper').children().remove();
		//Reset number of toys per row
		numPerRow={1:0};
		for (j=0;j<toys.length;j++){
			for (k=0;k<checkedCats.length;k++){
				//If the toy has a category that matches the selected categories display it
				if (toys[j].categories==checkedCats[k]){
					addNewToy(toys[j]);
					continue;
				}
			}
		}
	});

	//Register handler to clean the cart modal
	$('#modalCart').on('hidden', function () {
    	clearCart();
	});

	//Register handler to clear the checkout modal
	$('#modalCheckout').on('hidden', function () {
    	clearCheckout();
	});
});
//Adds a new toy to the find page
function addNewToy(toy){
	//Is there room for another toy on the lowest row
	if (numPerRow[numRows] + 1 <= capPerRow){
		numPerRow[numRows] += 1;
	}
	//if not update the current row and add an entry to the object denoting the number of toys in that row
	else{
		numRows+=1;
		numPerRow[numRows]=1;
	}
	var col=numPerRow[numRows];
	//If there is no row existing for the current toy create it
	if ($('#row'+numRows).length==0){
		var newRow = $('<div>', {id:'row'+numRows,class:'row-fluid toyRow'});
		$('#toyWrapper').append(newRow);
	}
	var row= $('#row'+numRows);
	//Add in the toy image and description
	var colDiv= $('<div>', {id:'row'+numRows+'col'+col,class:'span3 toyEntry'});
	row.append(colDiv);


	var pic= $('<img>',{src:toy.photo, class:'img-polaroid', style:"cursor:hand;cursor:pointer; max-width:300px; width: 90%; height: 10em;" });
	colDiv.append(pic);

	//Register click on image bringing modal giving more details
	pic.click({'toy':toy},function(e){
		moreDetails(e);
	});

	//Write under the picture the name of the toy
	var text=$('<p>',{class:'toyBrief', html:toy.name});
	colDiv.append(text);
}
//Generator function for toy objects
function toy(id, name, ageRange, condition, categories, description, photo){
	this.id=id;
	this.name=name;
	this.ageRange=ageRange;
	this.categories=categories;
	this.condition=condition;
	this.description=description;
	this.photo=photo;
}
//Fill in the toy detail modal with the toy information of the toy being clicked on
function moreDetails(e){
	$('#cartConfirmation').hide();
	toy=e.data.toy;
	$('#modalToyImage').attr('src',toy.photo);
	$('#modalToyTitle').html(toy.name);
	$('#modalToyCats').html('<strong>Categories: </strong>'+toy.categories.join());
	$('#modalToyCondition').html('<strong>Condition: </strong>'+toy.condition);
	$('#modalToyDesc').html('<strong>Description: </strong>'+toy.description);
	$('#modalToy').modal({});
	activePhoto=toy.photo;
	activeName=toy.name;
}
//Adds the item that was being looked at in the toy detail modal to the cart
function addToCart(){
	//Hide the checkout confirmation modal that could have been there before
	$('#finalCheckoutConfirmation').hide();
	//If there are less than 5 toys allow the toy to be added to the cart
	if (cart.length<5){
		cart.push({name:activeName,photo:activePhoto});
		$('#cartConfirmation').show();
	}
	//Otherwise notify the user that only 5 toys may be in the cart
	else{
		$('#cartFullAlert').show();
	}
	//Hide the modal with the toy details
	$('#modalToy').modal('hide');
}
//Brings up a modal to view the contents of the current cart
function viewCart(){
	$('#cartConfirmation').hide();
	var cartList=$('#cartList');
	//If cart is empty notify user
	if (cart.length==0){
		$('#emptyCart').show();
 		$('#checkoutButton').attr("disabled", true);
	}
	else{
		//If cart not empty hide the empty cart notification
		$('#emptyCart').hide();
		//Enable the checkout button
		$('#checkoutButton').attr("disabled", false);
		//Create a row in the cart modal for each toy with the picture, the name, and an x to remove it
		for (i=0;i<cart.length;i++){
			var newEntry=$('<li>',{id:'cart'+cart[i].name.replace(/\s/g, '')});
			var newRow=$('<div>',{class:'row-fluid'});
			//Fill picture column
			var picCol =$('<div>',{class:'span2'});
			var pic=$('<img>',{src:cart[i].photo});
			picCol.append(pic);
			newRow.append(picCol);

			//Fill in toy name
			var nameCol=$('<div>',{class:'span5 vertical'});
			nameCol.html(cart[i].name);
			newRow.append(nameCol);

			//Fill in x button
			var buttonCol=$('<div>',{class:'span1 offset4 pull-right vertical'});
			var xbutton = $('<button>',{type:"button",class:"close",html:'&times'}); //data-dismiss:"alert", 
			buttonCol.append(xbutton);
			newRow.append(buttonCol);
			xbutton.click(assignClick(cart[i].name, i));
			//put row in li entry
			newEntry.append(newRow);
			//Put li in UL
			cartList.append(newEntry);
			//If not the last toy in the cart add a divider below it
			if(i!=cart.length-1){
				var divider=$('<li>', {class:'divider'});
				cartList.append(divider);
			}
		}
	}
	//Show the cart
	$('#modalCart').modal({});
}


//Click helper
function assignClick(toyName,i){
	return function(event){
		removeFromCart(toyName,i);
	}
}
//Removes an item from the cart and removes the respective row in the cart modal
function removeFromCart(toyName,row){
	cartSize=cart.length;
	var rowToDelete=$('#cart'+toyName.replace(/\s/g, ''));
	if (row != cartSize-1){
		$('#cart'+toyName.replace(/\s/g, '') +'~ .divider:first').remove();
	}
	//remove list entry with toy
	rowToDelete.remove();
	cart.splice(row,1);
	//If the cart is empty notify the user and disable the checkout button
	if(cart.length==0){
		$('#emptyCart').show();
		 $('#checkoutButton').attr("disabled", true);
	}
}

//Remove all html components in the cart. Used when the cart modal is closed.
function clearCart(){
	$('#cartList').children().remove();
}

//Configures and displays the checkout modal 
function checkout(){
	//Hide the cart modal that was shown
	$('#modalCart').modal('hide');
	//Hide the checkout confirmation if one was displayed from messaging another toy owner
	$('#checkoutMessageConfirmation').hide();
	for(i=0;i<cart.length;i++){
		//Create the tab. If the first tab make it active
		if (i==0){
			var ownerEntry= $('<li>',{class:'active'});
		}
		//Otherwise just make it and don't classify it as active
		else{
			var ownerEntry= $('<li>');
		}
		//Create the link containing the toy name for the tab
		var owner = $('<a>',{href:'#message'+i,text:cart[i].name});
		owner.attr('data-toggle','tab');
		ownerEntry.append(owner);
		$('#ownerList').append(ownerEntry);

		//Create message body
		//If the first tab-pane then force it active. Otherwise do not.
		if (i==0){
			var tabPane=$('<div>',{class:'tab-pane active',id:'message'+i});
		}
		else{
			var tabPane=$('<div>',{class:'tab-pane',id:'message'+i});
		}
		//Create the field where the users can write a message to the toy owner
		var message = $('<textarea>', {style:"width:28em;height:13em", id:'messageText'+i});
		tabPane.append(message);
		$('#ownerMessages').prepend(tabPane)
	}
	$('#modalCheckout').modal({});
}
//Send a message to the owner and close the tab and message content for the toy
function requestToy(){
	var activeTab = $('#ownerList li.active');
	var tabBodyID = $('ul#ownerList li.active a').attr('href');
	var activeTabBody= $(tabBodyID);
	var tabNum = tabBodyID.split('message')[1];

	if ($('#ownerList li').length!=1){
		//is it the first tab in the row
		if (tabNum==$('#ownerList li:first a').attr('href').split('message')[1]){
			console.log('first tab');
			//Set next tab to active
			$('#ownerList li.active').next().addClass('active');
			//Set next tab body to active
			var nextTab=parseInt(tabNum)+1;
			$('#message'+nextTab).addClass('active');
		}
		else{
			//Set previous tab to active
			$('#ownerList li.active').prev().addClass('active');
			//Set previous tab body to active
			var prevTab=parseInt(tabNum)-1;
			$('#message'+prevtab).addClass('active');
		}
		$('#checkoutMessageConfirmation').show();
	}
	//Last message to toy owner
	else{
		$('#modalCheckout').modal('hide');
		$('#finalCheckoutConfirmation').show();
	}
	activeTab.remove();
	activeTabBody.remove();

	//Remove item from cart
	cart.splice(tabBodyID,1);
}
//Remove all tabs and tab-panes in the checkout modal
function clearCheckout(){
	$('#ownerList').children().remove();
	$('#ownerMessages').children('.tab-pane').remove();
}
//Check all checkbox filters and trigger filter
function checkAllFilters(){
	$('#categories :checkbox').prop('checked',true);
	var temp = $('#categories :checked:first');
	temp.click();
	temp.click();
}
//Clear all checkbox filters and trigger filter
function clearAllFilters(){
	$('#categories :checkbox').prop('checked',false);
	var temp = $("#categories :checkbox:not(:checked)");
	temp.click();
	temp.click();
}