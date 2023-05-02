// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});


// Initialize the dashboard at start up 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Collects all sample names
        let names = data.names;

        // set a function to log each ID of each sample name
        // also we create a drop down menu that allows us
        // to select whichever ID we want to select and see 
        // on our bar and bubble plots
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option") // allows us to select 
            .text(id); // shows each ID as an option to select
        });

        // to get our initial value for each sample
        // which includes all our needed values
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        Metadata(sample_one);
        Bar(sample_one);
        Bubble(sample_one);
        // these functions will be created before we
        // ever call the init() function

    });
};

// Function that fills out our "Demographic Info" box
function Metadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter only to chosen ID
        let value = metadata.filter(result => result.id == sample);
        // remember, each ID will have all the subordinate demographic info

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Again, get our initial value 
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
            // gives us 'id', 'ethnicity', 'gender', 'age', 'location', 'bbtype', 'wfreq'
        });
    });

};

// Function that builds the bar chart
function Bar(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Moving on to each sample
        let sampleInfo = data.samples;

        // Filter again where our ID is only our chosen value
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // get our top 10 values
        // but we use .reverse() to set in descending order

        let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        // yvalues are essentially our y labels

        let xvalues = sample_values.slice(0,10).reverse();
        // xvalues will be the length of each bar

        let labels = otu_labels.slice(0,10).reverse();
        // labels will be the label we see when we hover over a bar
        // we will also see our xvalues when we hover over a bar
        
        // Set up the trace for the bar chart
        let trace = {
            x: xvalues,
            y: yvalues,
            text: labels, 
            type: "bar", // sets it as a bar plot
            orientation: "h" // makes it a horizontal bar plot
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present" // sets our title for the bar chart
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function Bubble(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest", // really cool feature
            // basicaly gives us the info on the closest bubble to cursor
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    Metadata(value);
    Bar(value);
    Bubble(value);
};
// optionChanged is CRUCIAL
// without it, we would only be able to see graphs on the first ID

init() // call our over-arching function to run all plots/demo lists