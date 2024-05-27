async function getItem(sku) {
    const response = await fetch("model/get_items.php?sku="+sku);
    const items = await response.json();
    return items && items[0];
}

async function getItems() {
    const response = await fetch("model/get_items.php");
    return await response.json();
}

function ItemCard({item}) {
    return (
        <div className="item_card">
            <div className="item_image_placeholder"></div>
            <div className="price">Price: ${item && item.price}</div>
            <div className="stock">Stock: {item && item.quantity}</div>
            <button className="add_to_cart_btn">Add to Card</button>
        </div>
    );
}

function ItemList() {
    const [items, setItems] = React.useState();

    React.useEffect(() => {
        let ignore = false;

        async function startFetch() {
            const res = await getItems();
            if (!ignore) {
                const itemlist = res.map(item => <ItemCard item={item} key={item.sku}/>);
                setItems(itemlist);                
            }
        }
        startFetch();
        
        return () => { ignore = true; };

    }, []);

    return (
        <div className="items">{items}</div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("items_container"));
root.render(
    <ItemList />
);