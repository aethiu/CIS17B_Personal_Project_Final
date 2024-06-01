const root = ReactDOM.createRoot(document.getElementById("root"));

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







function EditDialog({item, onSubmit=()=>{}, onClose=()=>{}}) {
    const dialogRef = React.useRef(null);
    const formRef = React.useRef(null);

    React.useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
    });

    function handleSubmit(onSubmit) {
        const dialog = dialogRef.current;
        const formData = new FormData(formRef.current);
        let editedItem  = {};
        for (const row of formData.entries()) {
            editedItem[row[0]] = row[1];            
        }
        onSubmit(editedItem);
        dialog.close();        
    }

    const handleCancel = () => dialogRef.current.close();

    return (
<dialog ref={dialogRef} className="item_edit_dialog" onClose={onClose}>
    <form ref={formRef} className="item_edit_form" method="dialog">
        <div>
            <label htmlFor="sku">SKU</label>
            <input name="sku" value={item.sku} readOnly></input>
        </div>
        <div>
            <label htmlFor="pricek">Price</label>
            <input name="price" defaultValue={item.price}></input>
        </div>
        <div>
            <label htmlFor="quantity">Stock</label>
            <input name="quantity" defaultValue={item.quantity} autoFocus></input>
        </div>
        <div>
            <label htmlFor="Name">Name</label>
            <input name="name" defaultValue={item.name}></input>
        </div>
        <div>
            <label htmlFor="description">Description</label>
            <input name="description" defaultValue={item.description}></input>
        </div>
        <div>
            <button formMethod="dialog" onClick={() => handleSubmit(onSubmit)}>Submit</button>
            <button formMethod="dialog" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
</dialog>
    );
}

function ItemTable({items, onEdit=()=>{}, onDelete=()=>{}}) {
    const rows = (items.map((item) => 
    <tr key={item.sku}>
        <td>{item.sku}</td>
        <td>${item.price}</td>
        <td>{item.quantity}</td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>
            <div className="item_table_actions">
                <button onClick={() => {onEdit(item)}}>Edit</button>
                <button onClick={onDelete}>Delete</button>
            </div>
        </td>
    </tr>
    ));

    return (
<div className="item_table">
<table>
    <thead>
        <tr>
            <th>SKU</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {rows}
    </tbody>
</table>
</div>
    );
}

function AdminPanel() {
    const [showDialog, setShowDialog] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [editingItem, setEditingItem]= React.useState(null);

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) updateItems();
        return () => { ignore = true; };
    }, []);

    const updateItems = async () => {
        // TODO Paginate
        const items = await (await fetch('model/api/items.php')).json(); 
        setItems(items);
    }

    const handleClose = () => setShowDialog(false);

    const handleEditOpen = (item) => {
        setEditingItem(item);
        setShowDialog(true);
    }

    const handleEditSubmit = async (item) => {
        await fetch('model/api/items.php?sku='+item.sku, {
            method: "PATCH",
            body: JSON.stringify(item)
        }).then(response => { 
                if (response.status <= 200 || response.status < 300) updateItems();
            }
        );
    }

    const handleDelete = async (sku) => {
        await fetch("model/api/items.php?sku="+sku, { method: "DELETE" });
    }

    return(
<>
    <h2>Items</h2>
    <ItemTable items={items} onEdit={handleEditOpen} onDelete={handleDelete}/>
    {showDialog && <EditDialog item={editingItem} onSubmit={handleEditSubmit} onClose={handleClose}/>}
</>
    );
}

root.render(
<>
    <AdminPanel />
</>
);