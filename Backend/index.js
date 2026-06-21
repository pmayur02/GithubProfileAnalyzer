require("dotenv").config();
const express = require("express");
const {rateLimit} = require("express-rate-limit");
const {router} = require("./Router/index");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors");



const app = express()

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});

const allowedOrigins = process.env.AllowedOrigins
app.use(cors({origin:allowedOrigins,credentials:true}));

app.use(limiter);

app.use("/",router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 8800;

app.get("/health",(req,res)=>{
    try {
        return res.json({message:"server status: running"});
    } catch (error) {
        throw error
    }
})


app.listen(PORT,()=>{
    console.log(`running on ${PORT}`);
})
