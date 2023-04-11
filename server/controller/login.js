const User = require('../models/user');
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
module.exports.LOGIN = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    const foundUser = await User.findOne({email: email}).exec();

    if(foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, r) {
            if (r == true) {
                const token = jwt.sign(
                    {
                        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                        data: {
                            email: foundUser.email,
                            id: foundUser._id,
                        },
                    },
                    "SECRET"
                );
                res.send({
                    message: "Login Successfully",
                    token: token,
                    user: {
                        email: foundUser.email,
                        id: foundUser._id,
                    },
                    status: 1,
                });
            } else {
                res.send({ message: "Invalid Password", status: 0 });
            }
        });
    }
    else {
        res.send({
            message: "Email not found", 
            status: 0,
        })
    }
}