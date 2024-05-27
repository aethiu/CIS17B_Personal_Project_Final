async function getItem(sku) {
    const response = await fetch("get_items.php?sku="+sku);
    const items = await response.json();
    return items[0];
}

function ItemCard({sku}) {
    const [item, setItem] = React.useState();

    React.useEffect(() => {
        let ignore = false;
        async function startFetch() {
            const res = await getItem(sku);
            if (!ignore) {
                setItem(res);
            }
        }
        startFetch();
        return () => { ignore = true; };
    }, [sku]);

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
    const skus = [1, 2, 3, 4, 5];
    const items = skus.map(sku => <ItemCard sku={sku} key={sku}/>);
    return (
        <div className="items">{items}</div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("items_container"));
root.render(
    <ItemList />
);