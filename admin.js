const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function useFormDialog() {
    const dialogRef = React.useRef(null);
    const formRef = React.useRef(null);

    React.useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
    });

    const handleSubmit = (onSubmit) => {
        const dialog = dialogRef.current;
        const formData = new FormData(formRef.current);
        let obj = {};
        for (const entry of formData.entries()) {
            obj[entry[0]] = entry[1];
        }
        onSubmit(obj, formData);
        dialog.close();        
    }

    const handleCancel = () => dialogRef.current.close();

    return [dialogRef, formRef, handleSubmit, handleCancel];
}

function AddItemDialog({onSubmit=()=>{}, onClose=()=>{}}) {
    const [dialogRef, formRef, handleSubmit, handleCancel] = useFormDialog();


    const handleItemSubmit = (obj, formData) => {
        const item = new Item(null, obj.price, obj.quantity, obj.name, obj.description);
        onSubmit(item, formData);
    }

    return (
<dialog ref={dialogRef} className="item_dialog" onClose={onClose}>
    <form ref={formRef} className="item_form" method="dialog">
        <div>
            <label htmlFor="name">Name</label>
            <input name="name"></input>
        </div>
        <div>
            <label htmlFor="description">Description</label>
            <input name="description"></input>
        </div>
        <div>
            <label htmlFor="price">Price</label>
            <input name="price"></input>
        </div>
        <div>
            <label htmlFor="quantity">Quantity</label>
            <input name="quantity"></input>
        </div>
        <div>
            <button formMethod="dialog" onClick={() => handleSubmit(handleItemSubmit)}>Submit</button>
            <button formMethod="dialog" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
</dialog>
    );
}


function AddUserDialog({onSubmit=()=>{}, onClose=()=>{}}) {
    const [dialogRef, formRef, handleSubmit, handleCancel] = useFormDialog();
    
    const handleUserSubmit = (obj, formData) => {
        const user = new User(null, obj.name, obj.password, obj.admin);
        onSubmit(user, formData);
    };

    return (
<dialog ref={dialogRef} className="user_dialog" onClose={onClose}>
    <form ref={formRef} className="user_form" method="dialog">
        <div>
            <label htmlFor="admin">Admin?</label>
            <input name="admin"></input>
        </div>
        <div>
            <label htmlFor="username">Username</label>
            <input name="username"></input>
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input name="password"></input>
        </div>
        <div>
            <button formMethod="dialog" onClick={() => handleSubmit(handleUserSubmit)}>Submit</button>
            <button formMethod="dialog" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
</dialog>
    );
}


function EditUserDialog({user, onSubmit=()=>{}, onClose=()=>{}}) {
    const [dialogRef, formRef, handleSubmit, handleCancel] = useFormDialog();

    const handleUserSubmit = (obj, formData) => { onSubmit(new User(obj.id, obj.username, obj.passhash, obj.admin), formData); };

return (
<dialog ref={dialogRef} className="user_dialog" onClose={onClose}>
    <form ref={formRef} className="user_form" method="dialog">
        <div>
            <label htmlFor="id">ID</label>
            <input name="id" value={user.id} readOnly></input>
        </div>
        <div>
            <label htmlFor="admin">Admin?</label>
            <input name="admin" defaultValue={user.admin}></input>
        </div>
        <div>
            <label htmlFor="username">Username</label>
            <input name="username" defaultValue={user.username} autoFocus></input>
        </div>
        <div>
            <label htmlFor="passhash">Password Hash</label>
            <input name="passhash" defaultValue={user.passhash}></input>
        </div>
        <div>
            <button formMethod="dialog" onClick={() => handleSubmit(handleUserSubmit)}>Submit</button>
            <button formMethod="dialog" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
</dialog>
    );
}

function EditItemDialog({item, onSubmit=()=>{}, onClose=()=>{}}) {
    const [dialogRef, formRef, handleSubmit, handleCancel] = useFormDialog();

    const handleItemSubmit = (obj, formData) => { onSubmit(new Item(obj.sku, obj.price, obj.quantity, obj.name, obj.description), formData); };

    return (
<dialog ref={dialogRef} className="edit_dialog" onClose={onClose}>
    <form ref={formRef} className="edit_form" method="dialog">
        <div>
            <label htmlFor="sku">SKU</label>
            <input name="sku" value={item.sku} readOnly></input>
        </div>
        <div>
            <label htmlFor="price">Price</label>
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
            <button formMethod="dialog" onClick={() => handleSubmit(handleItemSubmit)}>Submit</button>
            <button formMethod="dialog" type="button" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
</dialog>
    );
}

