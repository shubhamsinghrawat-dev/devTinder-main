const adminAuth = (req, res, next) => {
    console.log("middleware")
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send(("UNAUTHORIZED"))
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth
}