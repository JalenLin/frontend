import m from "mithril";
const isConsole = require("lib/constants").isConsole;

export default {
    view({attrs}) {
        return (
            <div className={`entry bottom-entry is-pos-${attrs.pos}`}>
                <div className="entry-place">{attrs.pos}</div>
                <div className="entry-content">
                    <a href={`/player/${attrs.id}`} className="entry-name">{attrs.name}</a>

                    {isConsole ? null : <a href={`https://game-rainbow6.ubi.com/en-gb/uplay/player-statistics/${attrs.id}/multiplayer`} className="entry-link">
                        › view on uplay
                    </a>}
                    <div className="entry-rating">
                        <span className="entry-valuelabel">Chankas</span>
                        <div className="entry-value">
                            {parseInt(attrs.value)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
