import m from "mithril";

export default {
    view: ({attrs, children}) => (
        <div className="stat-section">
            <div className="stat-section-title">{attrs.title}</div>
            <div className="stat-section-content">{children}</div>
        </div>
    )
};