const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const gwtGenerator = require("../utils/jwtGenerator")
const authorization = require("../middleware/authorization");
const validInfo = require("../middleware/validInfo");


//registering

router.post("/register", validInfo, async (req, res) => {
    try {

        //1. destruction to req.body(name, email, password)
        
        const { name, email, password} = req.body;

        //2. check if user exists(id users exist then throw error )

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if(user.rows.length !== 0) {
            return res.status(401).send("Users is already exist");
        }


        //3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.gensalt(saltRound);
        
        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter the new user inside our database

        const newUser = await pool.query( "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, bcryptPassword]
      );


        //5. genarating our jwt token
        
        const token = jwtGenerator(newUser.rows[0].user_id);


        res.json({ token });
    }catch (err){
        console.error(err.massage);
        res.status(500).send("Server Error");
    }

});

    //login routes

    router.post("/register", validInfo, async (req, res) => {
        try {

        //1. destruction req.body

        const { email, password} = req.body;

        //2.check user if doesnt exists (if not we trow error)
        const user = await pool.quiry("SELECT * FROM users WHERE user_email =$1", [
            email
        ]);

        if(user.rows.length === 0){
            return res.status(401).json("Password and Email is incorrect");
        };


        //3. check if incoming password is thesame the database password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if(!validPassword){
            return res.status(401).json("Password or Email is Incorrect");
        };
        
        
        
        //4. give them the jwt token

        const token = jwtGenerator(user.rows[0].user.id);

        res.json({ token });






        }catch (err){
            console.error(err.massage);
            res.status(500).send("Server Error");
        }
    });


    router.get("/is-verify", authorization, (req, res) => {
        try {
          res.json(true);
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server error");
        }
      });
module.exports = router;