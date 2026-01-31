import express = require("express");

const app = express();
app.use(express.json());

let ETH_BALANCE = 200;
let USDC_BALANCE = 539684;

// IF Price of Etherum will not change over next few years is when you should do what we do in it
// If etherum go up alot and you follow the strategy you will recive the impermanent loss when it not come down

// So providing liquidity/ create own your dex will only make sense when your asset remains the same => i.e., why the most popular polls are USDC/USDT

// app.post("/add-liquidity", (req, res) => {

// })

app.post("/buy-asset", (req, res) => {
    if (!req.body || !req.body.quantity) {
        return res.status(400).json({ error: "Missing quantity in request body" });
    }
    const quantity = req.body.quantity;
    if (quantity <= 0 || quantity > ETH_BALANCE) {
        return res.status(400).json({ error: "Invalid quantity" });
    }
    const updatedETHQuantity = ETH_BALANCE - quantity;
    const updatedUSDCBalance = ETH_BALANCE * USDC_BALANCE / updatedETHQuantity;
    const paidAmount = updatedUSDCBalance - USDC_BALANCE;

    ETH_BALANCE = updatedETHQuantity;
    USDC_BALANCE = updatedUSDCBalance;

    res.json({
        message: `You Paid ${paidAmount} USDC for ${quantity} ETH`
    })
})

app.post("/sell-asset", (req, res) => {
    if (!req.body || !req.body.quantity) {
        return res.status(400).json({ error: "Missing quantity in request body" });
    }
    const quantity = req.body.quantity;
    if (quantity <= 0 || quantity > USDC_BALANCE) {
        return res.status(400).json({ error: "Invalid quantity" });
    }
    const updatedETHQuantity = ETH_BALANCE + quantity;
    const updatedUSDCBalance = (ETH_BALANCE * USDC_BALANCE) / updatedETHQuantity;
    const paidAmount = USDC_BALANCE - updatedUSDCBalance;

    ETH_BALANCE = updatedETHQuantity;
    USDC_BALANCE = updatedUSDCBalance;

    res.json({
        message: `You Got ${paidAmount} USDC for ${quantity} ETH`,
        pool: {
            ETH_BALANCE,
            USDC_BALANCE
        }
    })
})

app.listen(3000)
