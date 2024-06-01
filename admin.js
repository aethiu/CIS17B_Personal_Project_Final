const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function handleEditClick(tableId, rowId, uri="") {
    const dialog = document.querySelector(".edit_dialog");
    const editForm = document.querySelector(".edit_form");
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
`<div class="edit_buttons"><button onclick="handleSubmitClick('${uri}')">Submit</button>
<button onclick="document.querySelector('.edit_dialog').close()">Cancel</button></div>`;
    editForm.innerHTML = html;
    dialog.showModal();
}

async function handleSubmitClick(uri) {
    if (uri === "") return;

    const form = document.querySelector(".edit_form");
    const formData = new FormData(form);

    const res = await fetch(uri, {
        method: "POST",
        body: formData
    });
}