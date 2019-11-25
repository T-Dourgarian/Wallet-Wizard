const userLocation = (state = [], action) => {
    if(action.type==='SET_USER_LOCATION') {
        return action.payload;
    }
    return state;
  };
  
  export default userLocation;