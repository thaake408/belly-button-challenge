// Use the D3 library to read in samples.json from the URL 
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Gather JSON data from URL
d3.json(url).then(function(data){
    console.log(data);
}); 

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function init(){
    //Dropdown list variable for sample id's 
    let dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
    //Pull sample ids from names list to populate the dropdown
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };
    
    let first_sample = sample_ids[0];
    console.log(first_sample);
    
    //Call the graph generating functions with the first sample (id 940)
    makeBar(first_sample);
    makeBubble(first_sample);
    makeDemographics(first_sample);
    }); //end of d3 access
};

//Function to populate bar chart 
function makeBar(sample){

    //Pull sample data to populate the bar chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //Filter for sample id
        let results = sample_data.filter(item => item.id == sample);
        //Pull first selection in results filter
        let first_result = results[0];
        console.log(first_result);
        //Display first 10 results in the bar chart
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //Trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(ids=> `OTU ${ids}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top 10 OTU's"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

function makeBubble(sample){
    //Pull sample data to populate the bubble chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //Filter for sample id
        let results = sample_data.filter(item => item.id == sample);
        //Pull first selection in results filter
        let first_result = results[0];
        console.log(first_result);
        //Display results in the bubble chart
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //Trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); 
    });
};

//Function to populate each sample's demographic info
function makeDemographics(sample){
    //Pull sample data for populating the demographics section
    d3.json(url).then((data) => {
    //Pull demographic info (metadata) 
    let demographic_info = data.metadata;
     //Filter for sample id
    let results = demographic_info.filter(item => item.id == sample);
    //Display 1st result in demographic info
    let first_result = results[0];
    console.log(first_result);
    //Clears previous selections in the demographic info when selecting a new one
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key,value]) => {
        console.log(key,value);
        //Appends new key-value pair by selecting demographic info html section 
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

//Function when dropdown option is altered as defined in index.html
function optionChanged(value){
   
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();