// file upload parse
var input = document.getElementById('input-file')
var handsontableContainer = document.getElementById('handsontable-container')

input.onchange = function () {
  var file = "files/parrilla_ecuavisa.csv"
  var reader = new FileReader()

  reader.onload = function (e) {
    var csv = e.target.result
    var data = Papa.parse(csv, {
      header: false,
      skipEmptyLines: true

    })
    console.log(data.data)
    // reset container
    handsontableContainer.innerHTML = ''
    handsontableContainer.className = ''
    document.querySelector('input').remove()
    // document.querySelector('.github-corner').remove()
    // document.querySelector('.place-your-ad-here').remove()

    Handsontable(handsontableContainer, {
      data: data.data,
      rowHeaders: true,
      colHeaders: data.meta.fields,
      columnSorting: true,
      width: '100%',
      licenseKey: 'non-commercial-and-evaluation',
    })
  }

  file && reader.readAsText(file)
}



/// test papa parse

// Papa.parse("files/parrilla_ecuavisa.csv", {
//     download: true,
//     step: function(row) {
//         console.log("Row:", row.data);
//     },
//     complete: function() {
//         console.log("All done!");
//     }
// });

// https://redyman.netlify.app/grilla-programacion-ecuavisa/parrilla_ecuavisa.csv
    var data = Papa.parse("files/parrilla_ecuavisa.csv", {
      header: false,
      skipEmptyLines: true

    })
    // console.log(data.data)
    // reset container
    handsontableContainer.innerHTML = ''
    handsontableContainer.className = ''
    // document.querySelector('input').remove()

    Handsontable(handsontableContainer, {
      data: data,
      rowHeaders: true,
      // colHeaders: data.meta.fields,
      columnSorting: true,
      width: '100%',
      licenseKey: 'non-commercial-and-evaluation',
    })