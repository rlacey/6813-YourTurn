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
	var toy2= new toy(1,'Toy Name','1-4','new',['cat1','cat2'],'desc',"images/wallpaper.jpg");
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
	if (col!=1){
		var colDiv= $('<div>', {id:'row'+numRows+'col'+col,class:'span3 toyEntry '});
	}
	else{
		var colDiv= $('<div>', {id:'row'+numRows+'col'+col,class:'span3 toyEntry'});
	}
	row.append(colDiv);


	var pic= $('<img>',{src:toy.photo, class:'img-polaroid', style:"cursor:hand;cursor:pointer; max-width:300px; width: 90%; height: 10em;" });
	colDiv.append(pic);

	//Register click on image bringing modal
	pic.click({'toy':toy},function(e){
		moreDetails(e);
	});


	var text=$('<p>',{class:'toyBrief', html:'<strong>Name</strong>:'+toy.name+'<br><strong>Condition</strong>:'+toy.condition});
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
	console.log(toy);
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
	cart.push({name:activeName,photo:activePhoto});
	$('#modalToy').modal('hide');
	$('#cartConfirmation').show();
}

function viewCart(){
	var cartList=$('#cartList');
	for (i=0;i<cart.length;i++){
		var newEntry=$('<li>',{id:'cart'+cart[i].name.replace(/\s/g, '')});
		var newRow=$('<div>',{class:'row-fluid'});
		//Fill picture column
		var picCol =$('<div>',{class:'span2'});
		var pic=$('<img>',{src:cart[i].photo});
		picCol.append(pic);
		newRow.append(picCol);
		console.log(newRow);

		//Fill in toy name
		console.log('toyName i: '+i)
		var nameCol=$('<div>',{class:'span5 vertical'});
		nameCol.html(cart[i].name);
		newRow.append(nameCol);

		//Fill in x button
		console.log('xbutton i: '+i)
		var buttonCol=$('<div>',{class:'span1 offset4 pull-right vertical'});
		var xbutton = $('<button>',{type:"button",class:"close",html:'&times'}); //data-dismiss:"alert", 
		buttonCol.append(xbutton);
		newRow.append(buttonCol);
		xbutton.click(assignClick(cart[i].name, i));
		console.log('after registering click i: '+i)
		//put row in li entry
		newEntry.append(newRow);
		//Put li in UL
		cartList.append(newEntry);

		if(i!=cart.length-1){
			var divider=$('<li>', {class:'divider'});
			cartList.append(divider);
		}
		console.log('done i: '+i)
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
	console.log(row);
	console.log(toyName);
	var rowToDelete=$('#cart'+toyName.replace(/\s/g, ''));
	if (row != cartSize-1){
		$('#cart'+toyName.replace(/\s/g, '') +'~ .divider:first').remove();
	}
	//remove list entry with toy
	rowToDelete.remove();
	cart.splice(row,1);
	//finished splicing
}


function clearCart(){
	$('#cartList').children().remove();
}

function checkout(){
	alert('not implemented');
}