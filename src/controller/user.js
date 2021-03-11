import ApiError from "../error/ApiError.js"

export const home = async (req, res, next) => {
    try{
        res.send("Hello, World!")
    }catch(err){
        next(ApiError.internal('Something went Wrong...'))
    }
}

export const userRegister = async (req, res, next) => {
    try{
        res.sendStatus(201)
    }catch(err){
        next(ApiError.internal('Something went Wrong... (Registering User)'))
    }
}

export const userLogin = async (req, res, next) => {
    try{
        res.sendStatus(200)
    }catch(err){
        next(ApiError.internal('Something went Wrong... (Login User)'))
    }
}

export const userLogout = async (req, res, next) => {
    try{
        res.sendStatus(200)
    }catch(err){
        next(ApiError.internal('Something went Wrong... (Logout User)'))
    }
}