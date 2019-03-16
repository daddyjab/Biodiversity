/****************************************************

Homework Assignment:
15-Interactive Visualizations and Dashboards - Project Biodiversity

@Author Jeffery Brown (daddyjab)
@Date 3/15/19
@File app.js

 ****************************************************/

function buildMetadata(sample) {
  console.log(`[buildMetadata] sample:${sample}`);

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var sample_route = '/metadata/' + sample;

  d3.json(sample_route).then( d => {
    // Use d3 to select the area in the panel with id of `#sample-metadata`
    metadata_area = d3.select('#sample-metadata')

    // Use .html("") to clear any existing metadata
    metadata_area.html("");

    // Add a table to the area
    metadata_table = metadata_area.append("table");
    metadata_table.style("width", "100%");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(d).forEach( v => {
      // Get the key and value for this metadata item
      sKey = v[0];
      sValue = v[1];

      // Create formated info to be added to the Metadata metadata_table
      switch( sKey.toLowerCase() ) {
        case "sample":    // Sample ID: Unique identifier for each Sample
          dispKey = "Sample ID";
          dispValue = sValue;
          break;

        case "ethnicity": // Ethnicity: Participant ethnicity
          dispKey = "Ethnicity";
          dispValue = sValue;
          break;

        case "gender":    // Gender: Participant gender (F = Female, M = Male)
          dispKey = "Gender";
          switch( sValue.toLowerCase() ) {
            case "f":
              dispValue = "Female";
              break;
            
            case "m":
              dispValue = "Male";
              break;
            
            default:
              dispValue = sValue;
          };
          break;

        case "age":       // Age: Participant age at time of sampling
          dispKey = "Age";
          dispValue = `${sValue} years`;
          break;

        case "location":  // Location: Participant location at time of sampling
          dispKey = "Location";
          dispValue = sValue;
          break;

        case "bbtype":    // Belly Button Type: "Innie" vs. "Outie"
          dispKey = "BB Type";
          dispValue = sValue;

          switch( sValue.toLowerCase() ) {
            case "i":
              dispValue = "Innie";
              break;
            
            case "o":
              dispValue = "Outie";
              break;
            
            default:
              dispValue = sValue;
          };

          break;

        case "wfreq":     // Wash Frequency: Belly button scrubs per week
          dispKey = "Wash Freq";
          dispValue = `${sValue} per wk`;
          break;

        default:          // Default Handling
          dispKey = sKey;
          dispValue = sValue;
        };

      // console.log(`${dispKey}: ${dispValue}`);

      // Create a row for this entry
      sRow = metadata_table.append("tr");

      // Add the cell for the key
      sRow.append("td")
        .text( `${dispKey}:` )
        .style("color", "black")
        .style("font-weight", "bold")
        .style("font-size", "13px")
        .style("text-align", "right")
        .style("padding-right", "5px");

      // Add the cell for the value
      sRow.append("td")
        .text( dispValue )
        .style("color", "blue")
        .style("font-weight", "bold")
        .style("font-size", "13px")
        .style("padding-left", "5px");
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  console.log(`[buildCharts] sample:${sample}`);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample_route = "/samples/" + sample;

  d3.json(sample_route).then( d => {

    console.log(d);

    // For convenience in sorting, convert the data from
    // A object with 3 arrays to an array of objects
    var dObj = [];
    d['otu_ids'].forEach( (v, i) => {
      newEntry = {
        otu_id: v,
        otu_label: d['otu_labels'][i],
        sample_value: d['sample_values'][i]
      };
      // console.log(`newEntry:`, newEntry );

      dObj.push( newEntry );
    });

    // Sort the array of objects in
    // descending order by sample value
    dObj.sort( (a, b) => b['sample_value'] - a['sample_value'] );

    // console.log(`dObj:`, dObj.slice(0,10) );

    // @TODO: Build a Bubble Chart using the sample data
    // hsl(90, 100%, 50%)

    // Make a scale to set the hue of the bubbles
    // based upon the otu_id
    var hScale = d3.scaleLinear()
                  .domain( d3.extent( dObj, v => v.otu_id ))
                  .range([ 0, 360]);

    var trace = {
      x: dObj.map( v => v.otu_id ) ,
      y: dObj.map( v => v.sample_value ),
      text: dObj.map( v => `OTU_ID: ${v.otu_id}, Sample Value: ${v.sample_value}<br>${v.otu_label}`),
      type: "scatter",
      mode: "markers",
      name: "Samples",
      marker: {
        color: dObj.map( v => `hsla( ${hScale(v.otu_id)}, 0.5, 0.5, 0.8)` ),
        symbol: "circle",
        opacity: 0.8,
        size: dObj.map( v => v.sample_value )
      }
    };

    // console.log("Trace: ", trace)

    data = [trace];

    layout = {
      title: "Sample Count by Operational Taxonomic Unit Identifier (OTU ID)",
      xaxis: { title: "Operational Taxonomic Unit Identifier (OTU ID)" },
      yaxis: { title: "Sample Count" }
    };

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var trace = {
      labels: dObj.slice(0,10).map( v => `OTU_ID: ${v.otu_id}` ) ,
      values: dObj.slice(0,10).map( v => v.sample_value ),
      text: dObj.slice(0,10).map( v => `${v.otu_label}`),
      type: "pie",
      name: "Top 10",
      hoverinfo: 'label+value+percent+text',
      textinfo: 'percent',
      hole: 0.4
    };

    data = [trace];

    layout = {
      title: "Top 10 Bacteria by Sample Count",
    };

    Plotly.newPlot("pie", data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach( (sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
