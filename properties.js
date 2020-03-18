define(["qlik", "text!./d3_streamGraph.qext"], function(qlik, qext) {
  "use strict";

  const COLOR_SCALES = Object.freeze({
    SEQUENTIAL: Object.freeze([
      "#FEE391",
      "#FEC44F",
      "#FE9929",
      "#EC7014",
      "#CC4C02",
      "#993404",
      "#662506"
    ]),
    SEQUENTIAL_REVERSE: Object.freeze([
      "#662506",
      "#993404",
      "#CC4C02",
      "#EC7014",
      "#FE9929",
      "#FEC44F",
      "#FEE391"
    ]),
    DIVERGING_RDYLBU: Object.freeze([
      "#D73027",
      "#F46D43",
      "#FEE090",
      "#ABD9E9",
      "#74ADD1",
      "#4575B4"
    ]),
    DIVERGING_BUYLRD: Object.freeze([
      "#D73027",
      "#FDAE61",
      "#ABD9E9",
      "#4575B4"
    ]),
    BLUES: Object.freeze([
      "#DEEBf7",
      "#C6DBEF",
      "#9ECAE1",
      "#6BAED6",
      "#4292C6",
      "#2171B5",
      "#08519C",
      "#08306B"
    ]),
    REDS: Object.freeze([
      "#FEE0D2",
      "#FCBBa1",
      "#FC9272",
      "#FB6A4A",
      "#EF3B2C",
      "#CB181D",
      "#A50F15",
      "#67000D"
    ]),
    YLGNBU: Object.freeze([
      "#EDF8B1",
      "#C7E9B4",
      "#7FCDBB",
      "#41B6C4",
      "#1D91C0",
      "#225EA8",
      "#253494",
      "#081D58"
    ]),
    TWELVE_COLORS: Object.freeze([
      "#332288",
      "#6699CC",
      "#88CCEE",
      "#44AA99",
      "#117733",
      "#999933",
      "#DDCC77",
      "#661100",
      "#CC6677",
      "#AA4466",
      "#882255",
      "#AA4499"
    ]),
    TWELVE_COLORS_REVERSE: Object.freeze(
      [
        "#332288",
        "#6699CC",
        "#88CCEE",
        "#44AA99",
        "#117733",
        "#999933",
        "#DDCC77",
        "#661100",
        "#CC6677",
        "#AA4466",
        "#882255",
        "#AA4499"
      ].reverse()
    ),
    BLUE_PURPLE: Object.freeze([
      "#1ABC9C",
      "#7F8C8D",
      "#2ECC71",
      "#BDC3C7",
      "#3498DB",
      "#C0392B",
      "#9B59B6",
      "#D35400",
      "#34495E",
      "#F39C12",
      "#16A085",
      "#95A5A6"
    ]),
    BREEZE: Object.freeze([
      "#138185",
      "#26A0A7",
      "#65D3DA",
      "#79D69F",
      "#70BA6E",
      "#CBE989",
      "#EBF898",
      "#F9EC86",
      "#FAD144",
      "#EC983D",
      "#D76C6C",
      "#A54343"
    ])
  });
  //Qlik Help Site: https://help.qlik.com/en-US/sense-developer/February2018/Subsystems/Extensions/Content/Howtos/working-with-custom-properties.htm
  var app = qlik.currApp(this);

  var AllComponents = {
    type: "items",
    label: "All components",
    items: {
      allComponents_Switch: {
        ref: "prop.allComponents_Switch",
        label: "Switch",
        component: "switch",
        type: "boolean",
        options: [
          {
            value: true,
            label: "On"
          },
          {
            value: false,
            label: "Off"
          }
        ],
        defaultValue: true
      },
      allComponents_String: {
        ref: "prop.allComponents_String",
        label: "String",
        type: "string",
        defaultValue: "",
        expression: "optional",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Textarea: {
        label: "Textarea",
        component: "textarea",
        rows: 3,
        maxlength: 140,
        ref: "prop.Textarea",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Slider: {
        type: "number",
        component: "slider",
        label: "Slider",
        ref: "prop.allComponents_Slider",
        min: 1,
        max: 100,
        step: 10,
        defaultValue: 1,
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_RangeSlider: {
        type: "array",
        component: "slider",
        label: "Range slider",
        ref: "prop.allComponents_RangeSlider",
        min: 10,
        max: 20,
        step: 0.5,
        defaultValue: [13, 17],
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Buttongroup: {
        type: "string",
        component: "buttongroup",
        label: "Buttongroup",
        ref: "prop.allComponents_Buttongroup",
        options: [
          {
            value: "value1",
            label: "Value 1"
          },
          {
            value: "value2",
            label: "Value 2"
          }
        ],
        defaultValue: "value1",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_ColorPicker: {
        ref: "prop.allComponents_ColorPicker",
        label: "ColorPicker",
        component: "color-picker",
        type: "object",
        defaultValue: {
          index: 12,
          color: "#000000"
        },
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Integrer: {
        type: "integer",
        label: "Integer",
        ref: "prop.allComponents_Integrer",
        defaultValue: "10",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Number: {
        type: "number",
        label: "Number",
        ref: "prop.allComponents_Number",
        defaultValue: "8.5",
        max: "20",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Button: {
        label: "Button",
        component: "button",
        action: function(data) {
          //add your button action here
          alert(
            "Extension name '" +
              data.visualization +
              "' and have id '" +
              data.qInfo.qId +
              "'."
          );
        },
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Checkbox: {
        type: "boolean",
        label: "Checkbox",
        ref: "prop.allComponents_Checkbox",
        defaultValue: true,
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Dropdown: {
        type: "string",
        component: "dropdown",
        label: "Dropdown",
        ref: "prop.allComponents_Dropdown",
        options: [
          {
            value: "value1",
            label: "Value 1"
          },
          {
            value: "value2",
            label: "Value 2"
          }
        ],
        defaultValue: "value1",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Link: {
        label: "Link",
        ref: "prop.allComponents_Link",
        component: "link",
        url: "http://www.qlik.com/",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      allComponents_Radiobuttongroup: {
        type: "string",
        component: "radiobuttons",
        label: "Radio-buttons",
        ref: "prop.allComponents_Radiobuttongroup",
        options: [
          {
            value: "value1",
            label: "Value 1"
          },
          {
            value: "value2",
            label: "Value 2"
          }
        ],
        defaultValue: "value1",
        show: function(data) {
          return data.prop.allComponents_Switch;
        }
      },
      colors: {
        ref: "ColorSchema",
        type: "string",
        component: "item-selection-list",
        label: "Color",
        show: true,
        defaultValue: COLOR_SCALES.TWELVE_COLORS,
        items: [
          /*{
              component: "color-scale",
              colors: COLOR_SCALES.SEQUENTIAL,
              value: COLOR_SCALES.SEQUENTIAL,
              label: "Sequential"
            }, {
              component: "color-scale",
              colors: COLOR_SCALES.SEQUENTIAL_REVERSE,
              value: COLOR_SCALES.SEQUENTIAL_REVERSE,
              label: "Sequential (Reverse)"
            }, {
              component: "color-scale",
              colors: COLOR_SCALES.DIVERGING_RDYLBU,
              value: COLOR_SCALES.DIVERGING_RDYLBU,
              label: "Diverging RdYlBu"
            }, {
              component: "color-scale",
              colors: COLOR_SCALES.DIVERGING_BUYLRD,
              value: COLOR_SCALES.DIVERGING_BUYLRD,
              label: "Diverging BuYlRd"
            }, {
              component: "color-scale",
              colors: COLOR_SCALES.BLUES,
              value: COLOR_SCALES.BLUES,
              label: "Blues"
            }, {
              component: "color-scale",
              colors: COLOR_SCALES.REDS,
              value: COLOR_SCALES.REDS,
              label: "Reds"
            }, {
              component: "color-scale",
              colors: COLOR_SCALES.YLGNBU,
              value: COLOR_SCALES.YLGNBU,
              label: "YlGnBu"
            },*/ {
            component: "color-scale",
            colors: COLOR_SCALES.TWELVE_COLORS,
            value: COLOR_SCALES.TWELVE_COLORS,
            label: "12 colors"
          },
          {
            component: "color-scale",
            colors: COLOR_SCALES.TWELVE_COLORS_REVERSE,
            value: COLOR_SCALES.TWELVE_COLORS_REVERSE,
            label: "12 colors (Reverse)"
          },
          {
            component: "color-scale",
            colors: COLOR_SCALES.BLUE_PURPLE,
            value: COLOR_SCALES.BLUE_PURPLE,
            label: "Blue purple colors"
          },
          {
            component: "color-scale",
            colors: COLOR_SCALES.BREEZE,
            value: COLOR_SCALES.BREEZE,
            label: "Breeze theme colors"
          }
        ]
      }
    }
  };

  //SelectionMode
  var SelectionMode = {
    type: "items",
    label: "Selections",
    items: {
      SelectionModeDropdown: {
        type: "string",
        component: "dropdown",
        label: "Selection Mode",
        ref: "prop.SelectionMode",
        options: [
          {
            value: "q",
            label: "Quick"
          },
          {
            value: "c",
            label: "Confirm"
          }
        ],
        defaultValue: "c"
      }
    }
  };

  // Appearance section
  var appearanceSection = {
    uses: "settings",
    items: {
      AllComponents: AllComponents
    }
  };

  // Settings section
  var settingsSection = {
    type: "items",
    label: "Settings",
    items: {
      SelectionMode: SelectionMode
    }
  };

  // About section
  var aboutSection = {
    type: "items",
    label: "About",
    items: {
      Name: {
        label: "Name: " + JSON.parse(qext).name,
        component: "text"
      },
      Version: {
        label: "Version: " + JSON.parse(qext).version,
        component: "text"
      },
      Author: {
        label: "Author: " + JSON.parse(qext).author,
        component: "text"
      },
      ID: {
        label: "Extension Id",
        component: "button",
        action: function(data) {
          alert(data.qInfo.qId);
        }
      }
    }
  };

  return {
    type: "items",
    component: "accordion",
    items: {
      dimensions: {
        uses: "dimensions",
        min: 1,
        max: 2
      },
      measures: {
        uses: "measures",
        min: 1,
        max: 1
      },
      sorting: {
        uses: "sorting"
      },
      addons: {
        uses: "addons",
        items: {
          dataHandling: {
            uses: "dataHandling"
          }
        }
      },
      appearance: appearanceSection,
      settings: settingsSection,
      about: aboutSection
    }
  };
});
