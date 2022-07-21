import db from "../config/db.js"

async function getAllCategories(){
    return db.query("SELECT * FROM categories").rows;
}

const categoriesRepository = {
    getAllCategories
}

export default categoriesRepository;