import ApiError from "../error/ApiError.js";

const errorHandler = async (err, req, res, next) => {

    console.error(`${err.code}: ${err.message}`)

    if(err instanceof ApiError){
        return res.status(err.code).send({ error: err.message })
    }

    res.status(500).send({ error: "Something went Wrong..." })
}

export default errorHandler;