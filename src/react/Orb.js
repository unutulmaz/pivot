"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3","src/common/HTMLWidget","../common/Utility","../common/PropertyExt","css!orb", "css!./Orb"], factory);
    } else {
        root.template_Orb = factory(root.d3, root.common_HTMLWidget, root.common_Utility, root.common_PropertyExt, root.React);
    }
}(this, function (d3, HTMLWidget, Utility, PropertyExt) {
    var orb = null
    function Orb(target) {
        HTMLWidget.call(this);
        this.fields =[];
		this.savedFields = [];
		this.rowsavFields = [];
		this.dataFields = [];
		this.columnFields = [];

    }


function mapping(owner){
	PropertyExt.call(this);
	this._owner = owner;
}


// var fields =[];
// var savedField = [];
// var rowFields = [];
// var dataFields = [];
// var columnFields = [];





mapping.prototype = Object.create(PropertyExt.prototype);
mapping.prototype.constructor = mapping;
mapping.prototype._class += " react_Orb";
mapping.prototype.publish("addField", "", "set", "Show Toolbox or not",function() { return this._owner ? this._owner.columns() : [];}, {optional: true} );
mapping.prototype.publish("location", true, "set", "Data Location",['row','column','data'], { tags: ["basic"] });
mapping.prototype.publish("aggregateFunc", "", "set", "Aggregate Function type",['sum','count','min','max','avg','prod','var','varp','stdev','stdevp'], {optional: true} );
mapping.prototype.publish("formatFunction","","string","Format function");







Orb.prototype = Object.create(HTMLWidget.prototype);
Orb.prototype.constructor = Orb;
Orb.prototype._class += " react_Orb";

Orb.prototype.mapping = mapping;
Orb.prototype.publish("stringProp", "defaultValue", "string", "Sample Property");

Orb.prototype.publish("toolbar", true, "boolean", "Show Toolbox or not", null, { tags: ["basic"] });
Orb.prototype.publish("themeColor", "blue", "set", "Theme color", ['blue','red','black','green'], { tags: ["basic"] });
Orb.prototype.publish("newField" ,[], "propertyArray", "Source Columns", null, { autoExpand : mapping});
Orb.prototype.publish("removeField", "", "set", "Show Toolbox or not", Orb.prototype.columns,{ tags: ["basic"] },{optional: true});

Orb.prototype.publish("columnGrandTotal", true, "boolean", "Show Grand total or not");
Orb.prototype.publish("rowGrandTotal", true, "boolean", "Show Grand total or not");
Orb.prototype.publish("movable", true, "boolean", "Fields can be moved or not");

    





	Orb.prototype.orbConfig = function (ds,fs,rowFields,columnFields,dataFields) {

    	var config = {
	  
			dataSource:ds,
			canMoveFields: this.movable(), 
	        dataHeadersLocation: 'columns',
	        width: 1199,
	        height: 711,
	        theme: this.themeColor(),
	        toolbar: {
	            visible: this.toolbar()
	        },
	        grandTotal: {
	            rowsvisible: this.rowGrandTotal(),
	            columnsvisible: this.columnGrandTotal()
	        },
	        subTotal: {
	            visible: true,
	            collapsed: false,
	            collapsible: true
	        },
	        rowSettings: {
	            subTotal: {
	                visible: true,
	                collapsed: false,
	                collapsible: true
	            }
	        },
	        columnSettings: {
	            subTotal: {
	                visible: true,
	                collapsed: false,
	                collapsible: true
	            }
	        },
	        fields: fs,
	        rows: rowFields,
	        columns: columnFields,
	        data: dataFields

	    }

	    return config;
	    	
    };
    

    Orb.prototype.enter = function (domNode, element) {
        
        HTMLWidget.prototype.enter.apply(this, arguments);

        var ds = this.data();
		var columns = this.columns();

        this._div = element.append("div").attr("id", this.id() + "_orb")
       
        

        this._orb = new orb.pgridwidget(this.orbConfig())
	    this._orb.render(document.getElementById(this.id() + "_orb"));
              
        
    };


    Orb.prototype.update = function (domNode, element) { 
    
		HTMLWidget.prototype.update.apply(this, arguments);      

		var ds = this.data();
		var columns = this.columns();
               
       for (var i=0;i<fields.length;i++){
       		if (savedField.indexOf(fields[i].caption) == -1){
       			savedField.push(fields[i].caption);
       		}
       		
       }
  	

    	for (var k=0;k<this.newField().length;k++){
    		if (savedField.indexOf(this.newField()[k].__prop_addField) == -1){

    		   var fieldIndex = columns.indexOf(this.newField()[k].__prop_addField);

    		   if (fieldIndex != -1){
	    		   fields.push({
	    		   		name: fieldIndex.toString(),
	    		   		caption: this.newField()[k].__prop_addField
	    		   })
    		   }
    		  
    		
	       }
    	}

       	
    	for (var k=0; k<this.newField().length; k++){
    		// if (this.newField()[k].__prop_addField != null && savedTableField.indexOf(this.newField()[k].__prop_addField) == -1){
    		if (this.newField()[k].__prop_addField != null){
    			switch(this.newField()[k].__prop_location){    				

    				case 'row':
    					if (rowFields.indexOf(this.newField()[k].__prop_addField) == -1){
    						rowFields.push(this.newField()[k].__prop_addField);
    						// savedTableField.push(this.newField()[k].__prop_addField);

    						var columnIndex = columnFields.indexOf(this.newField()[k].__prop_addField);
    						var dataIndex = dataFields.indexOf(this.newField()[k].__prop_addField);
    						if (columnIndex > -1){
    							columnFields.splice(columnIndex,1)
    						}
    						if (dataIndex > -1){
    							dataFields.splice(dataIndex,1)
    						}
    					}
    					
    					break;

    				case 'column':
	    				if (columnFields.indexOf(this.newField()[k].__prop_addField) == -1){
	    					columnFields.push(this.newField()[k].__prop_addField);
	    					// savedTableField.push(this.newField()[k].__prop_addField);

		    				var rowIndex = rowFields.indexOf(this.newField()[k].__prop_addField);
							var dataIndex = dataFields.indexOf(this.newField()[k].__prop_addField);
							if (rowIndex > -1){
								rowFields.splice(columnIndex,1)
								}
							if (dataIndex > -1){
								dataFields.splice(dataIndex,1)
								}

		    				}
	    					break;

    				case 'data':
	    				if (dataFields.indexOf(this.newField()[k].__prop_addField) == -1){
	    					dataFields.push(this.newField()[k].__prop_addField);
	    					// savedTableField.push(this.newField()[k].__prop_addField);

	    					var rowIndex = rowFields.indexOf(this.newField()[k].__prop_addField);
							var columnIndex = columnFields.indexOf(this.newField()[k].__prop_addField);
							if (rowIndex > -1){
								rowFields.splice(columnIndex,1)
								}
							if (columnIndex > -1){
								columnFields.splice(dataIndex,1)
								}
	    					
	    				}

	    				break;
    			}
    		}
    	}



    	for (var k=0; k<this.newField().length; k++){
    		
			for (var i=0;i<fields.length;i++){
				
				if (fields[i].caption == this.newField()[k].__prop_addField){
					let ft = this.newField()[k].__prop_formatFunction;

					fields[i].dataSettings={
						aggregateFunc:this.newField()[k].__prop_aggregateFunc,
						formatFunc:function(value){
							return d3.format(ft)(value);
						}						
					}


				}
				
			}
		}

    	
    	if (this.removeField()){
    		for (var i=0;i<fields.length;i++){
    			if (fields[i].caption == this.removeField()){
    				fields.splice(i,1);
    				break;

    			}
    		}

    		for (var i=0;i<rowFields.length;i++){
    			if (rowFields[i] ==this.removeField()){
    				rowFields.splice(i,1);
    				break;
    			}
    		}

    		for (var i=0;i<columnFields.length;i++){
    			if (columnFields[i] ==this.removeField()){
    				columnFields.splice(i,1);
    				break;
    			}
    		}

    		for (var i=0;i<dataFields.length;i++){
    			if (dataFields[i] ==this.removeField()){
    				dataFields.splice(i,1);
    				break;
    			}
    		}
    	}
    	

    	
    	React.unmountComponentAtNode(document.getElementById(this.id() + "_orb"));
    	this._div = element.append("div").attr("id", this.id() + "_orb")
    	
 
    	this._orb = new orb.pgridwidget(this.orbConfig(ds,fields,rowFields,columnFields,dataFields))

        this._orb.render(document.getElementById(this.id() + "_orb"));

       
	        
	   
 		
    };

    Orb.prototype.exit = function (domNode, element) {
        
        this._div.remove();
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Orb.prototype.render = function (domNode, element) {
        if (!orb) {
            var context = this;
            var args = arguments;
            require(["orb-react"], function (React) {
                window.React = window.React || React;
                require(["orb"], function (_orb) {
                    orb = _orb;
                    HTMLWidget.prototype.render.apply(context, args);
                });
            });
        } else {
            HTMLWidget.prototype.render.apply(this, arguments);
        }
    };

    return Orb;
}));
