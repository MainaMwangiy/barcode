import "../dbr";
import { BarcodeScanner } from 'dynamsoft-javascript-barcode';
import React from 'react';

class BarcodeScannerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.pScanner = null;
        this.elRef = React.createRef();
    }
    async componentDidMount() {
        try {
            if (this.pScanner == null)
                this.pScanner = BarcodeScanner.createInstance();
            const scanner = await this.pScanner;
            this.elRef.current.appendChild(scanner.getUIElement());
            this.elRef.current.style.width = "100%";
            this.elRef.current.style.height = "100%";
            scanner.onFrameRead = results => {
                for (let result of results) {
                    const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
                    this.props.appendMessage({ format, text: result.barcodeText, type: "result" });
                    if (result.barcodeText.indexOf("Attention(exceptionCode") !== -1) {
                        this.props.appendMessage({ msg: result.exception.message, type: "error" });
                    }
                }
            };
            await scanner.open();
        } catch (ex) {
            this.props.appendMessage({ msg: ex.message, type: "error" });
            console.error(ex);
        }
    }

    shouldComponentUpdate() {
        // Never update UI after mount, dbrjs sdk use native way to bind event, update will remove it.
        return false;
    }
    render() {
        return (
            <div ref={this.elRef}>
            </div>
        );
    }
}

export default BarcodeScannerComponent;
