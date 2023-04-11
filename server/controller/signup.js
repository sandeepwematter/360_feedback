const User = require('../models/user');
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
module.exports.SIGNUP = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    const foundUser = await User.findOne({ email: email }).exec();
    if (foundUser) {
        res.send({ message: " User already exists", status: 0 })
    }
    else {
        var email = req.body.email;
        var password = req.body.password;
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                res.send({ message: "INTERNAL SERVER ERROR" });
            } else {
                const newUser = new User({
                    email: email, password: hash
                })
                newUser.save();
                res.send({
                    message: " User signed up successfully",
                    status: 1
                })
            }
        });
    }
}