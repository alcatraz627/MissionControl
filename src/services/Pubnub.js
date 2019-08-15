import PubNub from 'pubnub';

import { PUBNUB_CONFIG } from '../constants';


const {DEFAULT_CHANNEL, PUB_KEY, SUB_KEY} = PUBNUB_CONFIG;

export class PubNubService {
    /**
     * 
     * @var publishKey : String
     * @var subscribeKey : String  
     * @var channels : [String]  
     * @var listeners : {'fname': 'fname'} //To avoid duplicacy
     *   
     */
    constructor({publishKey, subscribeKey, channels}) {
        // console.log("Init");
        this.pubnub = new PubNub({
            publishKey: publishKey || PUB_KEY,
            subscribeKey: subscribeKey || SUB_KEY,
        });
        // console.log("Connected!");

        this.channels = channels || [DEFAULT_CHANNEL];
        this.pubnub.subscribe({
            channels: this.channels,
        })
        // console.log("Subscribed!");

        this.pubnub.addListener({
            message: m => {
                // console.log("Message from PubNub", m.message);
                Object.keys(this.listeners).map(l => {this.listeners[l](m)})
            }
        })
    };

    publish = ({message}) => {

        let pub_config = {
            channel: this.channels,
            message: message || "EMPTY_MESSAGE",
        };

        this.pubnub.publish(pub_config, (status, resp) => {
            // console.log("PubNub Response:", status, resp);
        })
    };

    subscribe = (callback) => {
        this.listeners = {...this.listeners, [callback.toString()]: callback};
        let unsubscribe = () => {delete this.listeners[callback];}
        return unsubscribe;
    }



}