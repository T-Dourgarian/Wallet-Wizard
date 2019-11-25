import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { put, takeLatest } from 'redux-saga/effects';
import {select} from 'redux-saga/effects'

function* getCoordinates(action) {
    const state = yield select();
    console.log("THIS IS STATE",state);
    let coordinatesArray = [];
    for (const card of action.payload) {
        coordinatesArray.push(yield getCoordinate(card,state.userLocation));
    }
    yield put({type:'SET_COORDINATES',payload:coordinatesArray})
    return coordinatesArray;

};

let handleSelect = async (location,value) => {
    const results = await geocodeByAddress(value)
    const latlng = await getLatLng(results[0]);
    return [latlng,results,location];
}

function* getCoordinate(card,userLocation) {
        if (userLocation[1]) {
            return yield handleSelect(card.location, card.location + userLocation[1]);
        } else {
            return yield handleSelect(card.location, card.location);
        }
}

function* coordinatesSaga() {
    yield takeLatest('GET_COORDINATES', getCoordinates);
}



export default coordinatesSaga;