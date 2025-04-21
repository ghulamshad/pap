import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchVideosStart, fetchVideosSuccess, fetchVideosFailure } from '../slices/videoSlice';
import { youtubeService } from '../../services/youtubeService';

function* fetchVideosSaga(action: ReturnType<typeof fetchVideosStart>): Generator<any, void, any> {
  try {
    const { pageToken, maxResults } = action.payload;
    const response = yield call(youtubeService.fetchVideos, pageToken, maxResults);
    yield put(fetchVideosSuccess(response));
  } catch (error) {
    yield put(fetchVideosFailure(error instanceof Error ? error.message : 'Failed to fetch videos'));
  }
}

export function* videoSaga() {
  yield takeLatest(fetchVideosStart.type, fetchVideosSaga);
} 