import PubNub from 'pubnub';
import { PUBNUB_SUBSCRIBER_KEY } from '../service/api'

const pubnub = new PubNub({
    subscribeKey: PUBNUB_SUBSCRIBER_KEY,
    ssl: true
});

//-------------------------------------------------------------------------------------------------
export default pubnub;