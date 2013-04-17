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

$(document).ready(function(){
	var toy1= new toy(1,'abc','1-4','new',['cat1','cat2'],'desc',"images/original.png");
	var toy2= new toy(1,'Toy Name','1-4','new',['cat1','cat2'],'desc',"images/logo_black.png");
	var toy3= new toy(1,'ghi','1-4','new',['cat1','cat2'],'desc',"images/logo_inverted.png");
	addNewToy(toy1);
	addNewToy(toy2);
	addNewToy(toy3);
	addNewToy(toy1);
	addNewToy(toy2);

	//Register handler to clean the cart
	$('#modalCart').on('hidden', function () {
    	clearCart();
	})
});

function addNewToy(toy){
	if (numPerRow[numRows] + 1 <= capPerRow){
		numPerRow[numRows] += 1;
	}
	else{
		numRows+=1;
		numPerRow[numRows]=1;
	}
	var col=numPerRow[numRows];
	 
	if ($('#row'+numRows).length==0){
		var newRow = $('<div>', {id:'row'+numRows,class:'row-fluid toyRow'});
		$('#toyWrapper').append(newRow);
	}
	var row= $('#row'+numRows);
	
	var colDiv= $('<div>', {id:'row'+numRows+'col'+col,class:'span3 toyEntry'});
	row.append(colDiv);


	var pic= $('<img>',{src:toy.photo, class:'img-polaroid', style:"cursor:hand;cursor:pointer; max-width:300px; width: 90%; height: 10em;" });
	colDiv.append(pic);

	//Register click on image bringing modal
	pic.click({'toy':toy},function(e){
		moreDetails(e);
	});


	var text=$('<p>',{class:'toyBrief', html:toy.name});
	colDiv.append(text);
}

function toy(id, name, ageRange, condition, categories, description, photo){
	this.id=id;
	this.name=name;
	this.ageRange=ageRange;
	this.categories=categories;
	this.condition=condition;
	this.description=description;
	this.photo=photo;
}

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

function addToCart(){
	$('#finalCheckoutConfirmation').hide();
	if (cart.length<5){
		cart.push({name:activeName,photo:activePhoto});
		$('#cartConfirmation').show();
	}
	else{
		$('#cartFullAlert').show();
	}
	$('#modalToy').modal('hide');

	
}

function viewCart(){
	$('#cartConfirmation').hide();
	var cartList=$('#cartList');
	if (cart.length==0){
		$('#emptyCart').show();
 		$('#checkoutButton').attr("disabled", true);

	}
	else{
		$('#emptyCart').hide();
		$('#checkoutButton').attr("disabled", false);
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

			if(i!=cart.length-1){
				var divider=$('<li>', {class:'divider'});
				cartList.append(divider);
			}
		}
	}
	$('#modalCart').modal({});
}


//Click helper
function assignClick(toyName,i){
	return function(event){
		removeFromCart(toyName,i);
	}
}

function removeFromCart(toyName,row){
	cartSize=cart.length;
	var rowToDelete=$('#cart'+toyName.replace(/\s/g, ''));
	if (row != cartSize-1){
		$('#cart'+toyName.replace(/\s/g, '') +'~ .divider:first').remove();
	}
	//remove list entry with toy
	rowToDelete.remove();
	cart.splice(row,1);
	//finished splicing

	if(cart.length==0){
		$('#emptyCart').show();
		 $('#checkoutButton').attr("disabled", true);
	}
}


function clearCart(){
	$('#cartList').children().remove();
}

function checkout(){
	$('#modalCart').modal('hide');
	$('#checkoutMessageConfirmation').hide();
	for(i=0;i<cart.length;i++){
		//Create the tab
		if (i==0){
			var ownerEntry= $('<li>',{class:'active'});
		}
		else{
			var ownerEntry= $('<li>');
		}
		var owner = $('<a>',{href:'#message'+i,text:cart[i].name});
		owner.attr('data-toggle','tab');
		ownerEntry.append(owner);
		$('#ownerList').append(ownerEntry);

		//Create message body
		if (i==0){
			var tabPane=$('<div>',{class:'tab-pane active',id:'message'+i});
		}
		else{
			var tabPane=$('<div>',{class:'tab-pane',id:'message'+i});
		}
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
			console.log(' not first tab');
			//Set next tab to active
			$('#ownerList li.active').next().addClass('active');
			//Set next tab body to active
			$('#message'+(tabNum+1)).addClass('active');
		}
		else{
			//Set previous tab to active
			$('#ownerList li.active').prev().addClass('active');
			//Set previous tab body to active
			$('#message'+(tabNum-1)).addClass('active');
		}
		activeTab.remove();
		activeTabBody.remove();
		$('#checkoutMessageConfirmation').show();
	}
	//Last message to toy owner
	else{
		$('#modalCheckout').modal('hide');
		$('#finalCheckoutConfirmation').show();
	}

	//Remove item from cart
	cart.splice(tabBodyID,1);
}