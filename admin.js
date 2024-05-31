const root = ReactDOM.createRoot(document.getElementById("root"));
const controller = new Controller();

function EditForm({obj, uri, onCancel=()=>{}}) {
    const members = [];
    for (let member in obj) {
        members.push(<>
        <label htmlFor={member}>{member}</label>
        <input type="text" name={member} defaultValue={obj[member]}></input>
        </>);
    }

    return (
        <form method="post" action={uri}>
            {members}
            <button>Submit</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

function FetchTableRow({obj, onEdit}) {
    const members = [];
    for (let member in obj) {
        members.push(<td>{obj[member]}</td>);
    }

    return (
        <tr>
            {members}
            <td>
                <a><button type="button" onClick={() => onEdit(obj)}>Edit</button></a>
            </td>
        </tr>
    );
}

function FetchTable({uri}) {
    let [header, setHeader] = React.useState();
    let [rows, setRows] = React.useState([<tr><td>Loading data...</td></tr>]);
    let [form, setForm] = React.useState();

    const onCancel = () => setForm();
    const onEdit = obj => setForm(<EditForm uri={uri} obj={obj} onCancel={onCancel} />);

    React.useEffect(() => {
        let ignore = false;

        async function populateRows() {
            const promise = await fetch(uri);
            const response = await promise.json();
            const header = [];
            const rows = [];

            // Add table header
            for (let member in response[0]) {
                header.push(<th>{member}</th>);
            }
            
            // Add data rows
            for (let obj of response) {
                rows.push(<FetchTableRow obj={obj} onEdit={onEdit}/>)
            }

            setHeader(header);
            setRows(rows);
        }
        populateRows();

        return () => { ignore = true; };
    }, [uri]);

    return (
        <>
        <table>
            <thead><tr>{header}</tr></thead>
            <tbody>{rows}</tbody>
        </table>
        {form}
        </>
    );
}

root.render(
<>
<Navigation />
<h1>Admin Panel</h1>
<h3>Users</h3>
<FetchTable uri="model/api/users.php" />
<h3>Items</h3>
<FetchTable uri="model/api/items.php" onEdit={()=>{}}/>

</>
);