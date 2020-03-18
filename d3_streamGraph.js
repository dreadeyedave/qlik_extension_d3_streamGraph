define([
  "jquery",
  "qlik",
  "./libraries/d3.v4.min",
  "css!./d3_streamGraph.css",
  "./initialproperties",
  "./properties"
], function($, qlik, d3, css, initprops, props) {
  "use strict";

  var extensionNamespace = "object.MyVizExtension";
  var theme = {};
  var colourRange = [];
  var selectedColour = "";
  async function setTheme($element, qtheme) {
    theme.colourRange = qtheme.properties.palettes.data[0].scale[11];
    theme.selectedColour = qtheme.properties.dataColors.selectionColor;
    theme.gridLineColour = qtheme.properties.object.grid.line.major.color;
    theme.colour = qtheme.properties.color;
    console.log(qtheme.properties);
  }

  return {
    initialProperties: initprops,
    definition: props,
    support: {
      snapshot: true,
      export: true,
      exportData: true
    },
    paint: function paint($element, layout) {
      var self = this;
      var app = qlik.currApp(this);

      var hypercube = layout.qHyperCube;

      //Push data from the hypercube to the data array - 1 Dimension / 1 Measure
      var data = [];
      hypercube.qDataPages[0].qMatrix.forEach(function(qData) {
        data.push({
          d0Values: qData[0].qText,
          d1Values: qData[1].qText,
          mValues: qData[2].qNum,
          d0Index: qData[0].qElemNumber,
          d1Index: qData[1].qElemNumber
        });
      });

      // Create a list of distinct values for dimension 0
      const d0ValuesDictinst = [...new Set(data.map(x => x.d0Values))];

      //Create and empty array
      var dataSet = [];

      //Loop through each year
      d0ValuesDictinst.forEach(value => {
        //create first object which is a dimension0 and the year
        var newObj = { d0Values: value };

        //create a filter dataSet just for current looped year
        var filtered = data.filter(function(d2) {
          return d2.d0Values == value;
        });

        //create a utility to add values to object
        function addObjectValue(name, value) {
          newObj[name] = value;
        }

        //loop through each filtered record and add it to newObj
        filtered.forEach(el => {
          addObjectValue(el.d1Values, el.mValues);
        });

        //push new object into dataset
        dataSet.push(newObj);
      });

      //Create coloumn object
      var dims0 = ["d0Values"];
      var dims1 = [...new Set(data.map(x => x.d1Values))];

      dataSet.columns = dims0.concat(dims1);

      //Create the selection Map
      const selectionMap = {};
      const map = new Map();
      for (const item of data) {
        if (!map.has(item.d1Values)) {
          map.set(item.d1Values, true); // set any value to Map
          selectionMap[item.d1Values] = item.d1Index;
        }
      }

      var d0Label = hypercube.qDimensionInfo[0]["qFallbackTitle"],
        d1Label = hypercube.qDimensionInfo[1]["qFallbackTitle"],
        mLabel = hypercube.qMeasureInfo[0]["qFallbackTitle"];

      //console.log(layout);

      //console.log('QLIK', qlik);
      //console.log("HYPERCUBE", hypercube);
      //console.log("DATA", data);
      //debugger;

      //definition of margins (set to 0 on the template) and height/width variables
      var margin = {
        top: 0,
        right: 50,
        bottom: 0,
        left: 50
      };

      var width = $element.width() - margin.left - margin.right;
      var height = $element.height() - margin.top - margin.bottom;

      //Assign a unique ID to the $element wrapper
      var id = "ID_D3_" + layout.qInfo.qId;
      $element.attr("id", id);
      //Empty the extension content
      $("#" + id).empty();

      //-------------------------------------------------------
      // START d3 code
      //-------------------------------------------------------

      // Common steps for d3 code integration:
      //• 1 - Paste the css into the .css file
      //• 2 - Paste the d3 code into this section
      //• 3 - on the first line of code, in define(["./libraries/d3.v4.min"])
      //      change the d3 library version according to the required d3 library version used
      //      version 4 is loaded by default on this template - use "d3.v3.min" OR "d3.v4.min"
      //• 4 - Remove the d3 data loading function (search for csv in the code)
      //• 5 - replace hardcoded dimensions/measures names with "dValues" and "mValues"
      //• 6 - replace the svg select statement with the below to create a new svg and assigning width/height

      /* //SNIPPET CODE FOR INITIAL D3 SVG
                var svg = d3.select("#" + id)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
                */

      /* //SNIPPET CODE FOR SELECTIONS
                    .on('click', function (d) {

                        if (layout.prop.SelectionMode == "q") {
                            self.backendApi.selectValues(0, [d.dIndex], true); //Quick Selection
                        } else {
                            $(this).toggleClass("selected");
                            $(".bar").not(".selected").addClass("notSelected");
                            $(".bar.selected").removeClass("notSelected");

                            self.selectValues(0, [d.dIndex], true); //Confirm Selection Selection
                        }
                    })

                /* //SNIPPET CODE FOR TOOLTIP
                 .on('mousemove', function (d) {
                        tooltip
                            //position
                            .style("left", d3.mouse(this)[0] + 52 + "px")
                            .style("top", d3.mouse(this)[1] + 25 + "px")
                            //content
                            .html(hypercube.qDimensionInfo[0].qFallbackTitle +
                                ": " + (d.dValues) +
                                "<br>" +
                                hypercube.qMeasureInfo[0].qFallbackTitle +
                                ": " + (d.mValues)
                            );
                    })
                    .on('mouseover', function () {
                        // when mouseover show the tooltip
                        tooltip.style("display", null);
                    })
                    .on('mouseout', function () {
                        // when mouseout hide the tooltip
                        tooltip.style("display", "none");
                    });


                //-------------------------------------------
                // TOOLTIP
                //-------------------------------------------
                //Tooltip
                var tooltip = d3.select("#" + id).append("div")
                    .style("display", "none")
                    .attr("class", "toolTip");
                */
      //console.log(hypercube);

      app.theme.getApplied().then(function(qtheme) {
        setTheme($element, qtheme);

        // append the svg object to the body of the page
        var svg = d3
          .select("#" + id)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // List of groups = header of the csv files
        var keys = dataSet.columns.slice(1);

        // Add X axis
        var x = d3
          .scaleLinear()
          .domain(
            d3.extent(dataSet, function(d) {
              return d.d0Values;
            })
          )
          .range([0, width]);

        svg
          .append("g")
          .attr("transform", "translate(0," + height * 0.8 + ")")
          .style("font-size", "13px")
          .style("font", "QlikView Sans")
          .style("colour", theme.colour)
          .call(
            d3
              .axisBottom(x)
              .tickSize(-height * 0.7)
              .ticks(10, "f")
          )
          .select(".domain")
          .remove();

        // Customization
        svg.selectAll(".tick line").attr("stroke", theme.gridLineColour);

        // Add X axis label:
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", width / 2)
          .attr("y", height - 25)
          .text(d0Label);

        // Add Y axis
        var y = d3
          .scaleLinear()
          .domain([-7000, 7000])
          .range([height, 0]);

        // color palette
        var color = d3
          .scaleOrdinal()
          .domain(keys)
          .range(theme.colourRange);

        //stack the data?
        var stackedData = d3
          .stack()
          .offset(d3.stackOffsetSilhouette)
          .keys(keys)(dataSet);

        // create a tooltip
        /*var Tooltip = svg
        .append("text")
        .attr("x", 0 + margin.left)
        .attr("y",0 + 50)
        .style("opacity", 0)
        .style("font-size", 17);*/

        var tooltip = d3
          .select("#" + id)
          .append("div")
          //.style("display", "none")
          .attr("class", "toolTip")
          .style('background-color', "black")
          .style('color', "white");

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
          tooltip.style("display", null);
          //Tooltip.style("opacity", 1);
          d3.selectAll(".myArea").style("opacity", 0.2);
          d3.selectAll(".myArea.selected")
            .style("opacity", 0.5)
            .style("stroke", "black");
          d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
        };

        var mousemove = function(d, i) {
          var grp = keys[i];
          //console.log("d", d);
          //Tooltip.text(d1Label + ": " + grp);
          tooltip
            //position
            .style("left", d3.mouse(this)[0] + 60 + "px")
            .style("top", d3.mouse(this)[1] - 20 + "px")
            //content
            .html(d1Label + ": " + grp);
        };

        var mouseleave = function(d) {
          //Tooltip.style("opacity", 0);
          tooltip.style("display", "none");
          d3.selectAll(".myArea")
            .style("opacity", 1)
            .style("stroke", "none")
            .style("fill", color);
          d3.selectAll(".myArea.selected")
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("fill", theme.selectedColour);
        };

        // Area generator
        var area = d3
          .area()
          .x(function(d) {
            return x(d.data.d0Values);
          })
          .y0(function(d) {
            return y(d[0]);
          })
          .y1(function(d) {
            return y(d[1]);
          })
          .curve(d3.curveCardinal.tension(0));

          
        // Show the areas
        svg
          .selectAll("mylayers")
          .data(stackedData)
          .enter()
          .append("path")
          .attr("class", "myArea")
          .style("fill", function(d) {
            return color(d.key);
          })
          .attr("d", area)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .on("click", function(d) {
            if (layout.prop.SelectionMode == "q") {
              self.backendApi.selectValues(1, [selectionMap[d.key]], true); //Quick Selection
            } else {
              $(this).toggleClass("selected");
              $(".myArea")
                .not(".selected")
                .addClass("notSelected");
              $(".myArea.selected").removeClass("notSelected");
              d3.selectAll(".myArea.selected")
                .style("opacity", 1)
                .style("stroke", "none")
                .style("fill", theme.selectedColour);
              d3.selectAll(".myArea.notSelected")
                .style("stroke", "none")
                .style("fill", color);
              self.selectValues(1, [selectionMap[d.key]], true); //Confirm Selection Selection
            }
          });
      });

      //-------------------------------------------------------
      // END d3 code
      //-------------------------------------------------------

      // needed for exporting/snapshotting
      //app.theme.getApplied().then(function(qtheme) {
      // setTheme($element, qtheme).then(() => {
      return qlik.Promise.resolve();
      //})
      //needed for export

      // });

      //console.log("> end of paint");
    }
  };
});
