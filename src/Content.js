import React, {Component} from "react";
import axios from "axios";

import "./content.css"

let user = "FYERS601";
let pwd = "3j7rkeGR";
// enter the port you have been given for RT data. Production = 8082, Sandbox = 8084
let port = "8082"

class Content extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null,

            GOLDPETAL:'',
            GOLDPETAL_I:'',
            GOLDPETAL_II:'',
            GOLDPETAL_III:'',

            GOLDGUINEA:'',
            GOLDGUINEA_I:'',
            GOLDGUINEA_II: '',
            GOLDGUINEA_III:'',

            GOLD:'',
            GOLD_I:'',
            GOLD_II:'',
            GOLD_III:'',

            GOLDM:'',
            GOLDM_I:'',
            GOLDM_II:'',
            GOLDM_III:''




        };
    }

    componentDidMount() {
        // axios({
        //     method: 'GET',
        //     url: 'https://www.goldapi.io/api/XAU/USD',
        //     headers: {
        //         'x-access-token': 'goldapi-3u10ukfgd82ej-io',
        //         'Content-Type': 'application/json'
        //     }
        //
        // }).then((res)=>{
        //     this.setState({
        //         gold: res.data.ask
        //     })
        //     console.log(res.data)
        // }).catch((error)=>{
        //     console.log(error)
        // })
        this.connect();
    }
    timeout = 250; // Initial timeout duration as a class variable

    connect = () => {
        var url = 'wss://push.truedata.in:' + port + '?user=' + user + '&password=' + pwd;
        var ws = new WebSocket(url);
        let that = this; // cache the this
        var connectInterval;

        // websocket onopen event listener
        ws.onopen = () => {
            console.log("connected websocket main component");

            this.setState({ ws: ws });

            // that.timeout = 250; // reset timer to 250 on open of websocket connection
            // clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        ws.onmessage=e=>{
            var jsonObj = JSON.parse(e.data);
            if(jsonObj.success)
            {
                switch(jsonObj.message)
                {
                    case "TrueData Real Time Data Service":
                        console.log('Symbols:' + jsonObj.maxsymbols + ' Data:' +jsonObj.subscription + ' Valid Upto: ' + jsonObj.validity);
                        var jsonRequest = {
                            "method":"addsymbol",
                            "symbols":["GOLD","GOLD-I","GOLD-II","GOLD-III", "GOLDPETAL","GOLDPETAL-I","GOLDPETAL-II","GOLDPETAL-III",
                            "GOLDM","GOLDM-I","GOLDM-II","GOLDM-III", "GOLDGUINEA","GOLDGUINEA-I","GOLDGUINEA-II","GOLDGUINEA-III"]
                            // "symbols":["NIFTY 50","NIFTY-I","HDFC","CRUDEOIL-I","GOLD-I","SILVER-I"]
                        };
                        let s = JSON.stringify(jsonRequest);
                        ws.send(s);
                        break;
                    case "symbols added":
                        console.log('Added Symbols:' + jsonObj.symbolsadded);
                        break;
                    case "HeartBeat":
                        console.log('Message ' + jsonObj.message + ' Time: ' + jsonObj.timestamp);
                        break;
                    default:
                        console.log(jsonObj);
                }
            }
            if(jsonObj.success == false)
            {
                console.log("Not connected");
            }
            if(jsonObj.trade != null)
            {
                //console.log(jsonObj.trade)
                var tradeArray = jsonObj.trade;
                // console.log("SymbolId: " + tradeArray[0] +  " Time: " + tradeArray[1] + " LTP:" + tradeArray[2] + " Volume:" + tradeArray[3]);
            }
            if(jsonObj.bidask !=null)
            {

                var bidaskArray = jsonObj.bidask;

                switch (bidaskArray[0]){

                    //GOLDPETAL-I
                    case '950000120':
                        return this.setState({
                            GOLDPETAL_I:bidaskArray[4]
                        })

                    //GOLDPETAL-II
                    case '950000122':
                        return this.setState({
                            GOLDPETAL_II:bidaskArray[4]
                        });

                    //GOLDPETAL-III
                    case'950000124':
                        return this.setState({
                            GOLDPETAL_III:bidaskArray[4]
                        });

                    //GOLD-I
                    case '950000096':
                        return this.setState({
                            GOLD_I:bidaskArray[4]
                        })
                    //GOLD-II
                    case '950000098':
                        return this.setState({
                            GOLD_II:bidaskArray[4]
                        })

                    //GOLD-III
                    case '950000100':
                        return this.setState({
                            GOLD_III:bidaskArray[4]
                        })

                    // //GOLDM
                    // case '800000004':
                    //     return this.setState({
                    //         GOLDM:bidaskArray[4]
                    //     })

                    //GOLDM-I
                    case '950000114':
                        return this.setState({
                            GOLDM_I:bidaskArray[4]
                        })

                    //GOLDM-II
                    case '950000116':
                        return this.setState({
                            GOLDM_II:bidaskArray[4]
                        })

                    //GOLDM-III
                    case '950000118':
                        return this.setState({
                            GOLDM_III:bidaskArray[4]
                        })

                    //GOLDGUINEA-I
                    case '950000108':
                        return this.setState({
                            GOLDGUINEA_I:bidaskArray[4]
                        })

                    //GOLDGUINEA-II
                    case '950000110':
                        return this.setState({
                            GOLDGUINEA_II:bidaskArray[4]
                        })

                    //GOLDGUINEA-III
                    case '950000112':
                        return this.setState({
                            GOLDGUINEA_III:bidaskArray[4]
                        })


                    default:
                        return ''
                }



                console.log("SymbolId: " + bidaskArray[0]  + " Bid:"
                    // + bidaskArray[2] + " BidQty:"
                    + bidaskArray[3] + " Ask:" + bidaskArray[4]
                    // " AskQty:" + bidaskArray[5]
                );
            }
        }

        // websocket onclose event listener
        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
    };
    check = () => {
        const { ws,value } = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };

    render() {
        return (
            <div className="content">
                <div className="coldPage">
                    <table className="table">
                        <tbody>
                        <tr>
                            <td>Gold</td>
                            <td>$ {this.state.gold}</td>
                        </tr>
                        <tr>
                            <td>Silver</td>
                            <td>$</td>
                        </tr>
                        <tr>
                            <td>USD/INR</td>
                            <td>₹</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table table-striped table-warning">
                    <thead>
                    <tr>
                        <th scope="col">Name Of The Product</th>
                        <th scope="col">Selling Price Of Spot (99.90) Gold In ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ On Sat&Sun (Without Tax)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row" className="num">1 Gram Gold</th>
                        <td>{this.state.GOLDPETAL_I}</td>
                        {this.state.GOLDPETAL_I!=='' ? <td>{this.state.GOLDPETAL_I - 50}</td> :<td></td>}
                        {this.state.GOLDPETAL_I!=='' ? <td>{this.state.GOLDPETAL_I - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">1 Gram Gold</th>
                        <td>{this.state.GOLDPETAL_II}</td>
                        {this.state.GOLDPETAL_II!=='' ? <td>{this.state.GOLDPETAL_II - 50}</td> :<td></td>}
                        {this.state.GOLDPETAL_II!=='' ? <td>{this.state.GOLDPETAL_II - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">1 Gram Gold</th>
                        <td>{this.state.GOLDPETAL_III}</td>
                        {this.state.GOLDPETAL_III!=='' ? <td>{this.state.GOLDPETAL_III - 50}</td> :<td></td>}
                        {this.state.GOLDPETAL_III!=='' ? <td>{this.state.GOLDPETAL_III - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">1 Gram Gold</th>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>

                <div className="unit">
                    <text>1 gram gold units stock available [125]</text>
                </div>


                <table className="table table-striped table-warning">
                    <thead>
                    <tr>
                        <th scope="col">Name Of The Product</th>
                        <th scope="col">Selling Price Of Spot (99.90) Gold In ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ On Sat&Sun (Without Tax)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row" className="num">8 Gram Gold</th>
                        <td>{this.state.GOLDGUINEA_I}</td>
                        {this.state.GOLDGUINEA_I!=='' ? <td>{this.state.GOLDGUINEA_I - 50}</td> :<td></td>}
                        {this.state.GOLDGUINEA_I!=='' ? <td>{this.state.GOLDGUINEA_I - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">8 Gram Gold</th>
                        <td>{this.state.GOLDGUINEA_II}</td>
                        {this.state.GOLDGUINEA_II!=='' ? <td>{this.state.GOLDGUINEA_II - 50}</td> :<td></td>}
                        {this.state.GOLDGUINEA_II!=='' ? <td>{this.state.GOLDGUINEA_II - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">8 Gram Gold</th>
                        <td>{this.state.GOLDGUINEA_III}</td>
                        {this.state.GOLDGUINEA_III!=='' ? <td>{this.state.GOLDGUINEA_III - 50}</td> :<td></td>}
                        {this.state.GOLDGUINEA_III!=='' ? <td>{this.state.GOLDGUINEA_III - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">8 Gram Gold</th>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>

                <div className="unit">
                    <text>8 gram gold units stock available [125]</text>
                </div>


                <table className="table table-striped table-warning">
                    <thead>
                    <tr>
                        <th scope="col">Name Of The Product</th>
                        <th scope="col">Selling Price Of Spot (99.90) Gold In ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ On Sat&Sun (Without Tax)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row" className="num">100 Grams Gold</th>
                        <td>{this.state.GOLDM_I}</td>
                        {this.state.GOLDM_I!=='' ? <td>{this.state.GOLDM_I - 50}</td> :<td></td>}
                        {this.state.GOLDM_I!=='' ? <td>{this.state.GOLDM_I - 10}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">100 Grams Gold</th>
                        <td>{this.state.GOLDM_II}</td>
                        {this.state.GOLDM_II!=='' ? <td>{this.state.GOLDM_II - 50}</td> :<td></td>}
                        {this.state.GOLDM_II!=='' ? <td>{this.state.GOLDM_II - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">100 Grams Gold</th>
                        <td>{this.state.GOLDM_III}</td>
                        {this.state.GOLDM_III!=='' ? <td>{this.state.GOLDM_III - 50}</td> :<td></td>}
                        {this.state.GOLDM_III!=='' ? <td>{this.state.GOLDM_III - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">100 Grams Gold</th>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>

                <div className="unit">
                    <text>100 gram gold units stock available [125]</text>
                </div>


                <table className="table table-striped table-warning">
                    <thead>
                    <tr>
                        <th scope="col">Name Of The Product</th>
                        <th scope="col">Selling Price Of Spot (99.90) Gold In ₹ (Without Tax)</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ (Without Tax))</th>
                        <th scope="col">Buying Price Of Spot (99.90) Gold in ₹ On Sat&Sun (Without Tax)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row" className="num">1KG Grams Gold</th>
                        <td>{this.state.GOLD_I}</td>
                        {this.state.GOLD_I!=='' ? <td>{this.state.GOLD_I - 50}</td> :<td></td>}
                        {this.state.GOLD_I!=='' ? <td>{this.state.GOLD_I - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">1KG Grams Gold</th>
                        <td>{this.state.GOLD_II}</td>
                        {this.state.GOLD_II!=='' ? <td>{this.state.GOLD_II - 50}</td> :<td></td>}
                        {this.state.GOLD_II!=='' ? <td>{this.state.GOLD_II - 100}</td> :<td></td>}
                    </tr>
                    <tr>
                        <th scope="row" className="num">1KG Grams Gold</th>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row" className="num">1KG Grams Gold</th>
                        <td>{this.state.GOLD_III}</td>
                        {this.state.GOLD_III!=='' ? <td>{this.state.GOLD_III - 50}</td> :<td></td>}
                        {this.state.GOLD_III!=='' ? <td>{this.state.GOLD_III - 100}</td> :<td></td>}
                    </tr>
                    </tbody>
                </table>

                <div className="unit">
                    <text>1KG gram gold units stock available [125]</text>
                </div>


            </div>


        );
    }
}

export default Content;