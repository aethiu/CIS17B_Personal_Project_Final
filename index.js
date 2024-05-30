const controller = new Controller();
const root = ReactDOM.createRoot(document.getElementById("root"));

function ItemCard({item}) {
    const handle_add_to_cart = () => {
        if (item) {
            controller.add_to_cart(item);
        }
    };

    return (
        <div className="item_card">
            <div className="item_image_placeholder"></div>
            <div className="item_name">{item ? item.name : "Loading..."}</div>
            <div className="price">Price: ${item && item.price}</div>
            <div className="stock">Stock: {item && item.quantity}</div>
            <button className="add_to_cart_btn" disabled={!(item && item.quantity != 0)} onClick={handle_add_to_cart}>Add to Card</button>
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

root.render(
    <>
        <Navigation />
        <ItemList />
    </>
);