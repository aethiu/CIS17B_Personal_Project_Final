function ModalDialog({onClose=()=>{}, children}) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        const dialog = ref.current;
        dialog.showModal();
        return () => dialog.close();
    });

    return (
<>
<dialog ref={ref} onClose={onClose}>
        {children}
</dialog>
</>
    );
}
