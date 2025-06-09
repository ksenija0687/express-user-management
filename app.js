const express = require("express");

const port = 3011;
const app = express();

// http://localhost:3011
app.use(express.json());

const db = { max_id: 0, users: [] };

const sayHello = (req, res) => res.status(200).send("Hello world!");
app.get("/v1/hello", sayHello);

// http://localhost:3011/v1/users
app.post("/v1/users", (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email, password fields are mandatory." });
        }

        const user = {
            id: db.max_id + 1,
            username: username.trim(),
            email,
            password
        };

        // username validation: unique
        if (db.users.find(it => it.username === user.username)) {
            return res.status(409).json({
                message: "Username already exist"
            });
        };

        // username validation: min 3, max 35
        if (user.username.length < 3 || user.username.length > 35) {
            return res.status(400).json({
                message: "Username length min 3 and max 35)"
            });
        }

        // email validation: unique
        if (db.users.find(it => it.email === user.email)) {
            return res.status(409).json({
                message: "Email already exist"
            });
        }

        // email validation: keep email format
        // if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // password validation: length 8 and more, only letters and numbers
        // if (user.password.length < 8 || !user.password.match(/^[A-Za-z0-9]+$/)) {
        if (user.password.length < 8 || !user.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/)) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        db.max_id = user.id;
        db.users.push(user);

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/v1/users", (req, res) => {
    res.status(200).json(db.users);
});

app.get("/v1/users/:id", (req, res) => {
    const { id } = req.params;

    const index = db.users.findIndex(user => user.id == id);

    if (index === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(db.users[index]);
});

// http://localhost:3011/v1/login
// login
    // authorization: check email and password.
    // return message that user signed in.  
app.post("/v1/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const user = db.users.find(it => it.email === email)

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid user name or password" });
    }

    res.status(200).json({
        message: "Login successful",
        user:{
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

// put method with validations:
    // email validation: unique
    // email validation: keep email format
    // password validation: length 8 and more, only letters and numbers

app.put("/v1/users/:id", (req, res) => {
    const { username, email, password } = req.body;
    const { id } = req.params;
    const index = db.users.findIndex(user => user.id == id);

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required." });
    }

    const user = {
            id: id,
            username: username.trim(),
            email,
            password
        };

        // username validation: unique
        if (db.users.find(it => it.username === user.username)) {
            return res.status(409).json({
                message: "Username already exist"
            });
        };

        // username validation: min 3, max 35
        if (user.username.length < 3 || user.username.length > 35) {
            return res.status(400).json({
                message: "Username length min 3 and max 35)"
            });
        }

        // email validation: unique
        if (db.users.find(it => it.email === user.email)) {
            return res.status(409).json({
                message: "Email already exist"
            });
        }

        // email validation: keep email format
        // if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // password validation: length 8 and more, only letters and numbers
        // if (user.password.length < 8 || !user.password.match(/^[A-Za-z0-9]+$/)) {
        if (user.password.length < 8 || !user.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/)) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        db.users[index] = user

        res.status(201).json({
            message: "User created successfully",
            user
        });
});

// patch method with validations:
    // email validation: unique
    // email validation: keep email format
    // password validation: length 8 and more, only letters and numbers
app.patch("/v1/users/:id", (req, res) => {
    const { username, email, password } = req.body;
    const { id } = req.params;
    
    try {
        const index = db.users.findIndex(user => user.id == id);

        if (index === -1) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingUser = db.users[index];
        const user = { ...existingUser };

        // username validation
        if (username !== undefined) {
            user.username = username.trim();
            
            // username validation: unique
            if (user.username !== existingUser.username && db.users.find(it => it.username === user.username)) {
                return res.status(409).json({
                    message: "Username already exist"
                });
            };

            // username validation: min 3, max 35
            if (user.username.length < 3 || user.username.length > 35) {
                return res.status(400).json({
                    message: "Username length min 3 and max 35)"
                });
            }
        }

        // email validation if provided
        if (email !== undefined) {
            user.email = email;
            
            // email validation: unique
            if (user.email !== existingUser.email && db.users.find(it => it.email === user.email)) {
                return res.status(409).json({
                    message: "Email already exist"
                });
            }

            // email validation: keep email format
            // if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }
        }

        // password validation if provided
        if (password !== undefined) {
            user.password = password;
            
            // password validation: length 8 and more, only letters and numbers
            // if (user.password.length < 8 || !user.password.match(/^[A-Za-z0-9]+$/)) {
            if (user.password.length < 8 || !user.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/)) {
                return res.status(400).json({
                    message: "Invalid password"
                });
            }
        }

        db.users[index] = user;

        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete method with validations:
    // user id validation
app.delete("/v1/users/:id", (req, res) => {
    const { id } = req.params;

    const index = db.users.findIndex(user => user.id == id);

    if (index === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    db.users.splice(index, 1);

    res.status(200).json({message: `User id ${id} deleted`});
});

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
    // localhost ip address is 127.0.0.1
});