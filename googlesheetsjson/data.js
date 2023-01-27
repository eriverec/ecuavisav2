const sheetId = '1dh26Aop4ljyzCCprLXvAq5dZ7iRd-saMrCkbbkN-Xsg';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'embed';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;

const data = []
document.addEventListener('DOMContentLoaded', init);
const output = document.querySelector('.output');


function init() {
  fetch(url)
    .then(res => res.text())
    .then(rep => {
      //Remove additional text and extract only JSON:
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      console.log(jsonData.table.cols);


      var xValues = ["Italy", "France", "Spain", "USA", "Argentina","Ecuador"];
      var colz = [];
      const tr = document.createElement('tr');
   

      //Extract column labels
      jsonData.table.cols.forEach((heading) => {

        if (heading.label) {
          var column = heading.label;
          colz.push(column);
          const th = document.createElement('th');
          th.innerText = column;
          tr.appendChild(th);
        }
      })
      output.appendChild(tr);
      //extract row data:
      jsonData.table.rows.forEach((rowData) => {
        const row = {};
        colz.forEach((ele, ind) => {
          
          new Chart(document.getElementById("bar-chart"), {
            type: 'bar',
            data: {
              labels:colz,
              datasets: [{
                label: "Population (millions)",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#8e5ea2"],
                data: [2478, 5267, 734, 784, 433, 732]
              }]
            },
            options: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
              }
            }
          });
          row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
        })
        data.push(row);
        console.log(row);
      })
      processRows(data);
    })
}


function processRows(json) {
  json.forEach((row) => {
    const tr = document.createElement('tr');
    const keys = Object.keys(row);

    keys.forEach((key) => {
      const td = document.createElement('td');
      td.textContent = row[key];
      tr.appendChild(td);
    })
    output.appendChild(tr);
  })
}


