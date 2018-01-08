const puppeteer = require("puppeteer");

class MonoChrome {
    protected browser: any;

    protected debug: boolean = false;

    constructor(debug?: boolean) {
        if (debug) {
            this.debug = debug;
        }
    }

    public async getBrowser(): Promise<any> {
        const opt: {[k: string]: any} = {
            ignoreHTTPSErrors: true,
        };

        if (this.browser) {
            opt.browserWSEndpoint = this.browser.wsEndpoint();

            try {
                return await puppeteer.connect(opt);
            } catch (e) {
                this.log(e);
                this.closeBrowser(this.browser);
            }
        }

        const newBrowser = await this.launchBrowser();
        try {
            opt.browserWSEndpoint = newBrowser.wsEndpoint();

            const websocket = await puppeteer.connect(opt);
            this.browser = newBrowser;

            return websocket;
        } catch (e) {
            this.closeBrowser(newBrowser);
            throw e;
        }
    }

    protected async launchBrowser(): Promise<any> {
        const args = ["--single-process", "--process-per-site"];
        const opt = {
            headless: !this.debug,
            devtools: this.debug,
            ignoreHTTPSErrors: true,
            args: args,
        };

        return await puppeteer.launch(opt);
    }

    protected closeBrowser(browser: any) {
        safelyCloseBrowser(browser).catch((e: any) => {
            this.log("Error closing browser: " + e);
        })
    }

    protected log(msg: string) {
        if (this.debug) {
            (console as any).log(msg);
        }
    }
}

async function safelyCloseBrowser(browser: any): Promise<any> {
    let numPages = 0;

    do {
        const pages = await browser.pages();
        numPages = pages.length;
    } while (numPages > 1);

    return browser.close();
}

module.exports = MonoChrome;