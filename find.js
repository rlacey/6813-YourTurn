/**
 *
 *  @author Amruth Venkatraman
 */

 var numRows=1;
 var capPerRow=3;
 var numPerRow={1:0};
 var cart=[];
 var activeName=null;
 var activePhoto=null;

$(document).ready(function(){
	var toy1= new toy(1,'Toy Name','1-4','new',['cat1','cat2'],'desc',"images/original.png");
	var toy2= new toy(1,'Toy Name','1-4','new',['cat1','cat2'],'desc',"images/logo_black.png");
	var toy3= new toy(1,'Toy Name','1-4','new',['cat1','cat2'],'desc',"images/logo_inverted.png");
	addNewToy(toy1);
	addNewToy(toy2);
	addNewToy(toy3);
	addNewToy(toy1);
	addNewToy(toy2);

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
		var colDiv= $('<div>', {id:'row'+numRows+'col'+col,class:'span3 toyEntry offset1'});
	}
	else{
		var colDiv= $('<div>', {id:'row'+numRows+'col'+col,class:'span3 toyEntry'});
	}
	row.append(colDiv);


	var pic= $('<img>',{src:toy.photo, class:'img-polaroid', style:"cursor:hand;cursor:pointer"});
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
	$('#modalCart').modal({});
}


function checkout(){
	alert('not implemented');
}