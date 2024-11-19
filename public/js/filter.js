/*
====================================================
? => Filters Handling Code :--
====================================================
*/

const sourceCheckbox = document.getElementById("source-checkbox");
const mediumCheckbox = document.getElementById("medium-checkbox");
const campaignCheckbox = document.getElementById("campaign-checkbox");
const termCheckbox = document.getElementById("term-checkbox"); // Added term checkbox
const contentCheckbox = document.getElementById("content-checkbox"); // Add this line


function renderTableBasedOnCheckboxes(utmData) {
    const isSourceChecked = sourceCheckbox.checked;
    const isMediumChecked = mediumCheckbox.checked;
    const isCampaignChecked = campaignCheckbox.checked;
    const isTermChecked = termCheckbox?.checked; // Safely check if term checkbox exists
    const isContentChecked = contentCheckbox?.checked; // Safely check if content checkbox exists

    if (isSourceChecked && isMediumChecked && isCampaignChecked && isTermChecked && isContentChecked) {
        renderUtmSourceMediumCampaignTermContentTable(utmData);
    } else if (isSourceChecked && isMediumChecked && isCampaignChecked && isTermChecked) {
        renderUtmSourceMediumCampaignTermTable(utmData);
    } else if (isSourceChecked && isMediumChecked && isCampaignChecked) {
        renderUtmSourceMediumCampainTable(utmData); 
    } else if (isSourceChecked && isMediumChecked) {
        renderUtmSourceMediumTable(utmData); 
    } else if (isSourceChecked) {
        renderUtmSourceTable(utmData); // Implement this function similarly
    } else {
        console.log("No matching combination or incomplete logic.");
    }
}

// Add event listeners to all checkboxes
[sourceCheckbox, mediumCheckbox, campaignCheckbox, termCheckbox, contentCheckbox].forEach(checkbox => {
    if (checkbox) { // Ensure the checkbox exists
        checkbox.addEventListener("change", () => {
            loadUtmData(); 
        });
    }
});





function loadUtmData(data) {
    if (data) {
        const organizedData = processUtmData(data);
        renderTableBasedOnCheckboxes(organizedData);
    } else {
        fetch('/utm-data')
            .then(response => response.json())
            .then(data => {
                const organizedData = processUtmData(data);
                renderTableBasedOnCheckboxes(organizedData);
            })
            .catch(error => {
                console.error('Error fetching UTM data:', error);
            });
    }
}



// window.onload = () => {
//     sendUtmData();  
//     loadUtmData();  
// };

document.getElementById("view-button").addEventListener("click", () => {
    const month = document.getElementById("month-filter").value;
    const year = document.getElementById("year-filter").value;

    if (!month || !year) {
        alert("Please select both month and year!");
        return;
    }

    fetchDataForMonthYear(month, year);
});

function fetchDataForMonthYear(month, year) {
    const url = `/utm-data?month=${month}&year=${year}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("No data found for the selected month and year.");
                // Optionally, you can clear the table here
                document.getElementById('utm-data').innerHTML = '';
                document.getElementById('utm-table-header').innerHTML = '';
            } else {
                loadUtmData(data);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching data. Please try again.");
        });
}
