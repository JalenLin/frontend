const m = require("mithril");
const { Ranks } = require("lib/constants");

const games = s => s.wins + s.losses;

module.exports = {
	season: null,
	oninit({attrs, state}) {
		let player = attrs.player;
		
		let {apac, emea, ncsa} = player.rank;

		let season = apac;
		if(games(emea) > games(season)) {
			season = emea;
		}
		if(games(ncsa) > games(season)) {
			season = ncsa;
		}
		if(games(season) > 10) {
			state.season = season;
		}	
	},
	view: ({ state }) => state.season == null
			? ""
			: (<div className="detail-rankedstats module">
				<header className="module-header">Ranked Stats (season)</header>
				<div className="module-row">
					<div className="module-label">Wins</div>
					<div className="module-value">{state.season.wins}</div>
				</div>
				<div className="module-row">
					<div className="module-label">Losses</div>
					<div className="module-value">{state.season.losses}</div>
				</div>
				<div className="module-row">
					<div className="module-label">Win rate</div>
					<div className="module-value">{
						((state.season.wins/
							(state.season.wins+state.season.losses))*100
						).toFixed(2)
					}%</div>
				</div>
				<div className="module-row">
					<div className="module-label">MMR</div>
					<div className="module-value">{state.season.mmr.toFixed(2)}</div>
				</div>
				<div className="module-row">
					<div className="module-label">Rank</div>
					<div className={`module-value rank-${state.season.rank - 1}`}>{Ranks[state.season.rank - 1]}</div>
				</div>
				<div className="module-row">
					<div className="module-label">Skill</div>
					<div className="module-value">{state.season.skill_mean.toFixed(2)} ± {state.season.skill_stdev.toFixed(2)}</div>
				</div>
			</div>)
};