function UserTable({users, onEdit=()=>{}, onDelete=()=>{}}) {
    const rows = (users.map((user) => 
    <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.admin ? '✓' : '𐄂'}</td>
        <td>{user.username}</td>
        <td>{user.passhash}</td>
        <td>
            <div className="user_table_actions">
                <button onClick={() => {onEdit(user)}}>Edit</button>
                <button onClick={() => {onDelete(user)}}>Delete</button>
            </div>
        </td>
    </tr>
    ));

    return (
<div className="user_table">
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Admin</th>
            <th>Username</th>
            <th>Password Hash</th>
        </tr>
    </thead>
    <tbody>
        {rows}
    </tbody>
</table>
</div>
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
                <button onClick={() => {onDelete(item)}}>Delete</button>
            </div>
        </td>
    </tr>
    ));

    return (
<>
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
</>
    );
}

function AdminItemPanel() {
    const [showItemAddDialog, setShowItemAddDialog] = React.useState(false);
    const [showItemEditDialog, setShowItemEditDialog] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [editingItem, setEditingItem]= React.useState(null);

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) { 
            updateItems();
        }
        return () => { ignore = true; };
    }, []);

    const updateItems = async () => {
        // TODO Paginate
        setItems(await Item.prototype.getItems());
    }

    const handleItemClose = () => setShowItemEditDialog(false);

    const handleEditItemOpen = (item) => {
        setEditingItem(item);
        setShowItemEditDialog(true);
    }

    const handleEditItemSubmit = async (item) => {
        await controller.updateItem(item)
            .then(response => { 
                    if (response.ok) updateItems();
            });
    }

    const handleItemDelete = async (item) => {
        await controller.deleteItem(item)
            .then(response => { 
                    if (response.ok) updateItems();
            });
    }

    const handleAddItemSubmit = async (item, formData) => {
        controller.createItem(item)
            .then(response => { if (response.ok) updateItems(); });
    }

    const handleAddItemClick = () => { setShowItemAddDialog(true); }
    const handleAddItemClose = () => { setShowItemAddDialog(false); }

    return (
<>
<h2>Items</h2>
<button type="button" onClick={handleAddItemClick}>Add Item</button>
<ItemTable items={items} onEdit={handleEditItemOpen} onDelete={handleItemDelete}/>

{showItemEditDialog && <EditItemDialog item={editingItem} onSubmit={handleEditItemSubmit} onClose={handleItemClose}/>}
{showItemAddDialog && <AddItemDialog onSubmit={handleAddItemSubmit} onClose={handleAddItemClose}/>}
</>
    );            
}

function AdminPanel() {
    const [showUserAddDialog, setShowUserAddDialog] = React.useState(false);
    const [showUserEditDialog, setShowUserEditDialog] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [editingUser, setEditingUser]= React.useState(null);

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) { 
            updateUsers();
        }
        return () => { ignore = true; };
    }, []);

    const updateUsers = async () => {
        // TODO Paginate
        const users = await (await fetch('model/api/users.php')).json(); 
        setUsers(users);
    }

    const handleUserClose = () => setShowUserEditDialog(false);

    const handleEditUserOpen = (user) => {
        setEditingUser(user);
        setShowUserEditDialog(true);
    }
    const handleEditUserSubmit = async (user) => {
        await fetch("model/api/users.php?id="+user.id, {
            method: "PATCH",
            body: JSON.stringify(user)
        }).then(response => { 
                if (response.status <= 200 && response.status < 300) updateUsers();
            }
        );
    }
    const handleUserDelete = async (user) => {
        await fetch("model/api/users.php?id="+user.id, { method: "DELETE" })
            .then(response => { 
                    if (response.status <= 200 && response.status < 300) updateUsers();
                }
            );
    }

    const handleAddUserSubmit = async (user, formData) => {
        controller.createUser(user)
            .then(response => {
                if (response.status <= 200 && response.status < 300) updateUsers();
            });
    }

    const handleAddUserClick = () => { setShowUserAddDialog(true); }
    const handleAddUserClose = () => { setShowUserAddDialog(false); }


    return(
<>

    <h2>Users</h2>
    <button type="button" onClick={handleAddUserClick}>Add User</button>
    <UserTable users={users} onEdit={handleEditUserOpen} onDelete={handleUserDelete}/>

    {showUserEditDialog && <EditUserDialog user={editingUser} onSubmit={handleEditUserSubmit} onClose={handleUserClose}/>}
    {showUserAddDialog && <AddUserDialog onSubmit={handleAddUserSubmit} onClose={handleAddUserClose}/>}

    <AdminItemPanel />
</>
    );
}

root.render(
<>
    <Navigation />
    <AdminPanel />
</>
);