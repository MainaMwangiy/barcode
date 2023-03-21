import './HelloWorld.css';
import React from 'react';
import BarcodeScannerComponent from './BarcodeScannerComponent';
import "../dbr";
import { BarcodeScanner } from 'dynamsoft-javascript-barcode';

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            libLoaded: false,
            resultValue: "",
            bShowScanner: false
        };
    }
    async componentDidMount() {
        try {
            //Load the library on page load to speed things up.
            await BarcodeScanner.loadWasm();
            this.setState(state => {
                state.libLoaded = true;
                return state;
            }, () => {
                this.showScanner();
            });
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    }    
    showScanner = () => {
        this.setState({
            bShowScanner: true
        });
    }
    appendMessage = (message) => {
        console.log(message);
        switch (message.type) {
            case "result":
                this.setState(prevState => {
                    prevState.resultValue = message.format + ": " + message.text;
                    return prevState;
                });
                break;
            case "error":
                this.setState(prevState => {
                    prevState.resultValue = message.msg;
                    return prevState;
                });
                break;
            default: break;
        }
    }
    
    render() {
        return (
            <div className="helloWorld">
                <div id="UIElement">
                    {!this.state.libLoaded ? (<span>Loading Library...</span>) : ""}
                    {this.state.bShowScanner ? (<BarcodeScannerComponent appendMessage={this.appendMessage}></BarcodeScannerComponent>) : ""}
                </div>
                <input type="text" value={this.state.resultValue} readOnly={true} id="resultText" />
            </div>
        );
    }
    
}
export default HelloWorld;
