let uploadButton = document.getElementById("file-upload")
uploadButton.addEventListener("change", uploadFile);
let downloadButton = document.getElementById("file-download")
downloadButton.addEventListener("click", downloadFile);

let fileData;
let toDownload;
let downloadName;

function uploadFile() {
    console.log("uploading file")
    var txt = "";
    if ('files' in uploadButton) {
        if (uploadButton.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            for (var i = 0; i < uploadButton.files.length; i++) {
                txt += "<br><strong>" + (i + 1) + ". file</strong><br>";
                var file = uploadButton.files[i];
                fileData = new Blob([file])
                if ('name' in file) {
                    txt += "name: " + file.name + "<br>";
                    downloadName = file.name;
                }
                if ('size' in file) {
                    txt += "size: " + file.size + " bytes <br>";
                }
            }
        }
    } else {
        if (uploadButton.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt += "<br>The path of the selected file: " + uploadButton.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
    document.getElementById("output").innerHTML = txt;

    let promise = new Promise(function (resolve) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(fileData);
        reader.onload = function () {
            let arrayBuffer = reader.result;
            let bytes = new Uint8Array(arrayBuffer);
            resolve(bytes);
        }
    }).then(function (data) {
        console.log('file data' + data.toString());
        toDownload = data
    }).catch(function (err) {
        console.log('error: ' + err);
    });
}

var downloadBlob, downloadURL;

downloadBlob = function (data, fileName, mimeType) {
    var blob, url;
    blob = new Blob([data], {
        type: mimeType
    });
    url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(function () {
        return window.URL.revokeObjectURL(url);
    }, 1000);
};

downloadURL = function (data, fileName) {
    var a;
    a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
};

function downloadFile() {
    console.log("downloading file")
    if (!!toDownload) {
        downloadBlob(toDownload, downloadName, 'application/octet-stream');
    }
}