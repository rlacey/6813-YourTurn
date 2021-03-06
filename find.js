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
 var totalPages;

$(document).ready(function(){
	updatePaging();
	populateToys(1);
	//Function to filter displayed toys whenever a checkbox is clicked
	$('#categories :checked').change(function(){
		$('.notifs').hide();
		updatePaging();
		populateToys(1);
	});

	$('#ageRangeFilter').change(function(){
		$('.notifs').hide();
		updatePaging();
		populateToys(1);
	});

	$('#searchForm').submit(function(e){
		e.preventDefault();
		$('.notifs').hide();
		updatePaging();
		populateToys(1);
	});

	$('#modifyCart').click(function(){
		if($('#modifyCart').text()=='Add to Cart'){
			addToCart();
		}
		else{
			removeFromCart(activeID);
			//Hide the modal with the toy details
			$('#modalToy').modal('hide');
			$('#removedFromCart').show();
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


	//Register change listener on numPerPage select box
	$('#numPer').change(function(){
		$('.notifs').hide();
		updatePaging();
		populateToys(1);
	});

	registerPagingForFirstAndLast();
});

function addConversation(toy_id){
	// Update data structure
	//userList.push(username);
	//conversations.push(new Array());
	console.log(toy_id);
	var owner = "";
	$.post("getOwner.php", {"id" : toy_id}, function(data){
		var parsed=JSON.parse(data);
		owner = parsed['owner'];
		console.log(owner);
	var user = $('#owner').attr('name');
	console.log(user);
	$.post(
		"addMessage.php",
		{"user_from":user, "user_to":owner, "message": "" },
		function(data){
			console.log('hi'+data);
			window.location.href = "messages.php";
		}
	);
	})
	
	// TODO: How will they be on the messages page from the find page? - switch tab, display conversations?
	
	
}

function addMessage(toy_id,message){
	// Update data structure
	//userList.push(username);
	//conversations.push(new Array());
	console.log(toy_id);
	var owner = "";
	$.post("getOwner.php", {"id" : toy_id}, function(data){
		var parsed=JSON.parse(data);
		owner = parsed['owner'];
		console.log(owner);
	var user = $('#owner').attr('name');
	console.log(user);
	$.post(
		"addMessage.php",
		{"user_from":user, "user_to":owner, "message": message }
	);
	})
	
	// TODO: How will they be on the messages page from the find page? - switch tab, display conversations?
	
	
}



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
	var text=$('<p>',{class:'toyBrief', html:toy.toy_name});
	colDiv.append(text);
}
//Generator function for toy objects
function Toy(id, name, ageRange, condition, categories, description, photo){
	this.toy_id=id;
	this.toy_name=name;
	this.ageRange=ageRange;
	this.categories=categories;
	this.condition=condition;
	this.desc=description;
	this.photo=photo;
}
//Fill in the toy detail modal with the toy information of the toy being clicked on
function moreDetails(e){
	$('#cartConfirmation').hide();
	$('#removedFromCart').hide();
	toyDetails=e.data.toy;
	console.log(e.data.toy);
	$('#modalToyImage').attr('src',toyDetails.photo);
	$('#modalToyTitle').html(toyDetails.toy_name);
	$('#modalToyCats').html('<strong>Category: </strong>'+toyDetails.categories);
	$('#modalToyCondition').html('<strong>Condition: </strong>'+toyDetails.condition);
	$('#modalToyDesc').html('<strong>Description: </strong>'+toyDetails.desc);
	if (isInCart(toyDetails.toy_id)){
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
	activePhoto=toyDetails.photo;
	activeName=toyDetails.toy_name;
	activeID=toyDetails.toy_id;
}
//Adds the item that was being looked at in the toy detail modal to the cart
function addToCart(){
	//Hide the checkout confirmation modal that could have been there before
	$('#finalCheckoutConfirmation').hide();
	//If there are less than 5 toys allow the toy to be added to the cart
	if (cart.length<5){
		cart.push({toy_name:activeName,photo:activePhoto,toy_id:activeID});
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
	$('#removedFromCart').hide();
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
			var newEntry=$('<li>',{id:'cart'+cart[i].toy_id});
			var newRow=$('<div>',{class:'row-fluid'});
			//Fill picture column
			var picCol =$('<div>',{class:'span2'});
			var pic=$('<img>',{src:cart[i].photo});
			picCol.append(pic);
			newRow.append(picCol);

			//Fill in toy name
			var nameCol=$('<div>',{class:'span5 vertical'});
			nameCol.html(cart[i].toy_name);
			newRow.append(nameCol);

			//Fill in x button
			var buttonCol=$('<div>',{class:'span1 offset4 pull-right vertical'});
			var xbutton = $('<button>',{type:"button",class:"close",html:'&times'}); //data-dismiss:"alert", 
			buttonCol.append(xbutton);
			newRow.append(buttonCol);
			xbutton.click(assignClick(cart[i].toy_id, i));
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
			var ownerEntry= $('<li>',{class:'active',id:cart[i].toy_id});
		}
		//Otherwise just make it and don't classify it as active
		else{
			var ownerEntry= $('<li>',{id:cart[i].toy_id});
		}
		//Create the link containing the toy name for the tab
		var owner = $('<a>',{href:'#message'+i,text:cart[i].toy_name});
		owner.attr('data-toggle','tab');
		ownerEntry.append(owner);
		$('#ownerList').append(ownerEntry);

		//Create message body
		//If the first tab-pane then force it active. Otherwise do not.
		if (i==0){
			var tabPane=$('<div>',{class:'tab-pane active message',id:'message'+i});
		}
		else{
			var tabPane=$('<div>',{class:'tab-pane message',id:'message'+i});
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


	//Content for message
	var toyID = $('#ownerList li.active').attr('id');
	var message = $('.message.tab-pane.active textarea').val();
	addMessage(toyID,message);

	if ($('#ownerList li').length!=1){
		//is it the first tab in the row
		if (tabNum==$('#ownerList li:first a').attr('href').split('message')[1]){
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
	updatePaging();
	populateToys(1);
}
//Clear all checkbox filters and trigger filter
function clearAllFilters(){
	$('#categories :checkbox').prop('checked',false);
	//Remove all current displayed toys
	$('#toyWrapper').children().remove();
	$('#firstPagingButton').nextUntil('#lastPagingButton').remove();
	$('#firstPagingButton').addClass('.disabled');
	$('#lastPagingButton').addClass('disabled');
}


function populateToys(pageNum){
	console.log('in populate toys')
	var cats=getCheckedCats();
	if (cats.length==0){
		$('#toyWrapper').children().remove();
	}
	else{
		$.post(
			'getToys.php',
			{'searchFilter':$('#searchFilter').val(),'ageFilter':$('#ageRangeFilter').val(),'cats':cats,'numPerPage':$('#numPer').val(),'pageNum':pageNum},
			function(data){
				//Remove all current displayed toys
				$('#toyWrapper').children().remove();
				//Reset number of toys per row
				numPerRow={1:0};
				var parsed=JSON.parse(data);
				//console.log(parsed);
				for (i=0;i<parsed.length;i++){
					console.log(parsed[i]);
					var newToy = new Toy(parsed[i]['toy_id'],parsed[i]['toy_name'],parsed[i]['toy_age_range'],parsed[i]['toy_condition'],parsed[i]['toy_category'],parsed[i]['toy_description'],parsed[i]['toy_photo']);
					console.log(newToy);
					addNewToy(newToy);
				}
				// console.log('total pages: '+totalPages);
				// console.log('pageNum: '+pageNum);
				//Update the paging button labels
				$('#firstPagingButton').nextUntil('#lastPagingButton').remove();
				if (pageNum==-1 || pageNum==totalPages){
					$('#lastPagingButton').addClass('disabled');
					pageNum=totalPages;
				}
				else{
					$('#lastPagingButton').removeClass('disabled');
				}
				if (pageNum==1){
					$('#firstPagingButton').addClass('disabled');
				}
				else{
					$('#firstPagingButton').removeClass('disabled');
				}
				$('#firstPagingButton').removeClass('active');
				$('#lastPagingButton').removeClass('active');
				var li = $('<li>');
				var a = $('<a>');
				for (i=pageNum-2;i<=pageNum+2;i++){
					if(i>0 && i<=totalPages){
						liClone=li.clone();
						aClone=a.clone();
						liClone.append(aClone);
						aClone.text(i);
						if(pageNum==i){
							liClone.addClass('active');
						}
						liClone.insertBefore('#lastPagingButton');
					}
				}
				registerPagingClick();
			}
		);
	}
}


function updatePaging(){
	var cats=getCheckedCats();
	$.post(
		'updateFindPaging.php',
		{'searchFilter':$('#searchFilter').val(),'ageFilter':$('#ageRangeFilter').val(),'cats':cats,'numPerPage':$('#numPer').val()},
		function(data){
			liarray=[];
			var li = $('<li>');
			var a = $('<a>');
			$('#firstPagingButton').nextUntil('#lastPagingButton').remove();
			if(data==1){
				$('#lastPagingButton').addClass('disabled');
			}
			else{
				$('#lastPagingButton').removeClass('disabled');
			}
			//Create paging buttons
			for (i=1;i<=Math.min(data,3);i++){
				var liClone=li.clone();
				var aClone=a.clone();
				if (i==1){
					liClone.addClass('active');
				}
				aClone.text(i);
				liClone.append(aClone);
				liarray.push(liClone);
			}
			for (i=0;i<liarray.length;i++){
				liarray[i].insertBefore('#lastPagingButton');
			}
			totalPages=data;
			registerPagingClick();
		}
	);
}

function getCheckedCats(){
	var checkedCats = [];
	//Get all checked categories
	$('#categories :checked').each(function(i){
		//Add the category name to an array
		checkedCats.push($(this).parent().text().trim());
	});
	return checkedCats;
}

function isInCart(id){
	for (i=0;i<cart.length;i++){
		if (id==cart[i]['toy_id']){
			return true;
		}
	}
	return false;
}

function registerPagingForFirstAndLast(){
	//Register pagination click handling
	$('.endPaging').click(function(e){
		if ($(this).hasClass('active') || $(this).hasClass('disabled')){
			return;
		}
		$('.pagination li.active').removeClass('active');
		$(this).addClass('active');
		var firstOrLast=$('.pagination li.active a').html();
		if (firstOrLast=='First'){
			populateToys(1);
		}
		else{
			populateToys(-1);
		}
	});
}
function registerPagingClick(){
	//Register pagination click handling
	$('.pagination li:not(.endPaging)').click(function(e){
		if ($(this).hasClass('active') || $(this).hasClass('disabled')){
			return;
		}

		$('.pagination li.active').removeClass('active');
		$(this).addClass('active');
		populateToys($('.pagination li.active a').html());
	});
}