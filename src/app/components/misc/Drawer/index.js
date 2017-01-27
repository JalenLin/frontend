import m from "mithril";
import Log from "lib/log";
import "./drawer.scss";

const log = Log.child(__filename);

export default {
    oninit({state}) {
        state.isDragging = false;
        state.isOpen = false;
        state.menuMaxWidth = 0;
        state.startX = 0;
        state.currX = 0;
        const TARGET_OPACITY = 0.7;
        const DRAG_THRESHOLD = 0.30;

        state.onTouchStart = function (e) {
            log.trace("ontouchstart");
            state.startX = e.touches[0].pageX;
            state.isDragging = true;
            state.backgroundEl.style.display = "block";
            state.containerEl.classList.add("no-transition");
        };
        state.onTouchMove = function (e) {
            if (!state.isDragging) { return; }
            log.trace("ontouchmove");
            // check distance and animate difference
            state.currX = e.touches[0].pageX;
            if ((state.currX - state.startX) < state.menuMaxWidth) {
                // we are not fully opened yet.
                // animate stuff
                e.preventDefault();
                if (state.isOpen && state.currX > state.startX) {
                    // return early if the user wantds to drag further than max distance
                    return;
                } else {
                    // otherwise display the change
                    const changeX = Math.min(state.currX - state.menuMaxWidth, 0);
                    state.drawerEl.style.transform = state.drawerEl.style.webkitTransform = `translateX(${changeX}px)`;
                    state.backgroundEl.style.opacity = (((state.currX - state.startX) / state.menuMaxWidth) * TARGET_OPACITY).toFixed(2);
                }
            } else {
                // if the drag brings us over the 
                state.isOpen = true;
                state.containerEl.classList.add("is-open");
                return;
            }
        };
        state.onTouchEnd = function (e) {
            log.trace("ontouchend");
            state.isDragging = false;
            state.containerEl.classList.remove("no-transition");

            // check which direction to fall to and animate
            const deltaX = state.currX - state.startX;
            if (Math.abs(deltaX) > (state.menuMaxWidth * DRAG_THRESHOLD)) {
                if (state.currX < state.startX) {
                    log.trace("fall close");
                    // we are dragging to close -> close menu
                    state.onCloseMenu();
                    return;
                } else {
                    log.trace("fall open");
                    // we dragged more than enough to 'fall open'
                    state.isDragging = false;
                    state.isOpen = true;
                    state.containerEl.classList.add("is-open");
                    state.drawerEl.style.transform = state.drawerEl.style.webkitTransform = `translateX(0px)`;
                    state.backgroundEl.style.opacity = TARGET_OPACITY;
                }
            } else {
                state.onCloseMenu();
            }
            // we are open now. stop dragging
        };
        state.onCloseMenu = function(e) {
            log.trace("onclosemenu");
            state.isDragging = false;
            state.isOpen = false;
            state.startX = 0;
            state.containerEl.classList.remove("is-open");
            state.drawerEl.style.transform = "";
            state.backgroundEl.style.display = "none";
        };
        state.onOpenMenu = function (e) {
            log.trace("onopenmenu");
            state.isDragging = false;
            state.isOpen = true;
            state.startX = 0;
            state.containerEl.classList.add("is-open");
            state.containerEl.classList.remove("no-transition");
            state.drawerEl.style.transform = "translateX(0px)";
            state.backgroundEl.style.display = "block";
            state.backgroundEl.style.opacity = TARGET_OPACITY;
        };
        state.cancelEvent = function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    },
    oncreate({dom, state}) {
        state.containerEl = dom;
        state.backgroundEl = dom.querySelector(".drawer-background");
        state.drawerEl = dom.querySelector(".drawer-container");
        state.menuMaxWidth = dom.querySelector(".drawer-menu").clientWidth;
    },
    view({state, children}) {
        return (<div className="drawer">
            <div className="drawer-burger" onclick={state.onOpenMenu}>MENU</div>    
            <div className="drawer-background" onclick={state.onCloseMenu}></div>
            <div className="drawer-container"
                    ontouchstart={state.onTouchStart}
                    ontouchmove={state.onTouchMove}
                    ontouchend={state.onTouchEnd}>
                <div className="drawer-menu" ontouchstart={state.cancelEvent}>
                    {children}
                </div>
            </div>
        </div>);
    }
};