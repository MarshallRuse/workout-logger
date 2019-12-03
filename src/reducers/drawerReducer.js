const drawerReducer = (state, action) => {
    switch (action.type){
        case 'SIDE_DRAWER_OPEN':
            return {
                ...state,
                sideDrawerOpen: true
            };
        case 'SIDE_DRAWER_CLOSE':
            return {
                ...state,
                sideDrawerOpen: false
            };
        default:
            return state;
    }
};

export default drawerReducer;