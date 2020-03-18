// JavaScript taken from http://qliksite.io/tutorials/qliksense-visualization-extensions/part-01/07-Custom-Properties/#
define( [], function () {
    'use strict';

    // *****************************************************************************
    // Dimensions & Measures                                                               
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 2, 
        max: 3  
    };

    var measures = {
        uses: "measures",
        min: 1,
        max: 1
    };

// these arrays contain the colors displayed in the palettes. the actual number of entries doesn't seem to match the name of the palette. 
var defaultUse=!![]; // true = palette, faalse = custom
var defaultRev=![]; // false = no reverse
var defaultGradientCalc="absolute";
var defaultGradientRange="full";
var defaultPalette="qlik10";
var defaultCustomColors="#4477aa,#7db8da,#b6d7ea,#46c646,#f93f17,#ffcf02,#b0afae,#7b7a78,#545352"; // copied from example (TODO match q10?)
var q10=['#332288', '#6699cc', '#88ccee', '#44aa99', '#117733', '#999933', '#ddcc77', '#661100', '#cc6677', '#aa4466', '#882255', '#aa4499'];
var q100=['#99c867', '#e43cd0', '#e2402a', '#66a8db', '#3f1a20', '#e5aa87', '#3c6b59', '#e9b02e', '#7864dd', '#65e93c', '#5ce4ba', '#d0e0da', '#d796dd', '#64487b', '#986717', '#408c1d', '#dd325f', '#533d1c', '#2a3c54', '#db7127', 
'#72e3e2', '#d47555', '#7d7f81', '#3a8855', '#5be66e', '#a6e332', '#e39e51', '#4f1c42', '#273c1c', '#aa972e', '#bdeca5', '#63ec9b', '#aaa484', '#9884df', '#e590b8', '#44b62b', '#ad5792', '#c65dea', '#e670ca', '#29312d', 
'#6a2c1e', '#d7b1aa', '#b1e7c3', '#cdc134', '#9ee764', '#65464a', '#3c7481', '#3a4e96', '#6493e1', '#db5656', '#bbabe4', '#d0607d', '#759f79', '#9d6b5e', '#8574ae', '#ad8fac', '#4b77de', '#647e17', '#b9c379', '#b972d9', 
'#7ec07d', '#916436', '#2d274f', '#dce680', '#759748', '#dae65a', '#459c49', '#b7934a', '#9ead3f', '#969a5c', '#b9976a', '#46531a', '#c0f084', '#76c146', '#2ca02c'];//, '#d62728', '#9467bd', '#8c564b', '#e377c2', '#1f77b4'];
//'#7f7f7f', '#17becf', '#aec7e8', '#ff7f0e', '#ffbb78', '#ff9896', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5', '#393b79', '#5254a3', '#6b6ecf', '#637939', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#843c39']; 

    // *****************************************************************************
    // Appearance Section NOTE THAT DESPITE DEFAULT VALUES, SOMETIMES A SELECTION HAS TO CHANGE IN ORDER FOR IT TO SHOW UP IN LAYOUT 
	// SO EXTERNALIZE YOUR DEFAULTS AND IF YOU CAN"T FIND A VALUE IN LAYOUT, USE THOSE.
    // *****************************************************************************
    var appearanceSection = {
        uses: "settings",
		items: {
		    colorsandlegend:{
				label:"Colors", // usually colors and legend but we're not legending here. 
				type:"items",
				grouped:!![], // not sure what grouped does but its true
				items:{
					usePalette: {
						ref:"color.usePalette",
						type:"boolean",
						label:"Colors",
						component:"switch",
						defaultValue:defaultUse, //true
						options:[{
							value:!![], //true
							label:"Use Color Scheme"
						},{
							value:![], // false
							 label:"Use Custom Colors"
						}]
					},
					paletteItems: {
						ref:"color.colorPalette",
						type:"string",
						component:"item-selection-list", 
						defaultValue:defaultPalette, 
						horizontal:0x0,
						items:[{
							icon:"",
							label:"Qlik\x20Sense",
							component:"color-scale",
							reverse: function(m){              // basically called on every mouse event, return boolean value of reverse setting. 
								return typeof(m.colors)!='undefined'?m.colors.reverse:defaultRev;
							},
							value:"qlik10",
							type:"sequential",
							colors:q10
						},{
							icon:"",
							label:"Qlik\x20Sense\x20100",
							component:"color-scale",
							reverse: function(m){ // basically called on every mouse event
								return typeof(m.colors)!='undefined'?m.colors.reverse:defaultRev;
							},
							value:"qlik100",
							type:"sequential",
							colors:q100
						}],
						show:function(m) {
							return typeof(m.color)!='undefined'?m.color.usePalette:defaultUse;    //==!![] is implied?
						}
					},
					customPalette: {
						ref:"color.colorPaletteCustom",
						type:"string",
						expression:"optional",
						defaultValue:defaultCustomColors, 
						show: function(m) {
							return typeof(m.color)!='undefined'? m.color.usePalette==![]:!defaultUse;
						}
					},
				   descTest: {
						label: "Comma\x20separated\x20list\x20of\x20HEX\x20colors", // all this just to show a bit of text (smh)
						component: "text",
						show:function(m) {
							return typeof(m.color)!='undefined'?m.color.usePalette==![]:!defaultUse;
						}
					},
					reverseColors: {
						type: "boolean",  // a checkbox by default.
						ref: "colors.reverse",
						label: "Reverse\x20Colors",
						defaultValue: defaultRev
					}/*,
					'consistentcolors': {
						'type': 'boolean', // to use same colors regardlesss of selection.. whatever. 
						'ref': 'color.consistent',
						'label': 'Consistent\x20Colors',
						'defaultValue': ![]
					}*/
				}//end colors and legend items
			}, //end colors and legend
			
		    GradientCalc: {
				label:"Measure Is",
				component:"dropdown",
				ref: "props.gradientCalc",
				type:"string",
				defaultValue:defaultGradientCalc,
				options:[
					{label:"Absolute",value:"absolute"},
					{label:"Duration",value:"duration"}
				],
				order:0
			},
		    GradientRange: {
				label:"Gradient Relative To",
				component:"dropdown",
				ref: "props.gradientRange",
				type:"string",
				defaultValue:defaultGradientRange,
				options:[
					{label:"Full Dataset",value:"full"},
					{label:"Dimension 1",value:"dimension1"},
					{label:"Dimension 2",value:"dimension2"}
				],
				order:0
			} 
		}//end appearanc items
    }; //end appearance section

	var sorting = {uses:"sorting"};
	
	var addons =  { uses: "addons",  
					 items: {  
						  dataHandling: {  
							   uses: "dataHandling"  
						  }  
					 }  
				};
	
    // *****************************************************************************
    // Main property panel definition  SHOULD appearance be settings? 
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************
    return {
	    defaults: {
		    defaultUse:defaultUse, // default for color.usePalette
			defaultPalette:defaultPalette, // default for color.colorPalette
			defaultRev:defaultRev, // default for colors.reverse
			defaultGradientCalc:defaultGradientCalc, // default for props.gradientCalc
			defaultGradientRange:defaultGradientRange, // default for props.gradientRange
			defaultCustomColors:defaultCustomColors, // default for color.colorPaletteCustom
			qlik10:q10,
			qlik100:q100
		},
	    definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: dimensions,
				measures: measures,
				sorting: sorting,
				addons: addons,
				appearance: appearanceSection
			}
		}
    };
} );