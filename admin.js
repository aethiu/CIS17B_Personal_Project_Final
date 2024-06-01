function handleEditClick(tableId, rowId, uri="") {
    const dialog = document.getElementById("edit_dialog");
    const editForm = document.getElementById("edit_form");
    const headers = document.getElementById(tableId).rows[0].cells;
    const row = document.getElementById(rowId);
    const cells = row.cells;

    let html = "";
    for (let i = 0; i < cells.length-1; i++) {
        const header = headers[i].innerHTML;
        const column = headers[i].id.slice(headers[i].id.indexOf('_')+1) ;
        const value = cells[i].innerHTML;
        html += 
`<div class="edit_input"><label for="${column}">${header}</label>
<input name="${column}" value="${value}"></input></div>
`;
    }
    html += 
`<div class="edit_dialog_buttons"><button onclick="handleSubmitClick(this, '${uri}', 'PATCH')">Submit</button>
<button onclick="document.getElementById('edit_dialog').close()">Cancel</button></div>`;
    editForm.innerHTML = html;
    dialog.showModal();
}

async function handleDeleteClick(uri="") {
    const promise = await fetch(uri, {
        method: "DELETE",
    }).then(response => {
        if (response.status >= 200 && response.status <= 204 ) {
            location.reload();
        }
    });
}

async function handleSubmitClick(button, uri, method="POST") {
    if (uri === "") return;

    const form = button.form;
    const formData = new FormData(form);
    let data = formData;

    if (method === "PATCH" ){
        for (const pair of data.entries()) {
            data[pair[0]] = pair[1];
        }
        data = JSON.stringify(data);
    }

    const res = await fetch(uri, {
        method: method,
        body: data 
    }).then(response => {
        if (response.status >= 200 && response.status < 300 ) {
            location.reload();
        }
    });
}