const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function useForm() {

    const handleSubmit = (event) => {
        const formData = new FormData(event.currentTarget);
        let obj = {};
        for (const entry of formData.entries()) {
            obj[entry[0]] = entry[1];
        }
        onSubmit(obj, formData);
    }

    return [handleSubmit];
}

function AddItemForm({onSubmit=()=>{}, children}) {

    return (
<form onSubmit={onSubmit}>
    <label htmlFor="name">
        Name 
        <input name="name"></input>
    </label>
    <label htmlFor="description">
        Description
        <input name="description"></input>
    </label>
    <label htmlFor="price">
        Price
        <input name="price"></input>
    </label>
    <label htmlFor="quantity">
        Quantity
        <input name="quantity"></input>
    </label>
    {children}
</form>
    );
}


function AddUserDialog({onSubmit=()=>{}, onClose=()=>{}}) {
    const [formRef, handleSubmit] = useForm();
    
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
    const [dialogRef, formRef, handleSubmit, handleCancel] = useForm();

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
    const [dialogRef, formRef, handleSubmit, handleCancel] = useForm();

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

function AdminItemPanel({fetchCreate, fetchRead, fetchUpdate, fetchDelete}) {
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [objs, setObjs] = React.useState([]);
    const [editingObj, setEditingObj]= React.useState(null);

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) { 
            updateObjs();
        }
        return () => { ignore = true; };
    }, []);

    const updateObjs = async () => {
        // TODO Paginate
        setObjs(await fetchCreate);
    }

    const handleEditOpen = (item) => {
        setEditingObj(item);
        setShowEditDialog(true);
    }

    const handleAddClick = () => { setShowAddDialog(true); }
    const handleAddClose = () => { setShowAddDialog(false); }

    const handleEditSubmit = async (obj) => {
        await fetchUpdate(obj).then(response => { if (response.ok) updateObjs(); });
    }

    const handleDeleteClick = async (obj) => {
        await fetchDelete(obj).then(response => {  if (response.ok) updateObjs(); });
    }

    const handleAddSubmit = async (event) => {
        if (event.nativeEvent.submitter.value === "cancel") {
            return;
        }

        const formData = new FormData(event.currentTarget);
        if (formData.entries()) {
            for (const prop of formData.entries()) {
                console.log(prop);
            }
            // await fetchCreate(obj, formData).then(response => { if (response.ok) updateObjs(); });
        }
    }

    return (
<>
<h2>Items</h2>
<button type="button" onClick={handleAddClick}>Add Item</button>
{/* <ItemTable items={objs} onEdit={handleEditOpen} onDelete={handleDeleteClick}/> */}

{showEditDialog && <EditItemDialog item={editingObj} onSubmit={handleEditSubmit}/>}
{showAddDialog && 
<ModalDialog onClose={handleAddClose}>
    <AddItemForm onSubmit={handleAddSubmit}>
        <div>
            <button formMethod="dialog">Submit</button>
            <button formMethod="dialog" value="cancel">Cancel</button>
        </div>
    </AddItemForm>
</ModalDialog>}
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
    {showUserAddDialog && 
    <ModalDialog className="item_dialog">
        <AddUserDialog onSubmit={handleAddUserSubmit} onClose={handleAddUserClose}/>
    </ModalDialog>}
</>
    );
}

root.render(
<>
    <Navigation />
    {/* <AdminPanel /> */}
    <AdminItemPanel fetchRead={async () => await Item.prototype.getItems()}/>
</>
);