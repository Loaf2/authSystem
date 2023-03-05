require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2");
const mysqlPromises = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt_decode = require("jwt-decode");

const jwt = require("jsonwebtoken");

const endpointSecret =
    process.env.WEBHOOK_SECRET;

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DBPASSWORD,
    database: "usersDB",
});

app.post("/register", async (req, res) => {
    const username = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let equal = false;
    connection.query(
        "SELECT username FROM users WHERE username = ?",
        [username],
        function (err, rows, fields) {
            if (rows.length === 0) {
                const data = JSON.stringify({username: username});
                connection.query(
                    "INSERT INTO users(username, password, data) VALUES(?,?,?)",
                    [username, hashedPassword, data],
                    function (err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                res.json("Success");
            } else {
                return res.json("Equal");
            }
        }
    );
});

app.post("/login", (req, res) => {
    const userErrMsg =
        "Your username and/or password was incorrect.  Please try again";
    const {username, password} = req.body;
    if (!username || !password) return console.log(userErrMsg);
    connection.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, rows, fields) => {
            if (rows.length === 0) {
                res.json({auth: false});
                return console.log(userErrMsg);
            }

            const [{password: rowPassword}] = rows;
            const [{data: rowData}] = rows;
            const match = await bcrypt.compare(password, rowPassword);
            if (!match) return console.log(userErrMsg);

            console.log("Logged in");

            const id = rows[0].id;
            const token = jwt.sign({id}, process.env.JWT_SECRET_KEY, {
                expiresIn: 1200,
            });

            res.json([
                "Success",
                rowData,
                {username: username, password: rowPassword, auth: true, token: token},
            ]);
        }
    );
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.send("Yo, we need a token, please give it to us next time!");
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.json({auth: false, message: "U failed to authenticate" + err});
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.get("/isUserAuth", verifyJWT, (req, res) => {
    res.send({message: "You are authenticated!", auth: true});
});

app.get("/items", (req, res) => {
    connection.query(
        "SELECT items FROM storeItems",
        function (err, rows, fields) {
            if (rows.length !== 0) {
                res.json(rows);
            } else {
                return console.log("Empty store items");
            }
        }
    );
});

app.post("/create-checkout-session", async (req, res) => {
    try {
        const promiseConnection = await mysqlPromises.createConnection({
            host: "localhost",
            user: "root",
            database: "usersDB",
            password: process.env.DBPASSWORD,
        });
        const promises = req.body.items.map(async (item) => {
            const [rows, fields] = await promiseConnection.query(
                "SELECT * FROM storeItems WHERE id = ?",
                [item.id]
            );
            return rows.map((item) => {
                const itemData = item.items;
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: itemData.name,
                        },
                        unit_amount: itemData.priceInCents,
                    },
                    quantity: itemData.quantity,
                };
            });
        });
        const [lineItems] = await Promise.all(promises);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.SERVER_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SERVER_URL}/cancel`,
        });

        res.json({url: session.url});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

app.post("/retrieveStripeInfo", async (req, res) => {
    const stripeSessionId = req.body.stripeSessionId;
    const stripeData = await stripe.checkout.sessions.retrieve(
        stripeSessionId,
        {
            expand: ["line_items"],
        }
    );
    res.json(stripeData.line_items.data[0].description);
});


app.post("/inputUserItems", (req, res) => {
    const items = req.body.itemData
    const token = req.headers["x-access-token"]
    const decoded = jwt_decode(token)
    const userId = decoded.id
    console.log(`Items: ${items}\n, userId: ${userId}`)

    connection.query('UPDATE users SET items=? WHERE id = ?', [items, userId], function(err, rows, fields) {
        if (err) {
            console.log(err)
        }
        console.log(rows)
    })
})
app.listen(3000);