/**
 *
 *  @author Amruth Venkatraman
 */

 var numRows=1;
 var capPerRow=3;
 var numPerRow={1:0}

$(document).ready(function(){
	var toy1= new toy(1,'badddddddddddddddddddddddddddddddddddddddddd','1-4','new','cat1','desc',"images/original.png");
	addNewToy(toy1);
	addNewToy(toy1);
	addNewToy(toy1);
	addNewToy(toy1);
	addNewToy(toy1);

});

function addNewToy(toy){
	console.log('in add new toy')
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
	console.log(pic);
	colDiv.append(pic);

	//Register click on image bringing modal
	pic.click(function(toy){
		moreDetails(toy)
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

function moreDetails(toy){
	alert('sup')
}