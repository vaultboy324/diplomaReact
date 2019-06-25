module.exports = {
    verifyToken: (req, res, next) => {
        const header = req.headers['authorization'];
        if(typeof header !== 'undefined'){
            next();
        } else {
            res.sendStatus(400);
        }
    }
}