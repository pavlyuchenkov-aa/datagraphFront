const SERVER_URL = "http://141.95.127.215:7328/"
const MINI_GRAPH_DATA_URL = 'http://141.95.127.215:7328/get:short';
const FULL_GRAPH_DATA_URL = 'http://141.95.127.215:7328/get:full';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const formatNumberToK = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
}

export { ITEM_HEIGHT, ITEM_PADDING_TOP, SERVER_URL, MINI_GRAPH_DATA_URL, FULL_GRAPH_DATA_URL, formatNumberToK }