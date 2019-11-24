import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* editCard(action) {
  try {
    yield axios.put(`/cards/${action.payload.id}`,action.payload.details);
    yield put({type:"GET_CARDS"});
  } catch (error) {
    console.log('Cards get request failed', error);
  }
}

function* editCardSaga() {
  yield takeLatest('EDIT_CARD', editCard);
}

export default editCardSaga;
