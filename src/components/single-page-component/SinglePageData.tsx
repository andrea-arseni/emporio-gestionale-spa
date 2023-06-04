const SinglePageData: React.FC<{ chiave: string }> = (props) => {
    return (
        <div className="singlePageGroup">
            <h4 className="singlePageTitolo">{props.chiave}:</h4>
            <h4 className="singlePageDato">{props.children}</h4>
        </div>
    );
};

export default SinglePageData;
