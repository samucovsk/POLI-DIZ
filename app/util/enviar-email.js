const ejs = require('ejs');
const path = require('path');

module.exports = async (url, token, tipoEmail) => {
    const filePath = path.join(__dirname, '../views/partial/email-template.ejs');
    
    return new Promise((resolve, reject) => {
        ejs.renderFile(filePath, { url, token, tipoEmail }, (err, html) => {
            if (err) {
                return reject(err); 
            }
            resolve(html); 
        });
    });
};