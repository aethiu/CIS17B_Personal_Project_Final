const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function FormDialog({onSubmit, onClose, children}) {
    return (
<>
<ModalDialog onClose={onClose}>
    <form onSubmit={onSubmit}>
        {children}
        <FormControls />
    </form>
</ModalDialog>
</>
    );
}

function FormControls() {
    return (
<div>
    <button formMethod="dialog">Submit</button>
    <button formMethod="dialog" value="cancel">Cancel</button>
</div>
    );
}

function AddItemFormInput() {
    return (
<>
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
</>
    );
}

function AddUserFormInput() {
    return (
<>
<label htmlFor="admin">
    Admin?
    <input name="admin"></input>
</label>
<label htmlFor="username">
    Username
    <input name="username"></input>
</label>
<label htmlFor="password">
    Password
    <input name="password"></input>
</label>
</>
    );
}


function EditUserFormInput({user}) {

return (
<>
<label htmlFor="id">
    ID
    <input name="id" value={user.id} readOnly />
</label>
<label htmlFor="admin">
    Admin?
    <input name="admin" defaultValue={user.admin} />
</label>
<label htmlFor="username">
    Username
    <input name="username" defaultValue={user.username} autoFocus />
</label>
<label htmlFor="passhash">
    Password Hash
    <input name="passhash" defaultValue={user.passhash} />
</label>
</>
    );
}

function EditItemDialog({item}) {
    return (
<>
<label htmlFor="sku">
    SKU
    <input name="sku" value={item.sku} readOnly />
</label>
<label htmlFor="price">
    Price
    <input name="price" defaultValue={item.price} />
</label>
<label htmlFor="quantity">
    Stock
    <input name="quantity" defaultValue={item.quantity} autoFocus />
</label>
<label htmlFor="Name">
    Name
    <input name="name" defaultValue={item.name} />
</label>
<label htmlFor="description">
    Description
    <input name="description" defaultValue={item.description} />
</label>
</>
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
        setObjs(await fetchRead());
    }

    const handleEditOpen = (item) => {
        setEditingObj(item);
        setShowEditDialog(true);
    }
    const handleEditClose = () => { setShowEditDialog(false); }
    const handleAddClick = () => { setShowAddDialog(true); }
    const handleAddClose = () => { setShowAddDialog(false); }

    const handleEditSubmit = async (obj) => {
        await fetchUpdate(obj).then(response => { if (response.ok) updateObjs(); });
    }

    const handleDeleteClick = async (obj) => {
        await fetchDelete(obj).then(response => {  if (response.ok) updateObjs(); });
    }

    const handleAddSubmit = async (event) => {
        if (event.nativeEvent.submitter.value === "cancel") { return; }

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

<ItemTable items={objs} onEdit={handleEditOpen} onDelete={handleDeleteClick}/>

{showEditDialog && 
<FormDialog onSubmit={handleEditSubmit} onClose={handleEditClose}>
    <EditItemDialog item={editingObj}/>
</FormDialog>}

{showAddDialog && 
<FormDialog onSumbit={handleAddSubmit} onClose={handleAddClose}>
    <AddItemFormInput />
</FormDialog>}
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

    const handleEditUserClose = () => setShowUserEditDialog(false);

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

    {showUserEditDialog && 
    <FormDialog onSubmit={()=>{}} onClose={handleEditUserClose}>
        <EditUserFormInput user={editingUser} />
    </FormDialog>}
    {showUserAddDialog && 
    <FormDialog onSubmit={()=>{}} onClose={handleAddUserClose}>
        <AddUserFormInputs />
    </FormDialog>}
</>
    );
}

root.render(
<>
    <Navigation />
    <AdminPanel />
    <AdminItemPanel fetchRead={async () => await Item.prototype.getItems()} />
</>
);