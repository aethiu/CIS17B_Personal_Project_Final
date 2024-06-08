const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function FormDialog({onSubmit, onClose, children}) {
    
    const handleSubmit = (event) => {
        if (event.nativeEvent.submitter.value === "cancel") { return; }
        const formData = new FormData(event.currentTarget);
        onSubmit(formData);
    }

    return (
<>
<ModalDialog onClose={onClose}>
    <form onSubmit={handleSubmit}>
        {children}
        <FormControls />
    </form>
</ModalDialog>
</>
    );
}

function FormControls({cancelValue="cancel"}) {
    return (
<div>
    <button formMethod="dialog">Submit</button>
    <button formMethod="dialog" value={cancelValue}>Cancel</button>
</div>
    );
}

function AddItemInputs() {
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
    <ItemPriceInput name="price" />
</label>
<label htmlFor="quantity">
    Quantity    
    <ItemQuantityInput name="quantity"/>
</label>
</>
    );
}

function AddUserInputs() {
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

function EditUserInputs({user}) {

return (
<>
<label htmlFor="id">
    ID
    <input name="id" value={user.id} readOnly />
</label>
<label htmlFor="admin">
    Admin?
    <UserAdminCheckbox name="admin" defaultChecked={user.admin} />
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

function EditItemInputs({item}) {
    return (
<>
<label htmlFor="sku">
    SKU
    <input name="sku" value={item.sku} readOnly />
</label>
<label htmlFor="price">
    Price
    <ItemPriceInput name="price" defaultValue={item.price}/>
</label>
<label>
    Quantity
    <ItemQuantityInput name="quantity" defaultValue={item.quantity}/>
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

function ItemPriceInput({name, defaultValue}) {
    return ( <input name={name} defaultValue={defaultValue} inputMode="decimal" pattern="\d*(\.|,)?\d*"/> );
}

function ItemQuantityInput({name, defaultValue}) {
    return ( <input name={name} defaultValue={defaultValue} inputMode="numeric" pattern="\d*" autoFocus /> );
}

function UserAdminCheckbox({name, defaultChecked}) {
    return ( <input name={name} defaultChecked={defaultChecked} type="checkbox" value="1"/> );
}

function UserTable({users, onEditSubmit, onDelete}) {
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState(null);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setShowEditDialog(true);
    };

    const rows = (users.map((user) => 
    <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.admin ? '✓' : '𐄂'}</td>
        <td>{user.username}</td>
        <td>{user.passhash}</td>
        <td>
            <div className="user_table_actions">
                <button onClick={() => {handleEditClick(user)}}>Edit</button>
                <button onClick={() => {onDelete(user)}}>Delete</button>
            </div>
        </td>
    </tr>
    ));

    return (
<>
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

{showEditDialog && 
<FormDialog onSubmit={onEditSubmit} onClose={() => setShowEditDialog(false)}>
    <EditUserInputs user={editingUser} />
</FormDialog>}
</>
    );
}

function ItemTable({items, onEditSubmit=(formData)=>{}, onDelete=(item)=>{}}) {
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setShowEditDialog(true);
    }

    const rows = (items.map((item) => 
    <tr key={item.sku}>
        <td>{item.sku}</td>
        <td>${item.price}</td>
        <td>{item.quantity}</td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>
            <div className="item_table_actions">
                <button onClick={() => handleEditClick(item)}>Edit</button>
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

{showEditDialog && 
<FormDialog onSubmit={onEditSubmit} onClose={() => setShowEditDialog(false)}>
    <EditItemInputs item={editingItem} />
</FormDialog>}
</>
    );
}

function useRemoteTableData(fetchFunc) {
    const [objs, setObjs] = React.useState([]);

    const updateObjs = async () => { setObjs(await fetchFunc()); };

    React.useEffect(() => {
        let ignore = false;
        if (!ignore) {
            updateObjs();
        }
        return () => ignore = true;
    }, []);
    return [objs, updateObjs];
}

function AdminItemPanel() {
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [objs, updateObjs] = useRemoteTableData(Item.prototype.getItems);

    const handleAddClick = () => { setShowAddDialog(true); }
    const handleAddClose = () => { setShowAddDialog(false); }

    const handleEditSubmit = async (formData) => {
        await controller.updateItem({
            __proto__: Item.prototype,
            sku: formData.get("sku"),
            price: formData.get("price"),
            quantity: formData.get("quantity"),
            name: formData.get("name"),
            description: formData.get("description")
        }).then(response => { if (response.ok) updateObjs();  });
    }

    const handleDeleteObj= async (item) => {
        await controller.deleteItem(item).then(response => { if (response.ok) updateObjs();  });
    }

    const handleAddSubmit = async (formData) => {
        await controller.createItem(formData).then(response => { if (response.ok) updateObjs(); });
    }

    return (
<>
<button type="button" onClick={handleAddClick}>Add Item</button>
{showAddDialog && 
<FormDialog onSubmit={handleAddSubmit} onClose={handleAddClose}>
    <AddItemInputs />
</FormDialog>}

<ItemTable items={objs} onEditSubmit={handleEditSubmit} onDelete={handleDeleteObj} />
</>
    );            
}

function AdminUserPanel() {
    const [showUserAddDialog, setShowUserAddDialog] = React.useState(false);
    const [users, updateUsers] = useRemoteTableData(User.prototype.getUsers);

    const handleAddClick = () => { setShowUserAddDialog(true); }
    const handleAddClose = () => { setShowUserAddDialog(false); }

    const handleEditSubmit = async (formData) => {
        await controller.updateUser({
            __proto__: User.prototype,
            id: formData.get("id"),
            admin: formData.get("admin") ?? "0",
            username: formData.get("username"),
            passhash: formData.get("passhash")
        }).then(response => { if (response.ok) updateUsers(); });
    }

    const handleDelete = async (user) => {
        await controller.deleteUser(user).then(response => { if (response.ok) updateUsers(); })
    }

    const handleAddSubmit = async (formData) => {
        controller.createUser(formData).then(response => { if (response.ok) updateUsers(); });
    }


    return(
<>
<button type="button" onClick={handleAddClick}>Add User</button>
<UserTable users={users} onEditSubmit={handleEditSubmit} onDelete={handleDelete}/>

{showUserAddDialog && 
<FormDialog onSubmit={handleAddSubmit} onClose={handleAddClose}>
    <AddUserInputs />
</FormDialog>}
</>
    );
}

root.render(
<>
    <Navigation />

    <h2>Users</h2>
    <AdminUserPanel />

    <h2>Items</h2>
    <AdminItemPanel />
</>
);