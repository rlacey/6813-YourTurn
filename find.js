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
 var activeID=null;
 var loadedToys=[];

$(document).ready(function(){
	populateToys();
	//Function to filter displayed toys whenever a checkbox is clicked
	$(':checked').change(function(){
		populateToys();
	});

	$('#ageRangeFilter').change(function(){
		populateToys();
	});

	$('#searchForm').submit(function(e){
		e.preventDefault();
		populateToys();
	});

	$('#modifyCart').click(function(){
		if($('#modifyCart').text()=='Add to Cart'){
			console.log('adding to cart');
			addToCart();
		}
		else{
			console.log('item was already in the cart');
			removeFromCart(activeID);
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
	$('#modalToyCats').html('<strong>Category: </strong>'+toy.categories);
	$('#modalToyCondition').html('<strong>Condition: </strong>'+toy.condition);
	$('#modalToyDesc').html('<strong>Description: </strong>'+toy.description);
	if (isInCart(toy.id)){
		$('#modifyCart').removeClass('btn-primary');
		$('#modifyCart').addClass('btn-warning');
		$('#modifyCart').text('Remove from Cart');
	}
	else{
		$('#modifyCart').text('Add to Cart');
		$('#modifyCart').removeClass('btn-warning');
		$('#modifyCart').addClass('btn-primary');
	}
	$('#modalToy').modal({});
	activePhoto=toy.photo;
	activeName=toy.name;
	activeID=toy.id;
}
//Adds the item that was being looked at in the toy detail modal to the cart
function addToCart(){
	//Hide the checkout confirmation modal that could have been there before
	$('#finalCheckoutConfirmation').hide();
	//If there are less than 5 toys allow the toy to be added to the cart
	if (cart.length<5){
		cart.push({name:activeName,photo:activePhoto,id:activeID});
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
			var newEntry=$('<li>',{id:'cart'+cart[i].id});
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
			xbutton.click(assignClick(cart[i].id, i));
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
function assignClick(id,i){
	return function(event){
		removeFromCart(id,i);
	}
}
//Removes an item from the cart and removes the respective row in the cart modal
function removeFromCart(id,row){
	cartSize=cart.length;
	var rowToDelete=$('#cart'+id);
	if (row != cartSize-1){
		$('#cart'+id +'~ .divider:first').remove();
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
	populateToys();
}
//Clear all checkbox filters and trigger filter
function clearAllFilters(){
	$('#categories :checkbox').prop('checked',false);
	populateToys();
}

var a;

function populateToys(){
	//Remove all current displayed toys
	$('#toyWrapper').children().remove();
	//Reset number of toys per row
	numPerRow={1:0};
	$.post(
		'getToys.php',
		{'searchFilter':$('#searchFilter').val(),'ageFilter':$('#ageRangeFilter').val(),'cats':getCheckedCats()},
		function(data){
			var parsed=JSON.parse(data);
			a= parsed;
			console.log(parsed);
			for (i=0;i<parsed.length;i++){
				var newToy = new toy(parsed[i]['toy_id'],parsed[i]['toy_name'],parsed[i]['toy_age_range'],parsed[i]['toy_condition'],
					parsed[i]['toy_category'],parsed[i]['toy_description'],parsed[i]['toy_photo']);
				console.log(newToy);
				addNewToy(newToy);
			}
		}
	);
}

function getCheckedCats(){
	var checkedCats = [];
	//Get all checked categories
	$('#categories :checked').each(function(i){
		//Add the category name to an array
		checkedCats.push($(this).val());
	});
	return checkedCats;
}

function isInCart(id){
	for (i=0;i<cart.length;i++){
		if (id==cart[i]['id']){
			return true;
		}
	}
	return false;
}