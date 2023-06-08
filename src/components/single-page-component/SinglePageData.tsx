import useWindowSize from "../../hooks/use-size";

const SinglePageData: React.FC<{ chiave: string }> = (props) => {
    const [width] = useWindowSize();

    return (
        <div className="singlePageGroup">
            {width > 500 && (
                <h4 className="singlePageTitolo">{props.chiave}:</h4>
            )}
            {width > 500 && (
                <h4 className="singlePageDato">{props.children}</h4>
            )}
            {width <= 500 && (
                <h5 className="singlePageTitolo">{props.chiave}:</h5>
            )}
            {width <= 500 && (
                <h5 className="singlePageDato">{props.children}</h5>
            )}
        </div>
    );
};

export default SinglePageData;
